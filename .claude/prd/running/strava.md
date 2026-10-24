## 5. Strava OAuth Flow

### 5.1 Overview

Strava OAuth is used **only for syncing workout data**, not for identity. The user already has an account via Google/Supabase — Strava is a data source integration.

```
[Connect Strava Button]
        ↓
Redirect ke https://www.strava.com/oauth/authorize
  ?client_id={STRAVA_CLIENT_ID}
  &response_type=code
  &redirect_uri={APP_URL}/api/auth/strava/callback
  &approval_prompt=auto
  &scope=read,activity:read_all,profile:read_all
        ↓
User approves on Strava
        ↓
Strava redirects to /api/auth/strava/callback?code=...
        ↓
Server exchanges code:
  POST https://www.strava.com/oauth/token
  body: { client_id, client_secret, code, grant_type: 'authorization_code' }
        ↓
Response: { access_token, refresh_token, expires_at, athlete }
        ↓
Encrypt tokens → save to strava_credentials table
        ↓
Trigger background job: initial backfill of all activities
```

### 5.2 Token refresh

Strava tokens expire every **6 hours**. Before every call to the Strava API:

```javascript
// Check if the token will expire within the next 5 minutes
if (Date.now() / 1000 > credentials.expires_at - 300) {
  const res = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST',
    body: JSON.stringify({
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: credentials.refresh_token,
    }),
  })
  const { access_token, refresh_token, expires_at } = await res.json()
  // Update encrypted values in DB
}
```

**Failure branches:**

| HTTP status from Strava | Meaning                                                                                                                   | Action                                                                                                                               |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `401 Unauthorized`      | Strava permanently revoked the token — user disconnected the app from their Strava settings, or the app was de-authorized | Set `needs_reconnect = TRUE` in `strava_credentials`. Abort the current Inngest job immediately (do not retry). Log error to Sentry. |
| `5xx` / network error   | Transient — Strava server issue or network blip                                                                           | Normal exponential backoff retry (existing Inngest behavior, unchanged).                                                             |

The `needs_reconnect` flag is the single source of truth for broken-connection state. Once set, all Strava Inngest jobs check this flag at the start of each run and exit early if it is `true` — this prevents pointless retries and Sentry noise while the connection is broken.

### 5.3 Webhook subscription

Real-time sync via Strava webhook — more efficient than polling:

```
POST https://www.strava.com/api/v3/push_subscriptions
  body: {
    client_id,
    client_secret,
    callback_url: {APP_URL}/api/sync/webhook,
    verify_token: {WEBHOOK_VERIFY_SECRET}
  }
```

Strava sends a GET to the callback URL first for verification (see section 8.6 for implementation details), then sends a POST for every event:

```json
{
  "aspect_type": "create",
  "event_time": 1747890000,
  "object_id": 12345678,
  "object_type": "activity",
  "owner_id": 987654
}
```

When Garmin is connected, each saved activity also triggers a Garmin match in the background (see `garmin-integration.md`, section 26.4). A Garmin failure never blocks the Strava save. If the same run was already imported from Garmin first, the webhook upgrades that row to Strava instead of adding a duplicate (section 26.5).

### 5.4 Initial backfill strategy

```
1. Fetch GET https://www.strava.com/api/v3/athlete/activities
     ?per_page=200&page=1
2. Loop all pages until response is empty
3. Per activity → insert into activities table
4. Queue background job per activity: fetch streams (HR, GPS, pace, cadence)
5. Throttle to ~80 req/15min to stay safe from rate limits (100/15min hard limit)
6. After completion → subscribe webhook + set last_sync_at
```

### 5.5 Rate limiting

| Limit           | Value           | Strategy                                     |
| --------------- | --------------- | -------------------------------------------- |
| Per 15 minutes  | 100 requests    | Throttle to 80, queue the rest               |
| Per day         | 1000 requests   | Monitor via Redis counter                    |
| Backfill        | Can be hundreds | Inngest step functions + exponential backoff |
| Webhook receive | Unlimited       | Process async, do not block response         |

### 5.6 Data Flow: Strava to Dashboard

End-to-end overview of how running data from Strava reaches the dashboard — from event arrival to insight appearing on screen.

```
Strava (new event)
        ↓
POST /api/sync/webhook
  └─ Receive JSON event from Strava (aspect_type, object_id, owner_id)
  └─ Immediately return 200 OK
  └─ Send event to Inngest: strava/handle-webhook-event
        ↓
Inngest: strava/handle-webhook-event
  └─ create  → fetch activity detail from Strava API
  └─ update  → re-fetch and update row in activities table
  └─ delete  → remove row from activities table
        ↓
Inngest: strava/fetch-streams
  └─ Fetch time-series HR/GPS/pace from Strava API
  └─ Downsample to 10s resolution (default)
  └─ Insert into activity_streams table
  └─ Trigger: ai/anomaly-detector
        ↓
Inngest: ai/anomaly-detector
  └─ Fetch latest activity + 30-day baseline for same activity type
  └─ Rules-based check: ACWR spike, HR drift, pace drop, consistency
  └─ If anomaly → insert into ai_insights (insight_type = 'anomaly')
  └─ Trigger: ai/generate-post-activity-insight
        ↓
Inngest: ai/generate-post-activity-insight
  └─ Build context: activity + splits + baseline + health log + goals + profile
  └─ Call Claude API (Sonnet 4.6, temp 0.3, max 700 tokens)
  └─ Validate output (length + section headers)
  └─ Insert into ai_insights (insight_type = 'post_activity')
  └─ Trigger push notification if notify_post_activity = true
        ↓
Dashboard (user opens app)
  └─ GET /api/activities        → recent activities list
  └─ GET /api/analytics/summary → weekly stats + training load
  └─ GET /api/ai/insights       → AI insight cards (post-activity + anomaly)
  └─ Render all data in UI
```

**Failure points and recovery:**

| Point                    | Failure mode                      | Recovery                                      |
| ------------------------ | --------------------------------- | --------------------------------------------- |
| Webhook not received     | Strava missed delivery            | Polling fallback every 1 hour via Vercel Cron |
| Strava API timeout       | fetch-streams fails               | Inngest auto-retry with exponential backoff   |
| Claude API timeout/error | insight not generated             | Inngest retry 1x after 5 minutes, then skip   |
| Invalid AI output        | content too short or wrong format | Retry 1x; if still fails: is_valid=false      |

**Typical latency (estimates):**

- Webhook received → data saved in DB: **~3–5 seconds**
- Data saved → insight available on dashboard: **~15–30 seconds** (depends on Inngest queue + Claude latency)
- Total from run end (Garmin/Strava sync) → insight on dashboard: **~2–5 minutes** (depends on device sync speed to Strava)

### 5.7 Disconnect Strava

```
1. Revoke token: DELETE https://www.strava.com/oauth/deauthorize
2. Unsubscribe webhook from Strava
3. Delete row in strava_credentials
4. Historical data in activities table REMAINS (default retain)
5. Sync stops — no new activities will be ingested
6. Dashboard continues to work with existing data
```

Garmin links on those activities stay as they are. Garmin has its own connection (see `garmin-integration.md`, section 26.3).

Users who want to delete their historical data can do so manually via Settings → Danger Zone → "Delete all activity data".

### 5.8 Connection Health & Broken State

Sometimes Strava permanently revokes a user's token without the user going through our Disconnect flow — for example, the user removed our app from their Strava settings directly, or Strava de-authorized the app for policy reasons. In this case, the next token refresh attempt returns a `401` and syncing stops silently.

This section defines how the system detects, surfaces, and recovers from that broken-connection state.

#### The `needs_reconnect` flag

A boolean column on `strava_credentials` tracks the broken state:

```sql
ALTER TABLE strava_credentials
  ADD COLUMN needs_reconnect BOOLEAN NOT NULL DEFAULT FALSE;
```

**Lifecycle:**

| Event                                            | Flag value                    |
| ------------------------------------------------ | ----------------------------- |
| Fresh Strava connect (OAuth callback)            | `FALSE` (default)             |
| Token refresh returns `401`                      | Set to `TRUE`                 |
| User completes reconnect OAuth flow successfully | Reset to `FALSE`              |
| User disconnects Strava (§5.7 normal disconnect) | Row deleted — flag irrelevant |

#### Inngest exit behavior

Every Inngest function that calls the Strava API must check the `needs_reconnect` flag **before doing any work**:

```javascript
// At the top of every Strava Inngest function
const credentials = await getStravaCredentials(userId)
if (credentials.needs_reconnect) {
  // Exit cleanly — no retry, no error thrown to Inngest
  return { skipped: true, reason: 'needs_reconnect' }
}
```

This prevents the job queue from filling up with retries that will always fail, and keeps Sentry clean while the connection is broken.

#### User Stories

> As a user, I want to be told when my Strava connection has been broken so that I know why new runs are not appearing.

> As a user, I want a clear path to reconnect Strava so that I can resume syncing without confusion.

#### Acceptance Criteria

```
GIVEN Strava returns 401 during token refresh
WHEN the refresh handler runs
THEN needs_reconnect is set to TRUE in strava_credentials
AND the current Inngest job exits without retry
AND the error is logged to Sentry

GIVEN needs_reconnect = TRUE
WHEN any Strava Inngest job starts
THEN the job exits immediately with { skipped: true, reason: 'needs_reconnect' }
AND no retry is scheduled

GIVEN needs_reconnect = TRUE
WHEN user opens any Running Tracker page
THEN a persistent amber banner appears below the top nav with text:
  "Your Strava connection has been revoked. Reconnect to resume syncing."
  and a "Reconnect Strava" button
AND the banner is not dismissible

GIVEN the banner is showing
WHEN user clicks "Reconnect Strava" and completes the OAuth flow successfully
THEN needs_reconnect is reset to FALSE
AND the banner disappears on the next page render
AND Strava sync resumes normally

GIVEN user is on the Settings page and needs_reconnect = TRUE
WHEN the "Strava Connection" section renders
THEN a warning state is shown with a "Reconnect Strava" button (same OAuth flow as onboarding)
THEN clicking "Reconnect Strava" starts the OAuth flow
```

#### UI Spec — Persistent Broken-Connection Banner

The banner shows on **all Running Tracker pages** when `needs_reconnect = true`. It sits below the top navigation bar and above all page content. It is not dismissible — it stays until the user reconnects.

| Property    | Value                                                                           |
| ----------- | ------------------------------------------------------------------------------- |
| Placement   | Below top nav, above all page content                                           |
| Color       | Amber / warning (`bg-amber-50 border-amber-200 text-amber-800`)                 |
| Icon        | `AlertTriangle` (amber)                                                         |
| Message     | "Your Strava connection has been revoked. Reconnect to resume syncing."         |
| CTA button  | "Reconnect Strava" → same OAuth flow as onboarding (`/api/auth/strava/connect`) |
| Dismissible | No — stays until reconnect succeeds                                             |
| Test IDs    | `stravaDisconnectBanner`, `stravaReconnectBtn`                                  |

### 5.9 Re-enrich Endpoints (Admin / Maintenance)

These endpoints are not user-facing. They are used to backfill or recalculate derived data for existing activities after schema or algorithm changes.

```
POST /api/running/v1/auth/strava/re-enrich
```

Queues `strava/fetch-streams` Inngest events for every Strava activity belonging to the authenticated user. Used to backfill stream data (HR, GPS, pace) for activities that were synced before streams were captured. Requires Strava to be connected (`rt_strava_credentials` row must exist). Response: `{ queued: N }` where N is the number of events sent.

```
POST /api/running/v1/auth/strava/re-enrich-metrics
```

Recomputes derived metrics (Efficiency Factor, Aerobic Decoupling, Estimated VO2max) for up to 200 activities that are missing at least one metric and meet gate conditions (`moving_time_sec > 20 min` AND `avg_hr NOT NULL`). Runs synchronously (no Inngest). Response: `{ success: true, data: { processed: N, updated: M } }`.

Both endpoints require session auth (401 if not authenticated).

---

#### Settings — Strava Connection Section

The Settings page must have a "Strava Connection" section that handles both states:

**Connected state** (existing, no change to §5.7 behavior):

- Athlete name + `last_sync_at` timestamp
- "Disconnect" button

**Broken state** (`needs_reconnect = TRUE`):

- Warning message: "Your Strava connection has been revoked. Reconnect to resume syncing."
- "Reconnect Strava" button → triggers same OAuth flow as onboarding
- After successful reconnect: `needs_reconnect` cleared to `FALSE`, banner disappears, sync resumes

#### Error States

| Scenario                                       | Classification                           | Handling                                                                  |
| ---------------------------------------------- | ---------------------------------------- | ------------------------------------------------------------------------- |
| Token refresh returns `401`                    | Permanent — Strava revoked authorization | Set `needs_reconnect = TRUE`, abort Inngest job (no retry), log to Sentry |
| Token refresh returns `5xx` or network timeout | Transient                                | Normal exponential backoff retry (existing behavior, unchanged)           |
| OAuth reconnect fails                          | User-facing error                        | Show error message in Settings / banner area; flag stays `TRUE`           |

---
