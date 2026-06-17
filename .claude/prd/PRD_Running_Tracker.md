# Product Requirements Document (PRD)

## Personal Running & Health Performance Platform

**Version:** 3.2
**Last Updated:** 2026-06-17
**Owner:** Rafael Cahya
**Stack:** Next.js 15 App Router · JavaScript/JSX · Supabase (shared auth) · PostgreSQL · Tailwind CSS · shadcn/ui · Claude AI (Sonnet 4.6) · Strava API

---

## Product Release Plan

> PRD version = document revision (tracks requirement changes).
> Product release version = what ships to production (GitHub milestone).

| Release  | Status  | GitHub Milestone                                                       | PRD Coverage                                                                                                  | Issues      |
| -------- | ------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------- |
| **v1.0** | Shipped | —                                                                      | RT PRD v1.0–v2.6 (all features to date: Dashboard, Activities, Race Log, Training Load, Sidebar)              | —           |
| **v1.1** | Planned | [v1.1](https://github.com/rafaelcahya/personal-management/milestone/2) | §10 Analytics (10.2 page, 10.4 VO2max), §10.4 Efficiency Factor, §11 AI Coach                                 | #4 #5 #6 #7 |
| **v1.2** | Planned | [v1.2](https://github.com/rafaelcahya/personal-management/milestone/3) | TBD                                                                                                           | —           |
| **v1.7** | Planned | [v1.7](https://github.com/rafaelcahya/personal-management/milestone/8) | §10.11 Injury & Sports Medicine AI Coach: Physio + Sports Medicine personas, InjuryCoachCard, rt_symptom_logs | #160        |

---

## 1. Overview

Running Tracker is a personal web app for monitoring running performance. It is not a social app and not a Strava replacement — it is a **personal analytics layer** on top of existing Strava data, paired with an AI Coach powered by Claude that has access to your full workout history.

**Two things you cannot get from Strava or Garmin Connect:**

- An AI Coach that genuinely understands your training history and can reason from your specific data
- Custom cross-metric analytics tailored to your needs (not generic summaries)

**Relationship with Personal Management:**

- Separate application (own repo), but uses the **same Supabase project** for auth
- User logs in once via Google OAuth in Supabase → session is valid in both apps
- No changes required in the Personal Management codebase

---

## 2. Users & Access

| Role               | Access                      |
| ------------------ | --------------------------- |
| Authenticated User | Full access to all features |
| Unauthenticated    | Redirect to login           |

- Auth via Supabase (Google OAuth only) — shared with Personal Management
- Strava OAuth is separate, used only for data sync (not identity)
- Single-user app — no multi-user, no social features

---

## 3. Integration with Personal Management

### 3.1 Auth sharing

Running Tracker and Personal Management use the **same** Supabase project. This means:

```
User login via Google OAuth
        ↓
Supabase (shared project) issue session
        ↓
Session cookie valid in both Personal Management AND Running Tracker
```

**Required in Running Tracker:**

- `NEXT_PUBLIC_SUPABASE_URL` — same as Personal Management
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — same as Personal Management
- Supabase `@supabase/ssr` package for session management

**What does NOT need to be done:**

- No modifications to the Personal Management codebase
- No new endpoints in Personal Management
- No user data sync between the two systems

### 3.2 User ID

The user ID in Supabase is a UUID. All tables in the Running Tracker DB use `user_id UUID` as a foreign key referencing `auth.users.id` in Supabase.

---

## 4. Onboarding Flow

New users who log in for the first time need to go through a short setup before they can use the app. Without this, the AI Coach has no biometric data and cannot give accurate recommendations.

```
Login via Google OAuth (Supabase)
        ↓
Middleware checks: does the user already exist in the users table?
        ↓ no
Create new row in users + user_settings (with default values)
        ↓
Redirect to /onboarding
        ↓
Step 1 — Biometric setup (required)
  - Max heart rate (manual input or formula 220 - age)
  - Resting heart rate baseline
  - Height + current weight
  - Birth date (for age-based max HR calculation)
        ↓
Step 2 — Connect Strava (required for automatic data, can skip for manual-only)
  - "Connect Strava" button → triggers OAuth flow
  - Or "Skip for now, I'll add manually"
        ↓
Step 3 — Set first goal (optional, can skip)
  - Upcoming race? Target distance + date
  - Or "No race planned yet"
        ↓
Redirect to /dashboard
  - If Strava connected → show backfill progress
  - If Strava skipped → show empty state with manual entry CTA
```

**When onboarding is considered complete:**

- Biometric step done → flag `onboarding_complete = true` in `users` table
- Strava and goal are optional and do not block access to the dashboard

Add column to schema:

```sql
ALTER TABLE users ADD COLUMN onboarding_complete BOOLEAN DEFAULT FALSE;
```

---

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

## 6. Tech Stack

| Layer           | Technology                | Notes                                                               |
| --------------- | ------------------------- | ------------------------------------------------------------------- |
| Framework       | Next.js 15 App Router     | JavaScript/JSX — matches Personal Management                        |
| UI              | Tailwind CSS + shadcn/ui  | Matches Personal Management for visual consistency                  |
| Charts          | Recharts (Phase 1)        | Visx for correlation view in Phase 2                                |
| Map             | Leaflet + OpenStreetMap   | Renders activity routes                                             |
| Database        | PostgreSQL 16             | Standard PG with proper indexing — no TimescaleDB                   |
| ORM             | Drizzle ORM               | Lightweight, well-suited to Next.js API routes                      |
| Auth            | Supabase SSR              | Shared project with Personal Management                             |
| Data sync       | Strava API                | OAuth + webhook + polling fallback                                  |
| AI              | Claude API (Sonnet 4.6)   | Running coach, tool use, streaming SSE — Sonnet for all queries     |
| Background jobs | Inngest                   | Serverless-native job queue — backfill, sync, AI insight generation |
| Cache           | Redis (Upstash)           | Rate limit counter, AI context cache                                |
| File storage    | Cloudflare R2             | GPX/FIT file upload + backup                                        |
| Deployment      | Vercel                    | Web app + API routes — serverless                                   |
| Monitoring      | Sentry + Vercel Analytics |                                                                     |

---

## 6.1 UI Design Standards

These rules apply to all components in Running Tracker. Frontend and UI/UX agents must follow this as the source of truth.

### Input Focus Ring

All `<Input>` elements (shadcn) and `<textarea>` elements **must** use the violet focus ring, not the default gray from the CSS variable `--ring`:

```
focus-visible:ring-violet-200 focus-visible:border-violet-600
```

For native `<textarea>` (not shadcn):

```
focus:outline-none focus:ring-2 focus:ring-violet-500
```

**Reason:** The default `--ring` in globals.css is dark gray (`0 0% 3.9%`), which is inconsistent with the violet brand color used across the running tracker UI.

### Brand Color

Primary accent: `violet-600` (`#7c3aed`) — used for CTA buttons, active states, focus rings, and highlights.

---

## 7. Features & Scope per Phase

### 6.1 Phase 1 — MVP (target 6–7 weeks)

**Required modules:**

| Module          | Description                                                     |
| --------------- | --------------------------------------------------------------- |
| Auth & setup    | Supabase shared auth + Strava connect flow                      |
| Strava sync     | OAuth, webhook, backfill, polling fallback, rate limit handling |
| File upload     | GPX/FIT parser, dedup logic, batch upload                       |
| Manual entry    | Workout form + daily health log (mood, sleep, energy, weight)   |
| Dashboard       | Weekly summary + training load indicator + recent activities    |
| Activity detail | Chart pace, HR, elevation, splits table, map, HR zones          |
| Activity list   | Filter by date/type, search                                     |
| Analytics       | Trend charts, training load (ACWR), race predictor, PR tracking |
| AI Coach        | Chat + 5 modes + 8 tools + insight generation                   |

**Not in Phase 1:**

- Garmin integration
- HRV/sleep auto-sync
- Correlation view (requires more than 1 month of data)
- Composite readiness score

### 6.2 Phase 2 — Health integration (4–6 weeks after MVP)

| Module             | Description                                                         |
| ------------------ | ------------------------------------------------------------------- |
| Garmin integration | Official API (if approved) or unofficial library                    |
| Health metrics     | Sleep stages, HRV, RHR, steps, body battery, stress, SpO2           |
| Health dashboard   | Daily health card + mini trends                                     |
| Correlation view   | 2-metric interactive overlay (3-month rolling)                      |
| Readiness score    | Daily composite score (sleep + HRV + training load)                 |
| AI Coach advanced  | Cross-metric reasoning, anomaly detection, readiness-based planning |

### 6.3 Phase 3 — Future (TBD)

- Hydration tracking + reminder
- Nutrition logging
- Race calendar integration
- PDF weekly report export
- Voice AI Coach
- Weather-adjusted analysis

---

## 8. Database Schema

### 7.1 Phase 1 tables

```sql
-- ==================== USERS ====================
-- Synced from Supabase auth.users, adds biometric fields
CREATE TABLE users (
  id UUID PRIMARY KEY,               -- same as Supabase auth.users.id
  email TEXT UNIQUE NOT NULL,
  display_name TEXT,
  birth_date DATE,
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),            -- baseline
  max_hr INT,
  resting_hr_baseline INT,
  vo2_max_baseline NUMERIC(4,1),
  sex TEXT,                        -- 'male' | 'female' | null (used for fitness age calculation)
  threshold_pace_sec INT,          -- threshold pace in sec/km (Daniels-style, for pace zones)
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== STRAVA CREDENTIALS ====================
CREATE TABLE strava_credentials (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  athlete_id BIGINT,
  access_token TEXT,                 -- encrypted AES-256
  refresh_token TEXT,                -- encrypted AES-256
  expires_at TIMESTAMPTZ,
  scope TEXT,
  last_sync_at TIMESTAMPTZ,
  webhook_subscription_id BIGINT,
  needs_reconnect BOOLEAN NOT NULL DEFAULT FALSE  -- TRUE when Strava returns 401 on refresh; cleared on successful reconnect
);

-- Migration for existing installations:
-- ALTER TABLE strava_credentials ADD COLUMN needs_reconnect BOOLEAN NOT NULL DEFAULT FALSE;

-- ==================== ACTIVITIES ====================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  source TEXT CHECK (source IN ('strava','gpx_upload','fit_upload','manual')),
  external_id TEXT,                  -- Strava activity ID
  started_at TIMESTAMPTZ NOT NULL,
  duration_sec INT NOT NULL,
  moving_time_sec INT,
  distance_m NUMERIC(10,2) NOT NULL,
  avg_pace_sec_per_km NUMERIC(6,2),
  max_pace_sec_per_km NUMERIC(6,2),
  avg_hr INT,
  max_hr INT,
  avg_cadence INT,
  elevation_gain_m NUMERIC(7,2),
  elevation_loss_m NUMERIC(7,2),
  calories INT,
  activity_type TEXT,                -- easy/tempo/interval/long/race/recovery
  perceived_exertion INT,            -- RPE 1–10
  notes TEXT,
  weather_summary JSONB,
  raw_data JSONB,                    -- backup raw Strava response
  -- Derived metrics (computed at ingest time — see section 11.4)
  efficiency_factor NUMERIC(6,4),
  aerobic_decoupling NUMERIC(5,2),
  estimated_vo2max NUMERIC(5,2),
  has_heartrate BOOLEAN DEFAULT FALSE,
  device_watts BOOLEAN DEFAULT FALSE,
  avg_watts NUMERIC(7,2),
  weighted_avg_watts NUMERIC(7,2),
  pr_count INT DEFAULT 0,
  relative_effort INT,
  gear_id TEXT,
  enriched_at TIMESTAMPTZ,           -- set after streams + derived metrics are computed
  created_at TIMESTAMPTZ DEFAULT NOW()
  -- dedup via application, not DB constraint — see section 8.3 Deduplication
);

CREATE INDEX idx_activities_user_date ON activities(user_id, started_at DESC);
CREATE INDEX idx_activities_external ON activities(source, external_id);

-- ==================== ACTIVITY STREAMS (time-series) ====================
CREATE TABLE activity_streams (
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  timestamp TIMESTAMPTZ NOT NULL,
  latitude NUMERIC(10,7),
  longitude NUMERIC(10,7),
  altitude_m NUMERIC(7,2),
  heart_rate INT,
  cadence INT,
  pace_sec_per_km NUMERIC(6,2),
  distance_m NUMERIC(10,2),
  velocity_m_s NUMERIC(5,2),
  PRIMARY KEY (activity_id, timestamp)
);

-- ==================== SPLITS ====================
CREATE TABLE activity_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
  split_number INT,
  distance_m NUMERIC(10,2),
  duration_sec INT,
  pace_sec_per_km NUMERIC(6,2),
  avg_hr INT,
  elevation_gain_m NUMERIC(7,2)
);
CREATE INDEX idx_splits_activity ON activity_splits(activity_id);

-- ==================== SUBJECTIVE HEALTH LOG ====================
CREATE TABLE subjective_health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  log_date DATE NOT NULL,
  sleep_hours NUMERIC(3,1),
  sleep_quality TEXT,                -- 'good', 'ok', 'bad'
  morning_energy INT,                -- 1–5
  mood TEXT,
  soreness_level INT,                -- 1–5
  manual_rhr INT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, log_date)
);

-- ==================== WEIGHT LOGS ====================
CREATE TABLE weight_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  measured_at TIMESTAMPTZ NOT NULL,
  weight_kg NUMERIC(5,2),
  body_fat_pct NUMERIC(4,1),
  notes TEXT
);
CREATE INDEX idx_weight_user_date ON weight_logs(user_id, measured_at DESC);

-- ==================== TRAINING METRICS ====================
CREATE TABLE daily_training_metrics (
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  training_load NUMERIC(6,2),       -- daily TSS or TRIMP
  acute_load_7d NUMERIC(6,2),
  chronic_load_28d NUMERIC(6,2),
  acwr NUMERIC(4,2),
  readiness_score INT,              -- nullable, populated in Phase 2
  PRIMARY KEY (user_id, date)
);

-- ==================== AI COACH ====================
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT,
  mode TEXT DEFAULT 'default',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('user','assistant','system','tool')),
  content TEXT,
  tool_calls JSONB,
  context_refs JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_messages_conversation ON ai_messages(conversation_id, created_at);

CREATE TABLE ai_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  insight_type TEXT,                -- 'weekly_review', 'anomaly', 'recommendation'
  severity TEXT,                    -- 'info', 'attention', 'warning'
  title TEXT,
  content TEXT,
  data_refs JSONB,
  acknowledged BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_ai_insights_user_unread ON ai_insights(user_id, acknowledged, created_at DESC);

-- ==================== USER SETTINGS ====================
CREATE TABLE user_settings (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  hr_zones_method TEXT DEFAULT 'max_hr',   -- 'max_hr', 'karvonen', 'threshold'
  threshold_hr INT,                        -- set when method = 'threshold'
  push_notifications_enabled BOOLEAN DEFAULT FALSE,
  push_subscription JSONB,                 -- Web Push subscription object
  notify_post_activity BOOLEAN DEFAULT TRUE,
  notify_weekly_review BOOLEAN DEFAULT TRUE,
  notify_anomaly BOOLEAN DEFAULT TRUE,
  notify_friday_prep BOOLEAN DEFAULT TRUE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==================== GOALS ====================
CREATE TABLE goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  goal_type TEXT,                   -- 'race', 'distance_weekly', 'pace_target'
  target_date DATE,
  target_distance_m NUMERIC(10,2),
  target_time_sec INT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7.2 Phase 2 tables (prepared, created when Phase 2 begins)

```sql
-- Garmin credentials (method TBD)
CREATE TABLE garmin_credentials (
  user_id UUID REFERENCES users(id) PRIMARY KEY,
  credentials_data JSONB,            -- encrypted
  last_sync_at TIMESTAMPTZ
);

-- Daily health aggregate from Garmin
CREATE TABLE daily_health (
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  steps INT,
  active_calories INT,
  total_calories INT,
  resting_hr INT,
  hrv_overnight_avg NUMERIC(5,2),
  body_battery_max INT,
  body_battery_min INT,
  stress_avg INT,
  spo2_avg NUMERIC(4,1),
  respiratory_rate_avg NUMERIC(4,1),
  source TEXT,
  PRIMARY KEY (user_id, date)
);

-- Sleep records
CREATE TABLE sleep_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  sleep_start TIMESTAMPTZ,
  sleep_end TIMESTAMPTZ,
  total_sleep_sec INT,
  deep_sleep_sec INT,
  rem_sleep_sec INT,
  light_sleep_sec INT,
  awake_sec INT,
  sleep_score INT,
  source TEXT,
  UNIQUE(user_id, date)
);

-- HRV time-series
CREATE TABLE hrv_records (
  user_id UUID REFERENCES users(id),
  timestamp TIMESTAMPTZ NOT NULL,
  hrv_value NUMERIC(5,2)
);
CREATE INDEX idx_hrv_user_time ON hrv_records(user_id, timestamp);
```

---

## 9. API Endpoints

### 8.1 Auth

```
POST  /api/auth/login                        ← trigger Supabase Google OAuth
GET   /api/auth/me                           ← return user session info (id, email, name, avatar)
POST  /api/running/v1/auth/strava/connect    ← redirect to Strava authorize URL
GET   /api/running/v1/auth/strava/callback   ← receive code, exchange token, trigger backfill
POST  /api/running/v1/auth/strava/disconnect ← revoke Strava token, retain historical data
POST  /api/auth/logout                       ← clear Supabase session
```

### 8.2 User Profile & Settings

```
GET    /api/running/v1/user/profile        ← read biometric (max_hr, height, weight, sex, threshold_pace_sec, etc.)
PATCH  /api/running/v1/user/profile        ← update biometric + display name
GET    /api/running/v1/user/hr-zones       ← read HR zones settings (max_hr, resting_hr, threshold_hr, method)
PATCH  /api/running/v1/user/hr-zones       ← update HR zones settings
GET    /api/running/v1/user/settings       ← read preferences (notification toggles, push_subscription, etc.)
PATCH  /api/running/v1/user/settings       ← update preferences (incl. pace zone threshold)
GET    /api/running/v1/user/strava-status  ← check if Strava is connected + last_sync_at
                                           ← response: { connected: boolean, athlete_id, last_sync_at, needs_reconnect: boolean }
DELETE /api/running/v1/user/activities     ← delete all activity data (Danger Zone)
GET    /api/running/v1/user/max-hr-detect  ← detect max HR from highest recorded activity HR
GET    /api/running/v1/user/threshold-pace-detect ← auto-detect threshold pace from stream data (see section 21b)
POST   /api/running/v1/user/push-subscription     ← save Web Push subscription object
DELETE /api/running/v1/user/push-subscription     ← remove subscription (user disabled notifications)
```

### 8.3 Activities

```
GET    /api/activities                 ← list, filter: ?from=&to=&type=&page=
GET    /api/activities/:id             ← full detail
GET    /api/activities/:id/streams     ← time-series HR/GPS/pace/cadence
                                       ← ?resolution=raw|1s|5s|10s|30s (default: 10s)
POST   /api/activities                 ← manual entry
POST   /api/activities/upload          ← GPX or FIT file upload
PATCH  /api/activities/:id             ← edit notes, type, RPE
DELETE /api/activities/:id
```

### 8.3.1 Deduplication strategy

Three duplicate scenarios can occur:

**Scenario A — Strava syncs the same activity twice**
Can happen when polling and webhook are both active, or when backfill overlaps with normal sync.

Solution: check by `external_id` (Strava activity ID) before insert.

```javascript
// Before inserting an activity from Strava
const existing = await db
  .select()
  .from(activities)
  .where(and(eq(activities.source, 'strava'), eq(activities.external_id, stravaActivityId)))
  .limit(1)

if (existing.length > 0) return // skip, already exists
```

**Scenario B — User manual entry for an activity already synced from Strava**
Example: user manually enters a treadmill run, then realises it already synced from Strava.

Solution: fuzzy match on manual entry — `started_at` within ±5 minutes AND `distance_m` within ±200m.

```javascript
async function findPotentialDuplicate(userId, startedAt, distanceM) {
  const fiveMinutes = 5 * 60 * 1000
  const from = new Date(new Date(startedAt).getTime() - fiveMinutes).toISOString()
  const to = new Date(new Date(startedAt).getTime() + fiveMinutes).toISOString()

  return await db
    .select()
    .from(activities)
    .where(
      and(
        eq(activities.user_id, userId),
        between(activities.started_at, from, to),
        between(activities.distance_m, distanceM - 200, distanceM + 200)
      )
    )
    .limit(1)
}
```

If a match is found → show a warning to the user: "This activity looks like it already exists from Strava. Save anyway?" The user decides, not the system.

**Scenario C — GPX/FIT upload for an activity already synced from Strava**
User uploads a GPX file from Garmin for an activity that was already auto-synced via Strava.

Solution: same as Scenario B — fuzzy match `started_at` ±5 minutes and `distance_m` ±200m. Also check `source != 'manual'` to avoid blocking intentional uploads.

**Deduplication tolerance summary:**

| Field         | Tolerance   | Reason                                                              |
| ------------- | ----------- | ------------------------------------------------------------------- |
| `started_at`  | ±5 minutes  | GPS start and manual start can differ by a few minutes              |
| `distance_m`  | ±200m       | Strava and Garmin often differ slightly in GPS distance calculation |
| `external_id` | exact match | Strava ID is unique — no tolerance                                  |

### 8.4 Health (Phase 1 — manual input)

```
GET    /api/health/subjective          ← list logs, filter: ?from=&to=
POST   /api/health/subjective          ← post daily log (sleep, energy, mood, etc.)
PATCH  /api/health/subjective/:id      ← edit an existing log
DELETE /api/health/subjective/:id      ← delete a single day log

GET    /api/health/weight              ← list weight entries
POST   /api/health/weight              ← add weight entry
PATCH  /api/health/weight/:id          ← correct a wrong entry
DELETE /api/health/weight/:id          ← delete entry
```

### 8.5 Streams downsampling strategy

Strava stores stream data at 1 data point per second resolution. A 1-hour run = **3,600 rows**, a 3-hour run = **10,800 rows**. Sending all of this to the browser for chart rendering is wasteful — a chart with 3,600 points and one with 300 points look identical visually.

**Approach:** server-side downsampling based on the `resolution` parameter:

| Resolution | Interval   | Points for 1-hour run | Best for                           |
| ---------- | ---------- | --------------------- | ---------------------------------- |
| `raw`      | 1 second   | ~3,600                | Export / heavy analysis            |
| `1s`       | 1 second   | ~3,600                | Same as raw                        |
| `5s`       | 5 seconds  | ~720                  | Detail view with zoom              |
| `10s`      | 10 seconds | ~360                  | **Default** — activity detail page |
| `30s`      | 30 seconds | ~120                  | Overview / thumbnail               |

**Server implementation:**

```javascript
// Fetch data from DB, then sample every N seconds
function downsample(streams, intervalSeconds) {
  if (intervalSeconds <= 1) return streams

  const result = []
  let lastTimestamp = null

  for (const point of streams) {
    const t = new Date(point.timestamp).getTime() / 1000
    if (lastTimestamp === null || t - lastTimestamp >= intervalSeconds) {
      result.push(point)
      lastTimestamp = t
    }
  }
  return result
}
```

**Rules:**

- Default response is always `10s` — client does not need to send the parameter unless detail is required
- `raw` is only allowed for exports, not for chart rendering
- Response always includes `meta.total_points` and `meta.resolution` so the client knows which resolution is in use

### 8.6 Sync

```
POST   /api/sync/strava                ← manual trigger sync (polling)
GET    /api/sync/status                ← check sync status + last_sync_at
GET    /api/sync/webhook               ← Strava challenge verification (see detail below)
POST   /api/sync/webhook               ← Strava sends create/update/delete event
POST   /api/sync/webhook/subscribe     ← register webhook with Strava
DELETE /api/sync/webhook/subscribe     ← unsubscribe webhook
```

#### Webhook verification flow (GET /api/sync/webhook)

When first registering a webhook with Strava, Strava immediately sends a GET request to the callback URL to verify that the endpoint is valid and belongs to us. If we do not respond correctly, webhook registration fails.

**Request from Strava:**

```
GET /api/sync/webhook
  ?hub.mode=subscribe
  &hub.challenge=abc123randomstring
  &hub.verify_token=WEBHOOK_VERIFY_SECRET
```

**What the endpoint must do:**

```javascript
// app/api/sync/webhook/route.js
export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const mode = searchParams.get('hub.mode')
  const challenge = searchParams.get('hub.challenge')
  const token = searchParams.get('hub.verify_token')

  // Verify the request is genuinely from Strava using our configured verify token
  if (mode === 'subscribe' && token === process.env.WEBHOOK_VERIFY_SECRET) {
    return Response.json({ 'hub.challenge': challenge })
  }

  return new Response('Forbidden', { status: 403 })
}
```

**What the endpoint must do when POST event arrives:**

```javascript
export async function POST(request) {
  const event = await request.json()
  // { aspect_type: 'create'|'update'|'delete', object_id, object_type, owner_id }

  // Langsung return 200 dulu — Strava expects fast response (< 2 detik)
  // Proses event secara async via Inngest
  await inngest.send({
    name: 'strava/handle-webhook-event',
    data: event,
  })

  return new Response('OK', { status: 200 })
}
```

**Important:** The POST webhook endpoint must immediately return `200 OK` and hand off to Inngest. If the response takes > 2 seconds, Strava considers it failed and will retry. Do not process the sync inside this handler.

### 8.7 Analytics

```
GET   /api/analytics/summary                        ← ?period=week|month|year
GET   /api/analytics/trends                         ← ?metric=pace|distance|hr&period=12w
GET   /api/analytics/training-load                  ← ACWR, acute 7d, chronic 28d
GET   /api/analytics/race-predictor                 ← predict all distances from latest PR
GET   /api/analytics/prs                            ← best time per distance (1K/5K/10K/half/full)
GET   /api/analytics/vo2                            ← estimate VO2 max from HR + pace
GET   /api/running/v1/analytics/fitness-age         ← weekly fitness age trend (see section 11.2)
GET   /api/running/v1/analytics/endurance-score     ← weekly endurance score trend (see section 11.2)
GET   /api/running/v1/analytics/pmc                 ← performance management chart data (see section 11.2)
                                                    ← ?days=30|60|90 (default: 90)
GET   /api/running/v1/analytics/calorie-trend       ← monthly calorie burn trend (see section 11.2)
GET   /api/running/v1/analytics/zones               ← zone breakdown for HR, pace, cadence
                                                    ← ?range=&activity_type=&start_date=&end_date=
GET   /api/running/v1/analytics/gear                ← gear usage breakdown
                                                    ← ?range=&activity_type=&start_date=&end_date=
GET   /api/running/v1/calendar                      ← activity calendar data for a month
                                                    ← ?month=YYYY-MM&type= (see section 11.1)
```

### 8.8 AI Insight Engine

```
GET   /api/running/v1/ai/insights                  ← list all insights, filter: ?type=&acknowledged=
GET   /api/running/v1/ai/insights/:id              ← detail of one insight
PATCH /api/running/v1/ai/insights/:id/ack          ← mark insight as read
POST  /api/running/v1/ai/insights/generate         ← trigger on-demand analysis (body: { activity_id, focus })
POST  /api/running/v1/ai/insights/daily            ← manually trigger daily insight generation
                                                   ← body: { force?: boolean }; rate-limited to 1/hour unless force=true
                                                   ← queues Inngest event ai/generate-daily-insight
POST  /api/running/v1/ai/insights/followup         ← follow-up question on an existing insight
                                                   ← body: { question: string, insightId: string }
                                                   ← calls Claude (Sonnet 4.6, temp 0.3, max 200 tokens)
                                                   ← returns { content: string }; not saved to DB
POST  /api/running/v1/ai/injury-coach              ← submit injury/pain question (see section 10.11)
GET   /api/running/v1/ai/injury-coach/history      ← last 20 injury coach responses for the user
                                                   ← returns { data: [{ id, created_at, content, data_refs }] }

-- Deferred to Phase 2 (Chat Coach):
-- POST  /api/ai/chat
-- GET   /api/ai/conversations
-- GET   /api/ai/conversations/:id
-- DELETE /api/ai/conversations/:id
```

---

## 10. AI Insight Engine

> Full implementation detail is in `running/05_AI_Coach_Implementation_Spec.md`. This section is a summary for PRD context.

### 10.1 Approach

The AI does not run as a chat interface — it runs **automatically in the background** whenever a new activity arrives or on a schedule. The output is structured insight cards that appear directly on the dashboard and activity detail page.

You do not need to ask anything. The AI notices, analyses, and tells you.

> **Chat Coach** is deferred to Phase 2 — after the Insight Engine is running and enough data is available to validate insight quality.

---

### 10.2 Five insight types

#### 10.2.1 Post-activity insight

**Trigger:** after each activity finishes syncing from Strava (streams are in DB)
**Shown in:** activity detail page + dashboard (most recent card)
**Notification:** Yes — title + first sentence of summary

Input: activity detail, per-km splits, 4-week baseline, training load, that day's health log, goals, profile.

Output format (markdown):

```
## Summary
## Highlights
## Things to Watch  ← only when applicable
## Next Session Recommendation
```

Example output:

> "Your 10km easy run today was solid — pace 5:55/km was consistent across all splits with only ±8s/km variance. Average HR 138 bpm, down 4 bpm vs last week's easy run at the same pace — a sign of good aerobic adaptation."

#### 10.2.2 Weekly review

**Trigger:** Vercel Cron every Sunday 19:00
**Shown in:** dashboard (weekly card)
**Notification:** Yes

Input: all this week's activities, training load, this week's health log, 4-week prior summary, goals.

Output format (markdown, max 300 words):

```
## This Week's Summary
## Training Balance
## vs Last Week
## Focus for Next Week
```

#### 10.2.3 Anomaly alert

**Trigger:** after each post-activity insight completes (programmatic check, no Claude)
**Shown in:** dashboard (warning card)
**Notification:** Yes — only for severity >= `attention`

Four conditions checked via rules-based logic:

- ACWR > 1.5 → severity `warning`
- HR avg > baseline × 1.10 di pace yang sama → severity `attention`
- Pace > baseline × 1.08 untuk tipe yang sama → severity `attention`
- No activities for > 10 days when the user normally runs ≥ 3×/week → severity `info`

Claude is called **only to write a personalised description** after an anomaly is detected.

#### 10.2.4 Daily insight

**Trigger:** Vercel Cron daily 06:00; also triggerable via `POST /api/running/v1/ai/insights/daily`
**Shown in:** dashboard (daily card); also on the AI Coach page via `DailyInsightCard`
**Notification:** No — shown on dashboard only

Focus is determined automatically: race approaching → taper/readiness, high ACWR → recovery, long gap → motivational, default → general training tip.

Skipped if the user has fewer than 3 stored activities.

#### 10.2.5 On-demand activity analysis

**Trigger:** user clicks the "Analyze" button on the activity detail page
**Shown on:** activity detail page, below the charts
**Notification:** No

```
POST /api/ai/insights/generate
body: { activity_id: "uuid", type: "post_activity" }
```

---

#### 10.2.6 Analytics Section Recommendations (`analytics_summary`)

Every time a new activity arrives, the AI automatically analyses data on the Analytics page and provides a recommendation per section. The trigger is event-driven — no new activity = no analysis.

**Trigger:** Inngest event chaining from post-activity flow. After `generatePostActivityInsight` completes, fires event `ai/generate-analytics-summary` with `triggered_by_activity_id`.

**Staleness check:** When the Analytics page loads, the API checks whether `max(rt_activities.started_at)` is newer than `max(rt_ai_insights.created_at WHERE insight_type = 'analytics_summary')`. If yes → queue job. If no → show the last insight immediately.

**Claude call design:** 1 call for all sections. Claude returns JSON with a key per section: `weekly_distance`, `pace_trend`, `training_load`, `vo2max_trend`, `ef_trend`, `race_predictor`. Each key has `{ headline, body_markdown }`.

**Section coverage (6 sections, skipping SummaryStats and CurrentVO2max):**

- Weekly Distance
- Pace Trend
- Training Load (ACWR)
- VO2max Trend
- EF Trend
- Race Predictor

**Output language:** English.

**Storage:** Save 1 row per section in `rt_ai_insights` with `insight_type = 'analytics_summary'` and `data_refs: { section: 'weekly_distance', triggered_by_activity_id: '...' }`.

---

### 10.3 Context injection

The AI does not have direct DB access. All data is prepared before the Claude API call in **structured plain text** format (not raw JSON).

```javascript
async function buildInsightContext(activityId) {
  const [activity, splits, recentActivities, trainingLoad, healthLog, goals, profile] =
    await Promise.all([
      getActivity(activityId),
      getSplits(activityId),
      getRecentActivities(userId, { days: 28, type: activity.activity_type, limit: 5 }),
      getTrainingLoad(userId), // dari Redis cache (TTL 5 menit)
      getSubjectiveHealthLog(userId, activity.started_at),
      getActiveGoals(userId), // dari Redis cache (TTL 1 jam)
      getUserProfile(userId), // dari Redis cache (TTL 1 jam)
    ])

  return serializeToPlainText({
    activity,
    splits,
    recentActivities,
    trainingLoad,
    healthLog,
    goals,
    profile,
  })
}
```

**Token budget:** ~950 input tokens per call (much more efficient than initial estimates).
**Hard limit:** 6,000 tokens. If approaching the limit, baseline activities are trimmed: 5 → 3 → 1.

Tool use is not used for the Insight Engine — all data is available when the call is made. Tool use is reserved for Chat Coach in Phase 2.

---

### 10.4 Claude API config

| Parameter         | Value                                                                  |
| ----------------- | ---------------------------------------------------------------------- |
| Model             | `claude-sonnet-4-6`                                                    |
| Temperature       | `0.3`                                                                  |
| Max tokens output | Post-activity/on-demand: 700 · Weekly: 500 · Anomaly: 250 · Daily: 400 |
| Streaming         | No — output is saved in full to DB                                     |
| Timeout           | 30 seconds                                                             |

---

### 10.5 Output schema (tersimpan di DB)

```javascript
{
  insight_type: 'post_activity',   // 'post_activity' | 'weekly_review' | 'anomaly' | 'daily' | 'on_demand' | 'analytics_summary'
  severity: 'info',                // 'info' | 'attention' | 'warning'
  status: 'completed',             // 'pending' | 'completed' | 'failed'
  is_valid: true,
  title: 'Easy run 10km — adaptasi aerobik baik',
  content: '...teks markdown dari AI...',
  data_refs: {
    activity_id: 'uuid',           // untuk post_activity dan on_demand
    week_start: '2026-05-13',      // untuk weekly_review
  },
  acknowledged: false,
}
```

**Insight types:**

| Type                | Description                                                                                     |
| ------------------- | ----------------------------------------------------------------------------------------------- |
| `post_activity`     | Automatic analysis after each activity finishes syncing from Strava                             |
| `weekly_review`     | Weekly review via cron every Sunday 19:00                                                       |
| `anomaly`           | Anomaly alert after post-activity insight completes (rules-based check + Claude narration)      |
| `daily`             | Daily insight via cron at 06:00 (readiness / recovery / motivational)                           |
| `on_demand`         | Manual analysis triggered by the user from the activity detail page                             |
| `analytics_summary` | Per-section recommendations on the Analytics page, auto-triggered after a new activity is saved |

Additional schema from the original PRD:

```sql
ALTER TABLE ai_insights
  ADD COLUMN status TEXT DEFAULT 'completed'
    CHECK (status IN ('pending', 'completed', 'failed')),
  ADD COLUMN is_valid BOOLEAN DEFAULT TRUE,
  ADD COLUMN error_message TEXT,
  ADD COLUMN retry_count INT DEFAULT 0;
```

---

### 10.6 Guardrails

- Output language: **English**
- Always reference real data — no generic advice
- No medical diagnoses
- Serious physical complaints → recommend seeing a doctor or physio
- Users with < 3 activities → prompt adjusted, do not reference a baseline that does not exist
- Output validation: check minimum length + section headers. If invalid → retry 1x → if still fails → `is_valid=false`, not shown in UI

---

### 10.7 Error handling

| Scenario                   | Handling                                            |
| -------------------------- | --------------------------------------------------- |
| Claude timeout (>30s)      | Inngest retry 1x after 5 minutes                    |
| Claude rate limit          | Backoff: 1 min → 5 min → 15 min → drop              |
| Output too short / invalid | Retry 1x → if still invalid → `is_valid=false`      |
| Claude API down            | Skip insight, do not block sync flow, log to Sentry |
| Max retries exceeded       | `status='failed'`, `content=null`, not shown in UI  |

---

### 10.8 Cost estimate (revised)

| Job                   | Freq/month | Input tokens    | Output tokens | Cost/month       |
| --------------------- | ---------- | --------------- | ------------- | ---------------- |
| Post-activity insight | ~20x       | ~950            | ~500          | ~$0.18           |
| Weekly review         | 4x         | ~2,000          | ~500          | ~$0.07           |
| Anomaly description   | ~8x        | ~600            | ~200          | ~$0.03           |
| Daily insight         | ~22x       | ~700            | ~400          | ~$0.09           |
| On-demand             | ~10x       | ~950            | ~500          | ~$0.09           |
| Friday prep           | 4x         | 0 (rules-based) | 0             | $0               |
| Analytics summary     | ~16x       | ~2,000          | ~600          | ~$0.55           |
| **Total**             |            |                 |               | **~$1.01/month** |

---

### 10.9 AI Coach Card — UI Design

The AI Coach card appears on the activity detail page, after the pre-activity context section and before splits/laps/stream charts. It is a single white card (`bg-white rounded-lg p-4`) with a persistent header and content that changes per state. The card is wrapped in a container with gradient `from-violet-50 to-purple-50` and border `border-violet-200/60`.

**Header (always visible):**

```
✦ AI Coach  [BETA]
```

- Icon: `Sparkles` (purple-400)
- Label: "AI Coach" (semibold, slate-700)
- Badge: "BETA" (bg-purple-100, text-purple-700, rounded, font-medium)

---

**State 1 — Loading** (`data-testid="aiInsightLoading"`)

While fetching the initial insight from DB. Shows 3 skeleton bars (animate-pulse) with different widths (3/4, full, 5/6).

---

**State 2 — Load Error** (`data-testid="aiInsightError"`)

If the fetch fails. Shows "Failed to load analysis" text + "Try again" button (`data-testid="aiInsightRetry"`). Clicking retry → `setInsight(undefined)` + re-fetch.

---

**State 3 — Empty / No Insight** (`data-testid="aiInsightEmpty"`)

If the DB has no insight for this activity. Shows "Choose analysis focus:" text + 4 focus buttons.

**Focus buttons (primary variant — bg-purple-100):**

| Button             | Icon       | Focus key       |
| ------------------ | ---------- | --------------- |
| Performance & Pace | Zap        | `performance`   |
| Recovery & Load    | Heart      | `recovery`      |
| Race Tips          | Trophy     | `next_race`     |
| Next Training      | Footprints | `next_training` |

Click → `POST /api/running/v1/ai/insights/generate` with `{ activity_id, focus }` → set state to `pending`.

If generation fails → red error text "Failed to start analysis. Try again." appears above the buttons.

---

**State 4 — Pending / Generating** (`data-testid="aiInsightPending"`)

Insight exists in DB with `status='pending'`. Shows:

- Spinner `Loader2` (purple-400) + text "Analyzing..."
- Small text "Usually < 30 seconds"
- Manual "Refresh" button (`data-testid="aiInsightRetry"`)

Auto-polls every 8 seconds. When status changes from `pending` → stop polling → update state.

---

**State 5 — Valid Insight** (`data-testid="aiInsightContent"`)

Condition: `status='completed' AND is_valid=true AND content != null`.

Layout top to bottom:

1. **Focus label** — small pill (bg-purple-100, text-purple-600, rounded-full) showing the focus used, e.g., "Performance & Pace"
2. **Markdown content** — rendered via `renderMarkdown()`:
   - `## Header` → `<p>` semibold slate-700
   - `- List item` → `<ul>` with `<li>` text-sm slate-600
   - Plain paragraph → `<p>` text-sm slate-600
   - `**bold**` inline → `<strong>` semibold slate-700
3. **Timestamp** — format `dd MMM yyyy, HH:mm`, text-xs slate-400
4. **Divider** + label "Re-analyze with different focus" → 4 focus buttons (same as State 3)
5. **"Ask more" label** → 3 follow-up buttons (slate-100 variant) that submit via `POST /api/running/v1/ai/insights/followup`:

| Button           | Icon      | Focus key          |
| ---------------- | --------- | ------------------ |
| Training Plan    | BookOpen  | `detail_training`  |
| HR Zone Analysis | Activity  | `zone_analysis`    |
| Compare Baseline | BarChart2 | `compare_baseline` |

---

**State 6 — Completed but Invalid**

`status='completed'` but `is_valid=false` or `content` is empty. Rendered the same as State 3 (empty) — user can regenerate.

---

**Polling logic:**

- Polling is only active when `status='pending'`
- Interval: 8 seconds
- Stops automatically when status changes
- Cleans up interval in `useEffect` unmount

---

## 10.11 Injury & Sports Medicine AI Coach

### Overview

When you're dealing with soreness, a niggle, or something that doesn't feel right, you shouldn't have to leave the app to figure out what to do. This feature adds two new AI personas to the existing coach system — a Sports Physiotherapist and a Sports Medicine Physician — so you can ask body-related questions with proper context from your training data.

Both roles give you grounded, evidence-based answers. Neither one diagnoses you or prescribes anything. If something sounds serious, they tell you to see a real clinician — and if it's pain 10/10, the app handles that client-side before even calling the AI.

The entry point is `InjuryCoachCard.jsx`, a new card on the Dashboard placed between `DailyInsightCard` and `FridayPrepCard`.

---

### User Stories

> As a runner, I want to describe soreness or pain and get physio-informed guidance so that I know whether to rest, modify training, or see a specialist.

> As a runner, I want the AI coach to automatically flag injury risk when my training load spikes so that I don't wait until I'm actually hurt to ask for help.

> As a runner, I want the coach to stay grounded in my actual training data rather than giving generic advice so that the guidance is relevant to what I've been doing.

---

### New AI Roles

Two new roles added alongside existing coach modes:

| Role                      | `focus` value     | Persona                                           | Scope                                                                           |
| ------------------------- | ----------------- | ------------------------------------------------- | ------------------------------------------------------------------------------- |
| Sports Physiotherapist    | `physio`          | MSc-level sports physio with 10+ years experience | Movement assessment, load management, rehabilitation, return-to-run progression |
| Sports Medicine Physician | `sports_medicine` | Board-certified sports medicine physician         | Medical context around injury, recovery timelines, when to seek further care    |

**Hard guardrails (enforced via system prompt):**

- Never use the words "diagnose", "prescribe", or "you have [condition]"
- Always use hedge language: "this may suggest", "it's possible that", "worth discussing with a clinician"
- If the response contains a red flag (e.g. bone stress, compartment syndrome, nerve symptoms), include the token `[ESCALATE]` at the start of the response — the frontend detects this and renders a red escalation banner instead of normal content
- Output language: English

**Client-side escalation (no LLM call):**

When user reports `pain_level = 10`, the frontend immediately renders a hardcoded message without calling the AI:

> "Pain at 10/10 needs medical attention now. Please stop training and see a doctor or go to an emergency clinic."

No API call is made. The message is shown in a red banner inside the card.

---

### New DB Table: `rt_symptom_logs`

```sql
CREATE TABLE rt_symptom_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  body_region TEXT,                         -- e.g. 'left_knee', 'right_achilles', 'lower_back' — nullable
  pain_level INT CHECK (pain_level BETWEEN 0 AND 10),
  pain_type TEXT,                           -- 'sharp', 'dull', 'burning', 'aching', 'tightness' — nullable
  occurs_when TEXT,                         -- 'at_rest', 'during_run', 'after_run', 'next_morning' — nullable
  notes TEXT,                               -- free-form description from user
  logged_at TIMESTAMPTZ DEFAULT NOW(),
  archived_at TIMESTAMPTZ DEFAULT NULL      -- set after 30 days of inactivity (no new log for same region)
);

CREATE INDEX idx_symptom_logs_user ON rt_symptom_logs(user_id, logged_at DESC);
```

**Auto-archive rule:** a cron job (or inline check at query time) sets `archived_at = NOW()` on rows where `logged_at < NOW() - INTERVAL '30 days'` and no newer row exists for the same `user_id + body_region`. Archived logs are excluded from the AI context window but remain in DB for history.

---

### InjuryCoachCard.jsx — Component Spec

**Location on Dashboard:** between `DailyInsightCard` and `FridayPrepCard`.

**Card header:**

```
🩺 Injury Coach  [BETA]
```

- Icon: `Stethoscope` (rose-400)
- Label: "Injury Coach" (semibold, slate-700)
- Badge: "BETA" (bg-rose-100, text-rose-700)
- Role toggle: two pill buttons — "Physio" / "Sports Medicine" — shown after user has submitted at least one question

**Persistent disclaimer strip (not a modal):**

A small strip at the top of the card content area, always visible, non-dismissible:

> "This is not medical advice. Always consult a qualified clinician for diagnosis and treatment."

- Style: `bg-amber-50 border border-amber-100 text-amber-700 text-xs rounded`
- Test ID: `injuryCoachDisclaimer_dashboardPage`

**Context form (shown when card is in idle/empty state):**

| Field        | Type                                       | Required | Notes                          |
| ------------ | ------------------------------------------ | -------- | ------------------------------ |
| Body part    | Text input or select                       | No       | Freeform or from a preset list |
| Injury phase | Pill buttons: Acute / Sub-acute / Recovery | No       | Single select                  |
| Question     | Textarea                                   | Yes      | Min 10 chars                   |

- Injury phase pills render only after body part is entered (or always — UX to decide)
- "Ask Physio" and "Ask Sports Medicine" are two separate submit buttons (or one "Ask" button + role selector above)
- Submitting calls `POST /api/running/v1/ai/injury-coach`

**Triggers for card auto-opening or surfacing:**

| Trigger                     | Condition                                                              | Action                                                                                                                                              |
| --------------------------- | ---------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| User-initiated              | User taps the card / starts typing                                     | Normal flow                                                                                                                                         |
| ACWR spike + recent symptom | `acwr > 1.4` AND a `rt_symptom_log` row exists within the last 14 days | Card appears with a pre-filled nudge: "You've logged symptoms recently and your training load is elevated. Want to check in with the Injury Coach?" |
| Explicit role switch        | User clicks "Physio" or "Sports Medicine" pill                         | Switches context; existing conversation is retained but the next question uses the new role                                                         |

---

### API Endpoint

```
POST /api/running/v1/ai/injury-coach
```

**Request body:**

```json
{
  "focus": "physio" | "sports_medicine",
  "question": "string (required, min 10 chars)",
  "body_region": "string (optional)",
  "injury_phase": "acute" | "sub_acute" | "recovery" | null,
  "pain_level": 0-10 (optional — if provided, saved to rt_symptom_logs)
}
```

**Server behavior:**

1. If `pain_level` is provided, insert a row into `rt_symptom_logs`
2. Build context: last 14 days of activities, current ACWR, any `rt_symptom_logs` rows from the last 30 days (non-archived), user profile (age, weight, max_hr)
3. Select system prompt based on `focus` value
4. Call Claude API (Sonnet 4.6, temp 0.4, max 600 tokens)
5. If response starts with `[ESCALATE]` → return with `escalate: true` flag in response body
6. Save response to `rt_ai_insights` with `insight_type = 'injury_coach'`, `data_refs: { focus, body_region }`
7. Return `{ data: { content, escalate: boolean }, message }`

**Auth:** session required — 401 if not authenticated

**Ownership:** only the authenticated user's data is fetched for context (no cross-user access)

---

### Acceptance Criteria

```
GIVEN user opens the Injury Coach card on Dashboard
WHEN card renders
THEN the persistent disclaimer strip is always visible
AND the disclaimer is not dismissible

GIVEN user types a question with fewer than 10 characters
WHEN user submits
THEN form shows validation error: "Please describe your situation in more detail (min 10 characters)"
AND no API call is made

GIVEN user reports pain_level = 10 on the form
WHEN user submits
THEN NO API call is made
AND card renders a red hardcoded escalation message:
  "Pain at 10/10 needs medical attention now. Please stop training and see a doctor or go to an emergency clinic."

GIVEN user submits a valid question with focus = 'physio'
WHEN POST /api/running/v1/ai/injury-coach is called
THEN system prompt uses the Sports Physiotherapist persona
AND response does not contain the words "diagnose", "prescribe", or "you have [condition]"
AND response contains hedge language

GIVEN user submits a valid question with focus = 'sports_medicine'
WHEN POST /api/running/v1/ai/injury-coach is called
THEN system prompt uses the Sports Medicine Physician persona

GIVEN AI response contains [ESCALATE] token
WHEN frontend receives response
THEN a red escalation banner is shown above the AI content
AND banner text: "This sounds like it may need prompt medical attention. Please consult a clinician soon."

GIVEN user has logged a symptom in the last 14 days AND current acwr > 1.4
WHEN Dashboard loads
THEN InjuryCoachCard surfaces with a pre-filled prompt nudge

GIVEN user submits a question
WHEN pain_level is included in the request body
THEN a row is inserted into rt_symptom_logs with the correct user_id, body_region, pain_level, and logged_at

GIVEN another user's user_id is used in context build
WHEN API handler runs
THEN only the authenticated user's data is used (IDOR check)

GIVEN role toggle is visible
WHEN user switches from 'physio' to 'sports_medicine'
THEN the next question submitted uses the sports_medicine system prompt
AND previous conversation is still visible in the card
```

---

### Validations & Error States

| Scenario                                     | Handling                                                                            |
| -------------------------------------------- | ----------------------------------------------------------------------------------- |
| `question` is empty or < 10 chars            | 400 — "Question must be at least 10 characters"                                     |
| `focus` is not `physio` or `sports_medicine` | 400 — "Invalid focus value"                                                         |
| `pain_level` outside 0–10                    | 400 — "Pain level must be between 0 and 10"                                         |
| `pain_level = 10`                            | Client-side block — hardcoded message, no API call                                  |
| Claude timeout (> 30s)                       | Show "Analysis is taking longer than expected. Try again." with retry button        |
| Claude API error                             | Show "Unable to get a response right now. Try again in a moment." with retry button |
| No session                                   | 401                                                                                 |
| Context build fails (DB error)               | 500 — log to Sentry, show generic error to user                                     |

---

### Test IDs

Registered in `cypress/fixtures/app-constants.json` under `test_ids.injury_coach.*`:

| ID                                         | Element                                                |
| ------------------------------------------ | ------------------------------------------------------ |
| `injuryCoachCard_dashboardPage`            | Card root element                                      |
| `injuryCoachDisclaimer_dashboardPage`      | Persistent disclaimer strip                            |
| `injuryCoachQuestionInput_dashboardPage`   | Question textarea                                      |
| `injuryCoachBodyPartInput_dashboardPage`   | Body part input                                        |
| `injuryCoachPhaseAcute_dashboardPage`      | "Acute" phase pill                                     |
| `injuryCoachPhaseSubAcute_dashboardPage`   | "Sub-acute" phase pill                                 |
| `injuryCoachPhaseRecovery_dashboardPage`   | "Recovery" phase pill                                  |
| `injuryCoachSubmitPhysio_dashboardPage`    | Submit button — physio role                            |
| `injuryCoachSubmitSportsMed_dashboardPage` | Submit button — sports medicine role                   |
| `injuryCoachResponse_dashboardPage`        | Response content area                                  |
| `injuryCoachEscalateBanner_dashboardPage`  | Red escalation banner (shown when [ESCALATE] detected) |
| `injuryCoachPain10Banner_dashboardPage`    | Hardcoded pain 10/10 message                           |
| `injuryCoachNudge_dashboardPage`           | Pre-filled nudge when ACWR > 1.4 + recent symptom      |
| `injuryCoachRolePhysio_dashboardPage`      | "Physio" role toggle pill                              |
| `injuryCoachRoleSportsMed_dashboardPage`   | "Sports Medicine" role toggle pill                     |

---

## 11. Dashboard & Statistics

### 11.1 Main Dashboard

**Header stats (weekly):**

- Total distance, total time, activity count, avg pace this week
- Comparison vs last week (delta %)

**Training load card:**

- ACWR gauge — green (0.8–1.3), yellow (1.3–1.5), red (>1.5)
- Acute load 7d vs chronic load 28d bar comparison
- Status label: "Build phase" / "Optimal" / "Caution" / "Danger zone"

**Activity mini-calendar:**

- Monthly calendar view highlighting days with runs
- Color per activity type (easy = green, tempo = yellow, interval = red)
- Data source: `GET /api/running/v1/calendar?month=YYYY-MM&type=`
- Response: `{ data: [{ id, date, activity_type, name, distance_m, relative_effort }] }` — all activities for the requested month, ordered `started_at ASC`
- Supports optional `type` filter; defaults to all types

**Year-to-Date Stats card (`YtdStats.jsx`):**

- Component: `dashboard/components/YtdStats.jsx`
- Test ID: `id="ytdStatsCard"`
- Displays year-to-date cumulative totals: total runs (count), total distance (km), total moving time (h m), total elevation gain (m)
- Also shows achievement count when `achievement_count > 0` (amber Star icon)
- Returns `null` when `ytd_stats` is not provided or `distance_m === 0`
- Data comes from the dashboard API response as `ytd_stats: { count, distance_m, moving_time_sec, elevation_gain_m, achievement_count }`

**Endurance Score tile (dashboard):**

- Brief tile on the dashboard that shows the latest endurance score
- Cross-reference: full trend chart is in the Analytics page (section 11.2)
- Score is derived from the most recent data point returned by `GET /api/running/v1/analytics/endurance-score`

**Recent activities list:**

- 5 most recent activities with quick stats
- Thumbnail mini-map when GPS data is available

**AI insight card:**

- 1 daily insight from AI Coach
- Quick prompts: "Analyze last run", "Plan this week", "How am I doing?", "Should I rest?"

**Manual health quick log:**

- Shortcut input for mood, sleep, energy for today
- Status indicator showing whether today's log has been submitted

### 11.2 Analytics page

**Tier 1 — Most valuable:**

| Chart                          | Data                                             | Insight                      |
| ------------------------------ | ------------------------------------------------ | ---------------------------- |
| Weekly distance trend (12 wks) | `activities.distance_m`                          | Consistency vs training gaps |
| Pace per workout type trend    | `avg_pace_sec_per_km` grouped by `activity_type` | Fitness progression per zone |
| HR zone distribution           | `activity_streams.heart_rate`                    | Whether training is balanced |
| Training load history          | `acwr` + `acute/chronic`                         | Injury risk over time        |
| PR progression timeline        | Computed per distance                            | Improvement trajectory       |
| Race predictor                 | Riegel formula from latest PR                    | Target race planning         |

**Tier 2 — Deeper insights:**

| Chart                       | Data                              | Insight                               |
| --------------------------- | --------------------------------- | ------------------------------------- |
| Pace vs HR scatter          | Per activity, same type           | Running economy improvement           |
| Cardiac drift per run       | First vs last split HR            | Fatigue indicator                     |
| Cadence trend               | `avg_cadence` over time           | Form development (target 170–180 spm) |
| Long run pacing consistency | `splits.pace_sec_per_km` variance | Positive vs negative split pattern    |
| VO2max trend                | Estimated from HR + pace          | Fitness level over time               |

**Tier 3 — With manual health data:**

| Chart                          | Data                                    | Insight                         |
| ------------------------------ | --------------------------------------- | ------------------------------- |
| Sleep quality vs next-day pace | `subjective_health_logs` + `activities` | Recovery impact on performance  |
| Energy level vs training load  | `morning_energy` + `acwr`               | Overreaching early warning      |
| Activity consistency heatmap   | `activities.started_at`                 | GitHub-style, visual motivation |

---

#### 11.2b Additional Analytics Charts (implemented, no PRD entry previously)

The following charts exist in `app/main/running/(app)/analytics/components/` and are served from the analytics page. They use computed data from activities or dedicated endpoints.

---

**Fitness Age Trend (`FitnessAgeTrendChart.jsx`)**

Endpoint: `GET /api/running/v1/analytics/fitness-age`

Computes weekly fitness age for the last 12 weeks. For each week, takes the 8 most recent qualifying run activities (`Run`, `TrailRun`, `VirtualRun`) with heart rate data and estimates VO2max, then maps that VO2max to a fitness age using NTNU norms. Requires `sex` and `birth_date` in the user profile; returns `{ sex_missing: true }` when either is missing.

Response: `{ data: { weekly: [{ week: string, fitness_age: number, avg_vo2max: number }], chronological_age: number|null, sex_missing: boolean } }`

Acceptance criteria:

- Given `sex` is not set in the profile, when the chart renders, show a prompt to fill in sex in Settings rather than empty chart
- Given fewer than 4 qualifying activities in a given week, that week's data point is excluded (minimum sample = 4)
- Given sufficient data, the chart shows both the fitness age line and a reference line for chronological age

---

**Endurance Score Trend (`EnduranceScoreTrendChart.jsx`)**

Endpoint: `GET /api/running/v1/analytics/endurance-score`

Weekly composite score (0–100) computed from recent activities. Higher score = better endurance base. The score aggregates pace, distance, and training load indicators into a single number for trend comparison.

Response: `{ data: [{ week: string, score: number }] }`

Acceptance criteria:

- Given fewer than 3 activities in the history, show an empty state rather than a misleading flat line
- Given valid data, the chart renders a line trend with weekly data points
- The most recent score is surfaced on the dashboard as the Endurance Score tile

---

**Performance Management Chart / PMC (`PerformanceManagementChart.jsx`)**

Endpoint: `GET /api/running/v1/analytics/pmc?days=30|60|90` (default: 90)

Shows three daily series over the selected window:

- **Fitness (CTL)** — chronic training load (42-day exponential moving average of daily TSS)
- **Fatigue (ATL)** — acute training load (7-day exponential moving average of daily TSS)
- **Form (TSB)** — Training Stress Balance = Fitness − Fatigue; positive = fresh, negative = fatigued

Response: `{ data: [{ date: string, ctl: number, atl: number, tsb: number }] }`

Acceptance criteria:

- Given `days=30`, the chart shows 30 days of PMC data
- Given `days` not in `[30, 60, 90]`, defaults to 90
- TSB is displayed with a reference line at 0; values above 0 are coloured differently from values below 0
- Given fewer than 7 activities, all three lines still render (values may be near zero)

---

**Calorie Burn Trend (`CalorieTrendChart.jsx`)**

Endpoint: `GET /api/running/v1/analytics/calorie-trend`

Monthly calorie burn aggregated from `rt_activities.calories`. Response also includes `weight_kg` from the user's profile for context (calorie estimation quality depends on body weight).

Response: `{ data: [{ month: string, calories: number }], weight_kg: number|null, message: string }`

Acceptance criteria:

- Given no activities with calorie data, show an empty state with a note that calorie data comes from Strava/device
- Given valid data, the chart shows a bar chart with monthly totals
- `weight_kg` shown as context note below the chart when available

---

**Weekly Elevation Trend (`WeeklyElevationChart.jsx`)**

Data source: computed client-side from activities prop (no dedicated endpoint). Aggregates `elevation_gain_m` per calendar week for the last 12 weeks, using only run-type activities (`Run`, `TrailRun`, `VirtualRun`). Renders as a bar chart with each bar coloured by the count of runs that week.

Acceptance criteria:

- Given activities with no elevation data (all `elevation_gain_m = null`), show empty state
- Given valid data, shows 12 weeks of weekly elevation totals as a bar chart

---

**Terrain Distribution (`TerrainDistributionChart.jsx`)**

Data source: computed client-side from activities prop (no dedicated endpoint). A donut chart showing distribution of runs across hill-score tiers: Flat, Rolling, Hilly, Mountainous. Hill score is computed from `elevation_gain_m / distance_m` using thresholds in `lib/services/running/utils/hillScore.js`.

Acceptance criteria:

- Given fewer than 1 run, show empty state
- Given valid runs, the donut chart renders 4 segments with the count and percentage per tier
- Segments use the tier colors defined in `HILL_TIERS`

---

**Running Power (`RunningPowerChart.jsx`)**

Data source: computed client-side from activities prop. Only shows activities where `device_watts = true` and `avg_watts` is not null (requires a compatible device, e.g. Garmin running power pod). Renders avg watts per run as dots, plus a 30-activity rolling average line. Supports a 30/60/90-day range selector.

Acceptance criteria:

- Given no activities with `device_watts = true`, show empty state with note that power data requires a compatible device
- Given valid data, renders scatter dots (avg_watts) + rolling average line

---

**Best Pace by Distance (`BestPaceChart.jsx`)**

Data source: computed client-side from activities prop. For each distance bracket (defined in `DISTANCE_BRACKETS` in `utils.js`), finds the activity with the lowest `avg_pace_sec_per_km` and displays it as a bar. Distance brackets group activities into meaningful race distances (e.g. 1–3K, 3–7K, 7–15K, 15–25K, 25K+).

Acceptance criteria:

- Given no qualifying run activities, show empty state
- Given valid data, renders a horizontal bar chart with the best pace per bracket, labelled with the pace value and activity date

### 11.2a Zone Analytics — DONE

**Location:** within `/main/running/analytics`, below the Tier 1/2/3 charts.
**Root testid:** `id="zoneAnalyticsSection_analyticsPage"`
**Component:** `analytics/components/ZoneAnalyticsSection.jsx`

**Filter bar** (`id="zoneFilterBar_analyticsPage"`, shared across all 4 cards below):

| Filter        | Test ID                         | Options                                                                                                                                                        |
| ------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Start date    | `zoneStartDate_analyticsPage`   | date picker; selecting both start + end switches range to `custom` and disables the range dropdown                                                             |
| End date      | `zoneEndDate_analyticsPage`     | date picker                                                                                                                                                    |
| Range         | `zoneRangeSelect_analyticsPage` | `today` / `4w` / `3m` (default) / `6m` / `1y` / `all`                                                                                                          |
| Activity type | `zoneTypeSelect_analyticsPage`  | `All` (default) + dynamic list from `GET /api/running/v1/activities/types`; falls back to `Run, TrailRun, VirtualRun, Walk, Hike, Ride, Swim` on fetch failure |

**Data fetch:** two independent calls via `Promise.allSettled` on filter change — a gear-fetch failure doesn't blank the zone cards and vice versa:

- `GET /api/running/v1/analytics/zones?range&activity_type&start_date&end_date` → `{ hr, pace, cadence, activity_count }` (service: `getZoneAnalytics.js`)
- `GET /api/running/v1/analytics/gear?range&activity_type&start_date&end_date` → `{ gear: [...] }` (service: `getGearUsage.js`)

Both capped at the **100 most recently started matching activities**; stream rows are batch-fetched 20 activities at a time, up to 50,000 rows per batch (250,000 rows max scanned). Matching activity count shown above the cards: `id="zoneActivityCount_analyticsPage"`.

**4 cards, 2×2 grid on desktop:**

| Card          | Test ID                                                                      | Icon     | Source field                                                                                                                                                                                             | Empty / gated states                                                                                                                                 |
| ------------- | ---------------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| HR Zones      | `hrZoneSubSection_analyticsPage` → `hrZoneBreakdown_analyticsPage`           | Heart    | `heart_rate` stream rows, bucketed per active `hr_zones_method` (see 21a)                                                                                                                                | "Max HR not configured" when the active method's required profile field is missing; "No HR data in this range" when no rows                          |
| Pace Zones    | `paceZoneSubSection_analyticsPage` → `paceZoneBreakdown_analyticsPage`       | Gauge    | `pace_sec_per_km` stream rows, bucketed against `threshold_pace_sec` (see 21b)                                                                                                                           | "Threshold pace not set" (`paceZoneNoThreshold_analyticsPage`) when no threshold pace configured; "No pace data in this range" when no GPS pace rows |
| Cadence Bands | `cadenceZoneSubSection_analyticsPage` → `cadenceZoneBreakdown_analyticsPage` | Activity | `cadence` stream rows (already full spm — doubled from Strava's single-leg value at ingest in `stravaFetchStreams.js`); bands: Beginner <165, Recreational 165–175, Semi-athlete 175–185, Elite ≥185 spm | "No cadence data in this range"                                                                                                                      |
| Gear Usage    | `gearUsageSubSection_analyticsPage`                                          | Package  | `rt_activities.gear_id` joined to `rt_gear` (name, brand, model, category, retired)                                                                                                                      | empty table when no gear-linked activities in range                                                                                                  |

Each HR/Pace/Cadence row shows time (`Xh Ym`), distance, and % of total time within that filter. Per-bucket distance is approximated as `Σ velocity_m_s × 1s` across every second-resolution stream row landing in that bucket (accurate at the 1Hz Strava stream sampling rate used elsewhere in this app).

---

### 11.3 Activity detail page

**Route:** `/main/running/activities/[id]`
**Root testid:** `data-testid="activityDetailPage"`

#### Page structure (top to bottom)

1. **Page header** — back button (ChevronLeft, returns to previous page) + breadcrumb (Running > Activities > [Activity name])
2. **Main card** — white card with:
   - **Media carousel** — if GPS polyline exists + no photos: shows RouteMap full width. If photos exist alongside map: shows combined carousel (map slide first, then photo slides) with prev/next arrows, dot navigation, and expand-to-fullscreen button for photos. If neither: section hidden.
   - **Activity header** — activity type icon (colored by type/workout_type) + name + date + source badge. PR count badge (amber, Trophy icon) + achievement count badge when > 0. Kudos count when > 0.
   - **Stats grid** — responsive 2–3 column grid. Only tiles with data are rendered (null-guarded). Tiles:
     - Distance (km), Avg Pace (min/km) with best pace sub-label, Moving Time with elapsed diff sub-label, Avg HR (bpm) with max HR sub-label, Cadence (spm), Elevation (↑m + ↓m loss), Calories (kcal), Relative Effort, RPE (/10), Energy (kJ), Elevation Range (high/low m), Efficiency Factor (m/s/bpm, 4 decimals), Est. VO₂max (mL/kg/min, 1 decimal)
     - Derived metrics guide text — shown when activity is a run type but `efficiency_factor`, `estimated_vo2max`, AND `aerobic_decoupling` are all null. Text: "Aerobic Decoupling, Efficiency Factor, and VO₂max estimates require heart rate data. Connect a HR monitor to your Strava activities to unlock these metrics." `data-testid="derivedMetricsGuide"`
   - **Pills row** — shows only when at least one value exists:
     - Power pill (violet, Zap icon) — shows weighted_avg_watts (or avg_watts if no weighted), with normalized watts note when different. Only shown when `device_watts = true`.
     - Temperature pill (color-coded by range: Cold <10°C blue, Cool 10–18°C green, Warm 18–25°C amber, Hot 25–32°C orange, Very Hot ≥32°C red) — shows °C value + text label. Thermometer icon. Info text below about temperature source. `title` attribute with explanation.
     - Aerobic Decoupling badge (Heart icon) — green "Good" < 5%, amber "Moderate" 5–10%, red "High drift" > 10%. Shows "Decouple +X%" with sign. `data-testid="aeroDrift"`. `title` explains Pa:Hr interpretation.
   - **Gear row** — Footprints icon + shoe name + total km (from rt_gear.distance_m). Only shown when gear.name exists.
   - **Device row** — Smartphone icon + device_name. Only shown when device_name exists.
   - **Race log linkage badge** — amber card (Trophy icon) showing linked race entry title + finish time. Only shown when this activity is linked to an `rt_race_log` entry via `activity_id`. `data-testid` not currently set.
   - **Strava description** — shown when `activity.description` exists (Strava-synced description, read-only).
   - **Notes** — inline editable. View mode: click anywhere on the row to enter edit mode. Edit mode: textarea with Ctrl+Enter shortcut to save, Cancel button (`data-testid="notesCancelBtn"`), Save button (`data-testid="notesSaveBtn"`). View mode button: `data-testid="notesEditBtn"`. Textarea: `data-testid="notesTextarea"`.
   - **Weather summary** — CloudSun icon + `activity.weather_summary` text. Only shown when value exists.
   - **Pre-activity context** (`data-testid="preActivityContext"`) — shown when `healthLog` has loaded (including when null). If null: shows "No health log for this day" with link to /main/running/health. If exists: shows inline fields: sleep hours + quality, morning energy (Very Low–Very High color-coded), mood (Poor–Great color-coded), soreness level (/10), RHR (bpm), plus health log notes in italic.
   - **AI Coach card** — purple gradient background container wrapping `AIInsightCard`. Placed after pre-activity context, before splits table.
   - **Splits table** (`SectionLabel: "Splits (per km)"`) — columns: #, Dist, Pace, Time, HR (conditional on hasSplitsHr), Elev. Below table: cardiac drift indicator (`data-testid="cardiacDrift"`) showing HR delta (last split – first split), positive = red, negative = blue. Only shown when ≥ 2 splits have HR data.
   - **Best Efforts table** (`SectionLabel: "Best Efforts"`) — columns: Distance (name), Time, PR (shows "PR" badge with Trophy icon when pr_rank=1, "#N" rank otherwise). Only shown when bestEfforts.length > 0.
   - **Laps table** (`SectionLabel: "Laps"`) — columns: #, Dist, Pace, Time, HR (conditional), Elev. Pace computed from moving_time_sec / distance_m. Only shown when laps.length > 0.
   - **Stream charts** (`data-testid="streamChartsSection"`) — 4 separate AreaCharts synced by syncId "streamCharts". Only renders charts where data exists: Pace (purple, reversed Y), HR (red, with Z1–Z5 ReferenceArea zone bands), Elevation (slate), Cadence (green, spm = raw × 2). Loading state: `data-testid="streamChartsLoading"`. Error state: `data-testid="streamChartsError"` + retry button `data-testid="streamChartsRetry"`. Empty state: `data-testid="streamChartsEmpty"`. Individual chart testids: `streamChartPace`, `streamChartHr`, `streamChartElevation`, `streamChartCadence`. Charts keyed to distance (km) on X axis.
   - **HR Zones chart** (`data-testid="hrZonesSection"`) — horizontal CSS progress bar chart (not donut). One row per zone (Z1–Z5) showing zone name, HR range, progress bar sized to % of total time, label with % + duration. Empty state: `data-testid="hrZonesEmpty"`. Shown always (empty state when zones data unavailable).
3. **Next Race goal card** — standalone card below main card. Shows "Your Next Race" label + race title (or auto-generated distance label) + target date. Edit button (`id="editGoalBtn"`) opens `EditGoalModal` (`id="editGoalModal"`). Save button: `id="editGoalSaveBtn"`. Modal fields: race title (text), target distance (preset dropdown + custom number), target date (date input), notes/description (textarea).

#### States

| State   | What renders                                                               |
| ------- | -------------------------------------------------------------------------- |
| Loading | `Skeleton` component — animated pulse placeholders for map, stats, content |
| Error   | Centered error message + "Try again" link (reloads page). `role="alert"`   |
| Loaded  | Full detail layout described above                                         |

#### Data loading

Three parallel fetches on page load (via `Promise.allSettled`):

1. `fetchActivity(id)` → activity, splits, laps, best_efforts, photos
2. `getDashboard()` → next_race_goal
3. `fetchRaceLog()` → find entry with matching `activity_id` for linkage badge

Then (non-blocking, after activity date known): `fetchSubjectiveHealthByDate(activityDate)` → healthLog

---

### 11.4 Derived Metrics

Three metrics are computed **at ingest time** (Strava webhook / manual sync) and stored in `rt_activities`. They are not recomputed at render time. If gate conditions are not met, the column is set to NULL.

**Gate conditions (all metrics):** duration > 20 minutes AND HR data available (avg_hr not null)

#### Aerobic Decoupling (Pa:Hr)

- **Formula:** `((pace/HR first half) / (pace/HR second half) - 1) * 100`
- **DB column:** `aerobic_decoupling NUMERIC(5,2)` on `rt_activities`
- **Interpretation:**
  - < 5% → good aerobic base (green badge)
  - 5–10% → moderate drift (amber badge)
  - > 10% → above threshold / poor aerobic base (red badge)
- **UI:** badge on activity detail card, tooltip explains what it means
- **Data source:** pace stream + HR stream (split at 50% of duration)

#### Efficiency Factor (EF)

- **Formula:** `avg_speed_ms / avg_hr`
- **DB column:** `efficiency_factor NUMERIC(6,4)` on `rt_activities`
- **Interpretation:** higher = better running economy; used as a trend indicator, not absolute judgment
- **UI:** shown as a number with up/down trend arrow vs. 30-day average
- **Data source:** `avg_speed` (from Strava) + `avg_hr`

#### Estimated VO2max

- **Formula:** Daniels formula — `(avg_speed_ms * 60 / 1000) / (0.8 + 0.1894393 * exp(-0.012778 * duration_min) + 0.2989558 * exp(-0.1932605 * duration_min))` normalized to mL/kg/min via HR ratio `(avg_hr / max_hr)`
- **DB column:** `estimated_vo2max NUMERIC(5,2)` on `rt_activities`
- **Interpretation:** trend matters more than absolute value; 30-day rolling average smooths outliers
- **UI on activity detail:** show per-run estimate as a stat
- **UI on Analytics page:** 30-day rolling average trend line
- **Data source:** `avg_hr`, `max_hr` (from user profile), `duration_sec`, `avg_speed`

#### Quick Wins (no new API needed)

These use data already synced from Strava — just need UI surfacing:

1. **PR count badge on activities list** — show "X PRs" badge (gold/amber) on activity card when `pr_count > 0`. Data already in `rt_activities.pr_count`. **[DONE — implemented on activity detail page header and activities list]**
2. **Cardiac drift indicator on splits** — show HR delta (last split avg_hr minus first split avg_hr) below the splits table. Positive = drift up (red), negative = drift down (blue). Data already in splits. **[DONE — `data-testid="cardiacDrift"`, shown below splits table]**

#### Implementation Status

| Priority | Item                                                      | Status                                                                                                                                  |
| -------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| P0       | PR count + achievement count badges on activity detail    | DONE                                                                                                                                    |
| P0       | Cardiac drift indicator below splits table                | DONE                                                                                                                                    |
| P1       | Aerobic Decoupling badge on activity detail               | DONE — `data-testid="aeroDrift"`, green/amber/red                                                                                       |
| P1       | Efficiency Factor stat tile on activity detail            | DONE — `id="efficiencyFactor_activityDetailPage"`, shows raw number + trend arrow (`id="efTrendArrow"`) vs 30-day avg                   |
| P1       | Estimated VO₂max stat tile on activity detail             | DONE — `id="estimatedVo2max_activityDetailPage"`, 1 decimal                                                                             |
| P2       | Estimated VO2max 30-day rolling average on Analytics page | DONE — `Vo2maxTrendChart.jsx` in `analytics/components/`; individual dots (#c4b5fd) + rolling avg line (#7c3aed); empty state at <3 pts |
| P2       | Analytics page `/running/analytics` (Section 10.2 spec)   | DONE — `analytics/page.jsx`; sections: Weekly Distance, Pace Trend, Best Pace, Training Load, Race Predictor, VO2max Trend, EF Trend    |

---

### 11.5 AI Recommendation Cards

There are 6 AI cards on the Analytics page, each placed below its corresponding chart. Plus 1 "Analysis History" button in the page header that opens a modal with the full analysis history.

**6 AI card slots:**

- Weekly Distance
- Pace Trend
- Training Load (ACWR)
- VO2max Trend
- EF Trend
- Race Predictor

**UI states per card:**

- **Loading:** violet skeleton on initial load
- **Pending:** polling every 8 seconds, max 2 minutes. Copy rotates: "Reading trends…" → "Analysing patterns…" → "Writing recommendations…"
- **Completed:** show headline + body_markdown. Generation date in the top right.
- **Error:** "Analysis unavailable" (muted), with a retry link
- **Empty:** "No analysis yet. Your next activity will be analysed automatically."
- **Stale badge:** if `insight.created_at` is older than the latest activity → show "Before last run" badge

**History modal:** shadcn Dialog/Sheet, lists all `rt_ai_insights` with `insight_type = 'analytics_summary'`, sorted newest first, grouped by month. Each entry: date, section coverage, expandable to see full content.

**Phase 1 (initial):** Weekly Distance, Pace Trend, Training Load + staleness check logic
**Phase 2:** VO2max Trend, EF Trend, Race Predictor + history modal

---

### 11.6 Pace Calculator page

**Route:** `/main/running/pace-calculator`
**Component:** `app/main/running/(app)/pace-calculator/page.jsx`

> As a runner, I want to calculate my target pace, project a finish time for a given distance, and see per-km splits, so that I can plan my race strategy without leaving the app.

The Pace Calculator is a fully client-side tool — no API calls are made. All calculations use in-browser JavaScript. The unit preference (km / mi) is persisted to `localStorage` under the key `paceCalculatorUnit`.

**Three calculator modes (tabbed layout):**

| Tab              | Test ID                        | Purpose                                                               |
| ---------------- | ------------------------------ | --------------------------------------------------------------------- |
| Pace Mode        | `tabPace_paceCalculator`       | Given distance + total time → compute avg pace, speed in km/h and mph |
| Projection Mode  | `tabProjection_paceCalculator` | Given pace → find finish time for a distance OR distance for a time   |
| Steps → Distance | `tabSteps_paceCalculator`      | Given step count → estimate distance (assumes 0.9m avg step length)   |

**Pace Mode inputs:**

- Distance selector (`DistanceSelect.jsx`) — preset dropdown (5K, 10K, 21.1K, 42.2K, Custom) + custom numeric input when "Custom" is selected. Test IDs: `distancePreset_paceCalculator`, `customDistance_paceCalculator`
- Time input (`TimeInput.jsx`) — HH:MM:SS fields. Test IDs: `time_paceCalculator_{hours,minutes,seconds}`
- Results: pace /km (`paceKm_paceCalculator`), pace /mi (`paceMi_paceCalculator`), speed km/h (`speedKmh_paceCalculator`), speed mph (`speedMph_paceCalculator`)

**Projection Mode inputs:**

- Pace input (MM:SS per km or mi) — `projPaceMinutes_paceCalculator`, `projPaceSeconds_paceCalculator`
- Sub-mode toggle (`projSubMode_paceCalculator`): "I have a distance → find time" (`projModeDistance_paceCalculator`) or "I have a time → find distance" (`projModeTime_paceCalculator`)
- Distance selector: `projDistancePreset_paceCalculator`, `projCustomDistance_paceCalculator`
- Time input: `projTime_paceCalculator_{hours,minutes,seconds}`
- Results: estimated time (`projResultTime_paceCalculator`) or estimated distance (`projResultDistance_paceCalculator`), avg pace (`projAvgPace_paceCalculator`)

**Steps Mode input:**

- Step count input (`stepsCount_paceCalculator`) — positive integer, max 200,000
- Results: distance in km (`stepsDistanceKm_paceCalculator`), distance in mi (`stepsDistanceMi_paceCalculator`)

**Below the tabs (when valid pace + distance are computed):**

- `SplitsTable.jsx` — per-km or per-mi splits up to a max of 50 rows (grouped when distance is large); shows split number, split time, cumulative time
- `RaceProjectionTable.jsx` — Riegel-formula projections for common race distances based on the current pace/time pair

**Validation and warnings:**

- Pace outside 2:00–20:00 /km (120–1,200 s/km) → amber warning banner "Pace seems unusual — please check your inputs"
- Steps input that is not a positive integer → amber warning "Steps must be a positive whole number"
- Steps > 200,000 → treated as invalid

**Unit toggle (`unitToggle_paceCalculator`):** km / mi radio buttons. Switching unit recalculates all displayed values immediately. Selected unit is saved to `localStorage`.

**Acceptance criteria:**

```
GIVEN user selects 10K distance and enters time 50:00
WHEN Pace Mode calculates
THEN pace displays 5:00 /km and 8:03 /mi

GIVEN user enters pace 5:00 /km and selects 21.1K distance in Projection Mode
WHEN result is computed
THEN estimated time displays 1:45:33

GIVEN user enters 10000 steps in Steps Mode
THEN distance displays 9.00 km and 5.59 mi

GIVEN calculated pace is below 2:00 /km
WHEN result renders
THEN amber warning appears: "Pace seems unusual — please check your inputs"

GIVEN valid pace + distance are in Pace Mode or Projection Mode
WHEN the split table renders
THEN rows show correct split time and cumulative time per km (or mi)

GIVEN user switches unit from km to mi
WHEN all result tiles update
THEN pace displays in /mi and speed in mph; unit preference is saved to localStorage
```

---

### 11.7 Running Settings page

**Route:** `/main/running/settings`
**Component:** `app/main/running/(app)/settings/page.jsx`

> As a runner, I want to manage my profile, HR zones, pace zones, notifications, and Strava connection in one place so that the app calculates zones and sends alerts accurately.

The Settings page is divided into six sections, each as its own `<section>` component. Sections load independently — a failure in one section does not blank the others.

---

#### 11.7.1 Profile (`ProfileSection.jsx`)

API: `GET /api/running/v1/user/profile`, `PATCH /api/running/v1/user/profile`

Fields:

- Display Name (`displayNameInput_settingsPage`) — text, max 100 chars
- Date of Birth (`birthDateInput_settingsPage`) — calendar popover, used for age-graded performance and fitness age chart
- Height in cm (`heightInput_settingsPage`) — positive number
- Weight in kg (`weightInput_settingsPage`) — positive number, step 0.1
- Sex (`sexSelect_settingsPage`) — Male / Female / Prefer not to say (maps to `null`)

**BMI chip (`bmiChip_settingsPage`):** computed live from weight + height. Shows category (Underweight / Normal / Overweight / Obese) with colour (violet for Normal, amber for others). When either weight or height is missing, a contextual prompt (`bmiMissingPrompt_settingsPage`) shows a link to the missing field.

**Save behaviour:** `PATCH /api/running/v1/user/profile` with changed fields only. Success toast: `profileSaveSuccess_settingsPage`. Error inline: `profileSaveError_settingsPage`. Save button: `profileSaveBtn_settingsPage`. Loading skeleton: `profileLoading_settingsPage`.

Validations (Zod, `schemas/runningProfile.js`): `display_name` min 1 / max 100, `birth_date` ISO date format, `height_cm` positive, `weight_kg` positive, `sex` must be `'male'` | `'female'` | null.

---

#### 11.7.2 HR Zones (`HrZonesSection.jsx`)

API: `GET /api/running/v1/user/hr-zones`, `PATCH /api/running/v1/user/hr-zones`

Fields:

- Max HR (`maxHrInput_settingsPage`) — integer 60–250. "Detect" button (`detectMaxHrBtn_settingsPage`) calls `GET /api/running/v1/user/max-hr-detect` to find the highest recorded HR across all activities. On success: `maxHrDetectedHint_settingsPage`. On no data: `maxHrNoDataHint_settingsPage`. On error: `maxHrDetectError_settingsPage`.
- Resting HR (`restingHrInput_settingsPage`) — integer 30–120. Required for Karvonen method.
- Threshold HR (`thresholdHrInput_settingsPage`) — integer 100–220. Required for Lactate Threshold method. Info tooltip explains LTHR. "85% of Max HR" auto-fill button (`thresholdHrAutoFillBtn_settingsPage`) — disabled until Max HR is set; shows `thresholdHrNoMaxHr_settingsPage` when unavailable.
- Calculation Method (`hrZonesMethodSelect_settingsPage`) — dropdown: Max HR (default), Karvonen (Heart Rate Reserve), Lactate Threshold. Zone boundaries documented in section 21a.

Save: `hrZonesSaveBtn_settingsPage`. Success: `hrZonesSaveSuccess_settingsPage`. Error: `hrZonesSaveError_settingsPage`. Loading: `hrZonesLoading_settingsPage`.

---

#### 11.7.3 Pace Zones (`PaceZonesSection.jsx`)

API: `GET /api/running/v1/user/settings`, `PATCH /api/running/v1/user/settings`; auto-detect: `GET /api/running/v1/user/threshold-pace-detect`

Two modes for setting the threshold pace:

- **Manual** (`paceZonesMode_manual_settingsPage`): type MM:SS directly (`thresholdPaceInput_settingsPage`). Validates 2:00–15:00 /km.
- **From Activity** (`paceZonesMode_activity_settingsPage`): "Detect Threshold Pace" button (`detectThresholdPaceBtn_settingsPage`) calls the auto-detect endpoint (see section 21b for algorithm). Requires Threshold HR to be set first.

Zone boundaries displayed as a reference table in the section (see section 21b). Zone Analytics on the Analytics page uses these zones for the Pace Zone breakdown card.

---

#### 11.7.4 Notifications (`NotificationsSection.jsx`)

API: `GET /api/running/v1/user/settings`, `PATCH /api/running/v1/user/settings`, `POST/DELETE /api/running/v1/user/push-subscription`

**Master push toggle (`pushNotificationsToggle_settingsPage`):**

- When enabled: requests `Notification.requestPermission()` → registers service worker → subscribes via `PushManager.subscribe` with VAPID key → POSTs subscription object to `/api/running/v1/user/push-subscription`
- When disabled: unsubscribes from `PushManager` → sends `null` to push-subscription endpoint
- Shows `pushNotificationsError_settingsPage` on failure. Disabled if `serviceWorker` or `PushManager` not supported.
- Beta disclaimer banner shown above the card.

**Per-notification toggles (optimistic save — each toggle immediately calls PATCH):**

| Toggle                               | Test ID                                 | `user_settings` column |
| ------------------------------------ | --------------------------------------- | ---------------------- |
| Post-activity insight                | `notifyPostActivityToggle_settingsPage` | `notify_post_activity` |
| Weekly review                        | `notifyWeeklyReviewToggle_settingsPage` | `notify_weekly_review` |
| Friday race prep                     | `notifyFridayPrepToggle_settingsPage`   | `notify_friday_prep`   |
| Anomaly alerts                       | `notifyAnomalyToggle_settingsPage`      | `notify_anomaly`       |
| Race reminders (14/7/3/1 day before) | `notifyRaceReminderToggle_settingsPage` | `notify_race_reminder` |

Toggle save error (optimistic rollback): `notifyToggleError_settingsPage`. Loading skeleton: `notificationsLoading_settingsPage`.

---

#### 11.7.5 Strava Connection (`StravaConnectionSection.jsx`)

This section implements the full connection state machine described in section 5.8.

Section root ID: `stravaConnectionSection_settings`. Loading: `stravaConnectionLoading_settings`.

**States:**

| State                             | Container ID                       | Actions                                                                          |
| --------------------------------- | ---------------------------------- | -------------------------------------------------------------------------------- |
| Not connected                     | `stravaDisconnectedState_settings` | "Connect Strava" button → Strava OAuth flow                                      |
| Connected (healthy)               | `stravaConnectedState_settings`    | Shows athlete ID + last sync time. "Disconnect" (`stravaDisconnectBtn_settings`) |
| Broken (`needs_reconnect = true`) | `stravaBrokenState_settings`       | Warning message + "Reconnect" button (`stravaReconnectBtn_settings`)             |

Data source: `GET /api/running/v1/user/strava-status` → `{ connected, athlete_id, last_sync_at, needs_reconnect }`.

---

#### 11.7.6 Danger Zone (`DangerZoneSection.jsx`)

API: `DELETE /api/running/v1/user/activities`

A red-bordered section (`bg-red-50 border border-red-200`) with a single destructive action: "Delete All" (`dangerZoneDeleteBtn_settingsPage`).

Clicking opens a confirmation dialog (`dangerZoneDialog_settingsPage`) that requires typing `DELETE` verbatim into a text input (`dangerZoneConfirmInput_settingsPage`) before the confirm button (`dangerZoneConfirmBtn_settingsPage`) becomes enabled.

On success: dialog closes, success message shown. On error: `dangerZoneError_settingsPage` shown inside dialog; dialog stays open. The confirm button is disabled while deleting.

This action permanently deletes all activity data for the user. It cannot be undone. Historical data retained after Strava disconnect (see section 5.7) is also deleted by this action.

---

## 12. Gear Management (Shoe Rotation)

### 12.1 Overview

Gear Management tracks the condition of running shoes based on total distance covered. Shoe data syncs automatically from Strava — every shoe recorded in a Strava activity appears here.

The goal is simple: know when a shoe needs to be retired before its performance drops or injury risk increases.

### 12.2 User Stories

> As a runner, I want to see all my shoes with their mileage so that I know which ones are still fresh and which are wearing out.

> As a runner, I want to set a retirement threshold per shoe so that I get a visual warning before I hit the limit.

> As a runner, I want to categorize each shoe by use type (daily, race, trail, etc.) so that I can track rotation correctly.

### 12.3 Data Source

Shoes sync from two places:

1. **Strava activity sync** — every Strava activity with a `gear_id` upserts the gear into `rt_gear`
2. **Athlete sync** — when the user connects Strava, `/api/v3/athlete` is called to immediately fetch all shoes registered on the athlete profile, not just those that appear in activities

Fields synced from Strava: `name`, `brand_name`, `model_name`, `distance_m`, `retired`, `notification_distance_m`.

`notification_distance_m` is the retirement threshold set by the user in Strava (not in this app). Strava returns this value in km via `notification_distance` — the backend converts it to meters on save (`Math.round(notification_distance * 1000)`).

Fields that are **never overwritten** by Strava sync: `category`, `retirement_km` — these are entirely user-managed.

### 12.4 Database

```sql
CREATE TABLE rt_gear (
  id TEXT PRIMARY KEY,              -- Strava gear ID (format: g12345678)
  user_id UUID REFERENCES users(id),
  name TEXT,
  brand_name TEXT,
  model_name TEXT,
  distance_m INTEGER DEFAULT 0,    -- total distance in meters, updated on each sync
  retired BOOLEAN DEFAULT FALSE,
  notification_distance_m INTEGER DEFAULT NULL, -- Strava-managed shoe alert threshold, stored in meters (Strava returns km → converted on save)
  category TEXT DEFAULT NULL,       -- user-managed: daily/tempo/race/trail/recovery/cross-training
  retirement_km INTEGER DEFAULT NULL, -- user-managed retirement threshold in km
  last_fetched_at TIMESTAMPTZ
);
```

### 12.5 API Endpoints

```
GET   /api/running/v1/gear        ← list all gear for the user
PATCH /api/running/v1/gear        ← update category and/or retirement_km for one gear item
```

**GET /api/running/v1/gear**

- Auth required (401 if no session)
- No query params
- Response: `{ data: [{ id, name, brand_name, model_name, distance_m, retired, notification_distance_m, category, retirement_km, last_fetched_at }], message }`
- Order: retired ASC (active first), then name ASC

**PATCH /api/running/v1/gear**

- Auth required
- Body: `{ id: string (required), category?: string|null, retirement_km?: integer|null }`
- Validated via Zod schema in `schemas/runningGear.js`
- Strava sync fields (`name`, `distance_m`, `retired`) cannot be changed via this endpoint
- Response: `{ data: <updated gear row>, message }`
- Error 400 if `id` is missing or field is invalid
- Error 404 if gear is not found or belongs to another user

### 12.6 UI — Shoe Rotation Component

Shoe Rotation appears on the Dashboard page, after the Performance Trends section.

**Required states:**

| State           | Display                                                                      |
| --------------- | ---------------------------------------------------------------------------- |
| Loading         | Skeleton 3 rows (icon + name + bar)                                          |
| Error           | AlertTriangle icon + error message + "Try again" button                      |
| Empty (no gear) | Footprints icon + "No shoes synced yet" text + instruction to connect Strava |
| Has data        | List of active shoes + list of retired shoes (if any)                        |

**Per gear card layout:**

- Header: Footprints icon + shoe name + brand/model (second line, grey) + category badge (if set) + edit button (pencil, active shoes only)
- Body: total km in large text + two-tab limit toggle (see below) + mileage progress bar (violet → amber at >= 70% → red at >= 90%) + "Nearing limit" alert when >= 90% of active-tab limit
- Retired shoes: full card at 60% opacity, "Retired" badge, no edit button, no tab toggle

**Two-tab limit toggle (Strava / Manual):**

Active shoes that have at least one limit set (`notification_distance_m` or `retirement_km`) show two pill-style tab buttons next to the total distance:

- **Strava tab** — shows the `notification_distance_m` value converted to km. Label format: `Strava · {N} km`. If `notification_distance_m` is null: `Strava · —`.
- **Manual tab** — shows the `retirement_km` value. Label format: `Manual · {N} km`. If `retirement_km` is null: `Manual · —`.

Default active tab:

- If `retirement_km` is set → default to **Manual**
- If `retirement_km` is null but `notification_distance_m` is set → default to **Strava**

Switching tabs immediately updates both the progress bar and the "Nearing limit" warning to use that tab's limit value. If the selected tab's limit is null, the progress bar is hidden and "Nearing limit" is not shown even if the other tab's limit is near.

If neither limit is set, no tab toggle is shown and no progress bar is rendered.

**Inline edit form (appears inside the card, not a modal):**

- Category toggle: pill buttons (daily / tempo / race / trail / recovery / cross-training / none)
- "Retire at (km)" input: number input, min 0, max 100,000
- Save + Cancel buttons
- Optimistic update: gearList is updated locally after a successful save — no refetch required
- If save fails: show error message below the form; do not close the form

**Category options:** `daily`, `tempo`, `race`, `trail`, `recovery`, `cross-training`

### 12.7 Acceptance Criteria

```
GIVEN user is authenticated and has shoes synced from Strava
WHEN Shoe Rotation section loads
THEN active shoes appear first, retired shoes appear below with "Retired" badge and 60% opacity

GIVEN shoe has retirement_km set and no notification_distance_m
WHEN card renders
THEN Manual tab is the default active tab
AND progress bar and "Nearing limit" are based on retirement_km

GIVEN shoe has notification_distance_m set and no retirement_km
WHEN card renders
THEN Strava tab is the default active tab
AND progress bar and "Nearing limit" are based on notification_distance_m

GIVEN shoe has both notification_distance_m and retirement_km set
WHEN card renders
THEN Manual tab is the default active tab

GIVEN shoe has at least one limit set (notification_distance_m or retirement_km)
WHEN user clicks the inactive tab button
THEN progress bar and "Nearing limit" recalculate using the newly active tab's limit

GIVEN active tab's limit is null (e.g. Strava tab selected but notification_distance_m is null)
WHEN card renders
THEN no progress bar is shown and "Nearing limit" is not shown

GIVEN shoe has no retirement_km and no notification_distance_m
WHEN card renders
THEN no tab toggle is shown and no progress bar is shown

GIVEN active tab's limit is set and distance_m / active_limit_km >= 90%
WHEN card renders
THEN "Nearing limit" warning badge appears on that card
AND progress bar turns red

GIVEN active tab's limit is set and distance_m / active_limit_km is between 70% and 89%
WHEN card renders
THEN progress bar is amber colored

GIVEN active tab's limit is set and distance_m / active_limit_km is below 70%
WHEN card renders
THEN progress bar is violet colored

GIVEN user clicks the edit icon on an active shoe card
WHEN edit form opens inline
THEN current category and retirement_km are pre-filled

GIVEN user selects a category pill and enters a retirement_km
WHEN user clicks Save
THEN PATCH /api/running/v1/gear is called with { id, category, retirement_km }
AND the card updates immediately (optimistic) without page reload

GIVEN user clicks Save on the edit form
WHEN API returns an error
THEN error message is shown below the form
AND the edit form stays open (not closed)

GIVEN user clicks Cancel on the edit form
WHEN form closes
THEN no changes are saved

GIVEN no shoes are synced (empty list)
WHEN section renders
THEN empty state shows "No shoes synced yet" with instruction to connect Strava

GIVEN API call fails to load gear list
WHEN error state renders
THEN "Try again" button is visible and retries the fetch on click

GIVEN shoe is retired
WHEN edit icon is checked
THEN no edit icon is shown (retired shoes are read-only)
```

### 12.8 Validations & Error States

| Scenario                                                     | Handling                                                               |
| ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| `retirement_km` is not an integer or < 0                     | 400 from API, form shows error message                                 |
| `retirement_km` > 100,000                                    | 400 from API, form shows error message                                 |
| `category` is not one of CATEGORY_OPTIONS and not null       | 400 from API                                                           |
| `id` missing from PATCH body                                 | 400 Validation failed                                                  |
| Gear not found or belongs to another user                    | 404 Not found                                                          |
| Strava sync tries to overwrite `category` or `retirement_km` | Not allowed — sync only updates Strava-managed fields                  |
| PATCH body includes `notification_distance_m`                | Ignored — this field is Strava-managed, never writable by user via API |

### 12.9 Test IDs

Registered in `cypress/fixtures/app-constants.json` under `test_ids.running_gear.*`:

| ID                    | Element                        |
| --------------------- | ------------------------------ |
| `gearPage`            | Section root element           |
| `gearLoadingSkeleton` | Skeleton wrapper while loading |
| `gearError`           | Error container                |
| `gearList`            | `<ul>` active shoes            |
| `gearCard`            | Each `<li>` gear card          |
| `gearSaveBtn`         | Save button in edit form       |

---

## 13. Race Log

### 13.1 Overview

Race Log is a feature for recording and tracking every race you have entered. Unlike Goals (which are forward-looking), the Race Log is a historical record — every completed race can be logged with actual results (finish time, pace, position, etc.).

Two things you can manage here:

1. **Race history** — all completed races, with results and notes
2. **Upcoming race goal** — your next target race, which can also be edited directly from the Activity page (no need to redo onboarding)

### 13.2 User Stories

> As a runner, I want to log every race I've completed so that I can track my race history and see how my performance has improved over time.

> As a runner, I want to record my finish time and official distance for each race so that I can calculate accurate race-day pacing and compare across events.

> As a runner, I want to add a title and personal notes to each race entry so that I can remember the context (weather, conditions, how I felt).

> As a runner, I want to edit my upcoming race goal directly from the Activity page so that I don't have to redo onboarding to update my race target.

> As a runner, I want to see my race history ordered by date so that I can quickly spot trends in my race performance.

### 13.3 Database

#### rt_goals — schema update

Add title and description to the existing goals table (used for upcoming race goal in onboarding and NextRace card):

```sql
ALTER TABLE rt_goals
  ADD COLUMN title TEXT,
  ADD COLUMN description TEXT;
```

- `title` — race name, e.g. "Jakarta Marathon 2027", "BCA Bali Run 10K". Optional. If set, used in the NextRace card instead of the auto-generated distance label.
- `description` — free-form notes about this goal. Optional.

#### rt_race_log — new table

```sql
CREATE TABLE rt_race_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,                    -- race name, e.g. "Jakarta Marathon 2027"
  race_date DATE NOT NULL,
  distance_m NUMERIC(10,2) NOT NULL,      -- official race distance
  finish_time_sec INT,                    -- official finish time, nullable (DNF)
  avg_pace_sec_per_km NUMERIC(6,2),       -- computed: finish_time_sec / (distance_m / 1000)
  avg_hr INT,                             -- average HR during race, nullable
  elevation_gain_m NUMERIC(7,2),          -- nullable
  position_place INT,                     -- finishing position overall (all finishers), nullable
  position_male INT,                      -- finishing position within male category, nullable
  did_not_finish BOOLEAN DEFAULT FALSE,
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL, -- optional link to Strava activity
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_race_log_user_date ON rt_race_log(user_id, race_date DESC);
```

- `did_not_finish = true` → `finish_time_sec` and `avg_pace_sec_per_km` may be null
- `activity_id` — optional link to a Strava activity. When set, the activity detail page shows a "Raced: [title]" label
- `avg_pace_sec_per_km` is computed server-side on insert/update — client does not need to send it

### 13.4 API Endpoints

```
GET    /api/running/v1/race-log              ← list all race entries, ordered race_date DESC
POST   /api/running/v1/race-log              ← create a new race entry
GET    /api/running/v1/race-log/:id          ← fetch a single race entry (for detail page)
PATCH  /api/running/v1/race-log/:id          ← edit race entry
DELETE /api/running/v1/race-log/:id          ← delete race entry

PATCH  /api/running/v1/goals/:id             ← update upcoming race goal (title, description, target fields)
```

**GET /api/running/v1/race-log**

- Auth required (401 if no session)
- No query params for MVP
- Response: `{ data: [{ id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_place, position_male, did_not_finish, activity_id, notes, created_at }], message }`

**POST /api/running/v1/race-log**

- Auth required
- Body: `{ title, race_date, distance_m, finish_time_sec?, avg_hr?, elevation_gain_m?, position_place?, position_male?, did_not_finish?, activity_id?, notes? }`
- Validated via Zod schema in `schemas/raceLog.js`
- Server computes `avg_pace_sec_per_km = Math.round(finish_time_sec / (distance_m / 1000))` — only when `finish_time_sec` exists and `did_not_finish = false`
- Response: `{ data: <new race log row>, message }`

**GET /api/running/v1/race-log/:id**

- Auth required (401 if no session)
- Ownership check: 404 if entry does not belong to the user
- Response: `{ data: { id, title, race_date, distance_m, finish_time_sec, avg_pace_sec_per_km, avg_hr, elevation_gain_m, position_place, position_male, did_not_finish, activity_id, notes, created_at } }`

**PATCH /api/running/v1/race-log/:id**

- Auth required
- Body: all fields optional, but at least one must be present
- Ownership check: only the entry's owner can edit it (404 if not)
- `avg_pace_sec_per_km` is recomputed when `finish_time_sec` or `distance_m` changes
- Response: `{ data: <updated row>, message }`

**DELETE /api/running/v1/race-log/:id**

- Auth required
- Ownership check: 404 if not the owner
- Response: `{ message: "Deleted" }`

**PATCH /api/running/v1/goals/:id**

- Auth required
- Body: `{ title?, description?, target_date?, target_distance_m?, target_time_sec? }` — all optional, at least one required
- Ownership check: 404 if not the owner
- Response: `{ data: <updated goal row>, message }`

### 13.5 UI — Race Log Page

Race Log has its own page at `/running/race-log`.

**Required states:**

| State    | Display                                                                    |
| -------- | -------------------------------------------------------------------------- |
| Loading  | Skeleton rows inside table (5 rows, animate-pulse)                         |
| Error    | AlertTriangle icon + error message + "Try again" button                    |
| Empty    | Medal icon + "No races logged yet" text + "Log your first race" CTA button |
| Has data | Table of race entries, ordered race_date DESC                              |

**Table layout (implemented as shadcn `<Table>`):**

Columns: Race (title + distance label + DNF badge) | Date | Dist | Time | Pace | Place | Male

- Each row is clickable — navigates to `/running/race-log/[id]` detail page
- "Place" column = `position_place`, "Male" column = `position_male`
- DNF badge shows in title cell when `did_not_finish = true`
- `avg_pace_sec_per_km` shown as MM:SS/km; falls back to computing from `finish_time_sec / distance_m` if column is null

**Header buttons (top right):**

- "Add from activity" button (`id="addRaceFromActivityBtn"`) — opens `ActivityPickerDialog` to pick an existing Strava activity; after picking, opens `RaceConfirmDialog` to confirm auto-filling fields from the activity
- "Log race" button (`id="addRaceBtn"`) — opens blank `RaceFormModal`

**Add / Edit form (RaceFormModal):**

- Title (required) — text input
- Race date (required) — date picker (calendar popover)
- Distance (required) — dropdown preset (5K / 10K / 21.1K / 42.2K / Custom) + custom number input when Custom is selected
- Did not finish — checkbox. When checked: hide finish time field
- Finish time — time input (HH:MM:SS), required unless DNF is checked
- Avg HR — number input, optional
- Elevation gain — number input (metres), optional
- Position (place) — number input, optional — maps to `position_place`
- Position (male) — number input, optional — maps to `position_male`
- Notes — textarea, optional
- After save in Add mode: redirects to `/running/race-log/[id]` detail page

**Delete confirmation (on detail page only):**

- Alert dialog: "Delete this race entry? [title] will be permanently deleted. This cannot be undone."
- Confirm delete button + cancel
- After confirm: redirects to `/running/race-log`

**Filtering & Search (client-side, no pagination):**

- Text search input (`id="raceSearchInput"`) — debounced ~400 ms; filters the loaded list by race title (case-insensitive substring match)
- Distance filter chips — a row of pill/chip buttons shown above the table:
  - Chips: **All** | **5K** | **10K** | **21K (Half)** | **42K (Full)** | **Other**
  - "All" chip (`id="raceFilterChip_all"`) is always shown and selected by default
  - The other chips are only rendered when at least one entry in the loaded list matches that distance preset:
    - 5K = distance_m 4500–5499
    - 10K = distance_m 9500–10499
    - 21K (Half) = distance_m 20500–21499
    - 42K (Full) = distance_m 41500–42499
    - Other = any distance that does not fall into the four presets above
  - Only one chip can be active at a time; clicking the active chip resets to "All"
  - Text search and distance chip filter stack — both apply simultaneously
- Filtering runs entirely on the already-loaded list (no extra API call)

### 13.5b UI — Race Log Detail Page

Each race entry has its own detail page at `/running/race-log/[id]`.

- Fetches entry via GET /api/running/v1/race-log/:id
- If `activity_id` is set, also fetches activity detail, splits, laps, best efforts, photos, and health log for that date
- Renders the linked activity's stream data, HR zones, splits, laps, best efforts, and photos via `ActivitySection` component (same as Activities feature)
- Edit button opens `EditRaceModal` (same form fields as RaceFormModal, pre-filled with current values)
- Delete button (`id="deleteRaceBtn_raceDetailPage"`) opens AlertDialog; confirm button `id="deleteRaceConfirmBtn_raceDetailPage"`; after confirm redirects to `/running/race-log`
- Loading state: skeleton matching the detail page structure
- Error state: AlertTriangle + error message + "Try again" link (page reload)

### 13.6 UI — Edit Upcoming Race Goal (from Activity page)

On the Activity page, add a section or button "Edit race goal" that opens an edit goal modal.

Modal fields:

- Race title (text input) — pre-filled from `rt_goals.title` when available
- Target distance — same preset dropdown as Race Log
- Target date — date picker
- Description / notes (textarea) — optional
- Save + Cancel buttons

After saving, the NextRace card on the dashboard reflects the update immediately (via re-fetch or optimistic update).

**Location on Activity page:** below the activity list, in a separate card titled "Your Next Race", or integrated into the sidebar if the layout allows.

### 13.7 Acceptance Criteria

```
GIVEN user navigates to /running/race-log
WHEN page loads
THEN race entries appear ordered by race_date DESC
AND loading skeleton shows while fetching

GIVEN user has no race entries
WHEN page loads
THEN empty state shows with "Log your first race" CTA button

GIVEN user clicks "Log your first race" or the Add button
WHEN form modal opens
THEN title, race_date, distance fields are required and validated before submit

GIVEN user fills title, race_date, distance_m, finish_time_sec and submits
WHEN POST /api/running/v1/race-log is called
THEN new entry appears at top of the list
AND avg_pace_sec_per_km is computed server-side and shown correctly

GIVEN user checks "Did not finish"
WHEN form submits
THEN finish_time_sec and avg_pace_sec_per_km are null in DB
AND entry shows "DNF" badge in the list

GIVEN user clicks the edit icon on a race entry
WHEN edit modal opens
THEN all existing values are pre-filled

GIVEN user edits finish time and submits
WHEN PATCH /api/running/v1/race-log/:id is called
THEN avg_pace_sec_per_km is recomputed server-side

GIVEN user clicks the delete icon on a race entry
WHEN delete confirmation dialog appears and user confirms
THEN DELETE /api/running/v1/race-log/:id is called
AND entry is removed from the list

GIVEN another user's race log ID is used in PATCH or DELETE
WHEN request is made
THEN API returns 404 (ownership check)

GIVEN user navigates to the Activity page and clicks "Edit race goal"
WHEN modal opens
THEN current goal title, target date, distance, and description are pre-filled
AND after save, NextRace card on dashboard reflects the updated data

GIVEN user has race entries loaded on /running/race-log
WHEN user types in the search input
THEN list filters to only entries whose title contains the typed text (case-insensitive)
AND filter is applied after ~400 ms debounce (not on every keystroke)
AND clearing the input restores the full list

GIVEN user has race entries with mixed distances
WHEN page loads
THEN only distance chips for distances present in the data are shown (plus "All" always shown)

GIVEN user clicks a distance chip (e.g. "5K")
WHEN chip becomes active
THEN list filters to entries matching that distance preset
AND clicking the active chip again resets the filter to "All"

GIVEN user has both a search term typed and a distance chip selected
WHEN either filter changes
THEN both filters are applied simultaneously (intersection, not union)
```

### 13.8 Validations & Error States

| Field                        | Validation                                             | Error                                         |
| ---------------------------- | ------------------------------------------------------ | --------------------------------------------- |
| `title`                      | Required, max 200 chars                                | "Race name is required"                       |
| `race_date`                  | Required, valid date, not in future by more than 1 day | "Race date cannot be in the future"           |
| `distance_m`                 | Required, > 0, max 1000000                             | "Distance must be greater than 0"             |
| `finish_time_sec`            | Integer, > 0, required unless `did_not_finish = true`  | "Finish time is required for completed races" |
| `avg_hr`                     | Integer, 1–250                                         | "Heart rate must be between 1 and 250"        |
| `position_place`             | Integer, >= 1                                          | "Position must be 1 or greater"               |
| `position_male`              | Integer, >= 1                                          | "Position must be 1 or greater"               |
| Race not found or wrong user | —                                                      | 404 Not found                                 |
| Server error                 | —                                                      | 500 with message in response                  |

### 13.9 Test IDs

Registered in `cypress/fixtures/app-constants.json` under `test_ids.race_log.*`:

**Race Log list page (`/running/race-log`):**

| ID                        | Element                                                                                                     |
| ------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `raceLogPage`             | Page root `<div id="raceLogPage">`                                                                          |
| `raceLogLoadingSkeleton`  | Skeleton wrapper — NOTE: currently missing from rendered HTML (gap — see below)                             |
| `raceLogError`            | Error container `<div id="raceLogError" role="alert">`                                                      |
| `raceLogEmptyState`       | Empty state container `<div id="raceLogEmptyState">`                                                        |
| `raceLogList`             | Table container — NOTE: currently rendered as `<div id="raceLogTable">` not `raceLogList` (gap — see below) |
| `raceLogCard`             | Each table row — NOTE: currently no id on `<TableRow>` (gap — see below)                                    |
| `addRaceBtn`              | "Log race" button in page header                                                                            |
| `addRaceFromActivityBtn`  | "Add from activity" button in page header                                                                   |
| `raceLogFormModal`        | Add/edit modal root `<DialogContent id="raceLogFormModal">`                                                 |
| `raceLogSaveBtn`          | Save button in form modal                                                                                   |
| `raceLogDeleteBtn`        | Delete button — NOTE: delete is on detail page, not list page (gap — see below)                             |
| `raceLogDeleteConfirmBtn` | Confirm button in delete dialog — on detail page                                                            |
| `editGoalBtn`             | "Edit race goal" button on Activity detail page                                                             |
| `editGoalModal`           | Edit goal modal root                                                                                        |
| `editGoalSaveBtn`         | Save button in edit goal modal                                                                              |
| `raceSearchInput`         | Debounced text search input above the race table                                                            |
| `raceFilterChip_all`      | "All" distance filter chip — always rendered                                                                |
| `raceFilterChip_5k`       | "5K" distance filter chip — rendered only when matching entries exist                                       |
| `raceFilterChip_10k`      | "10K" distance filter chip — rendered only when matching entries exist                                      |
| `raceFilterChip_21k`      | "21K (Half)" distance filter chip — rendered only when matching entries exist                               |
| `raceFilterChip_42k`      | "42K (Full)" distance filter chip — rendered only when matching entries exist                               |
| `raceFilterChip_other`    | "Other" distance filter chip — rendered only when at least one non-preset distance exists                   |

**Race Log detail page (`/running/race-log/[id]`):**

| ID                                    | Element                               |
| ------------------------------------- | ------------------------------------- |
| `raceDetailPage`                      | Page root `<div id="raceDetailPage">` |
| `deleteRaceBtn_raceDetailPage`        | Delete race button                    |
| `deleteRaceConfirmBtn_raceDetailPage` | Confirm button in delete dialog       |

**Known gaps between `app-constants.json` registered IDs and actual rendered HTML (Tester to note):**

- `raceLogLoadingSkeleton` — skeleton rows inside `<TableBody>` have no wrapping ID; tests referencing this ID will fail to find the element
- `raceLogList` — table container rendered as `id="raceLogTable"`, not `raceLogList`; Cypress `IDS.list` selector will not find the element
- `raceLogCard` — no ID on individual `<TableRow>` elements; Cypress `IDS.card` selector will not find entries
- `raceLogDeleteBtn` — delete action only exists on the detail page, not on list rows; Cypress tests that click delete on the list will fail

---

### 13.10 Upcoming Races

Users can add races they have not yet run to the Race Log page as a planning list. After the race is completed, the user links a Strava activity to fill in the results, and the race moves to the completed list.

#### Lifecycle

```
User adds upcoming race (title, date, distance, location, notes)
        ↓
Race appears in "Upcoming" section above the race history table
Amber info guide shown, manual result fields disabled
        ↓
User finishes the race → opens Race Log → clicks "Link activity"
User searches and picks the matching Strava activity
        ↓
PATCH /api/running/v1/upcoming-races/:id { linked_activity_id }
Backend copies distance + date from the activity
Manual result fields become enabled
        ↓
User fills in additional data (finishing position, etc.) → clicks "Save as completed"
Race moves from upcoming section to race history table
```

#### Database

New table `rt_upcoming_races`:

| Column               | Type        | Notes                                           |
| -------------------- | ----------- | ----------------------------------------------- |
| `id`                 | uuid        | primary key                                     |
| `user_id`            | uuid        | FK to auth.users, RLS enforced                  |
| `title`              | text        | race name, required                             |
| `race_date`          | date        | must be >= today on create                      |
| `distance_m`         | numeric     | required, > 0                                   |
| `location`           | text        | optional, used for Google Calendar link         |
| `notes`              | text        | optional                                        |
| `linked_activity_id` | uuid        | nullable FK to rt_activities.id                 |
| `finish_position`    | integer     | nullable, can only be set after activity linked |
| `created_at`         | timestamptz | auto                                            |

RLS: `auth.uid() = user_id` — users can only access their own data.

#### API Endpoints

| Method   | Path                                 | Description                                                                                          |
| -------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/running/v1/upcoming-races`     | List all upcoming races, ordered `race_date ASC`                                                     |
| `POST`   | `/api/running/v1/upcoming-races`     | Create a new upcoming race                                                                           |
| `GET`    | `/api/running/v1/upcoming-races/:id` | Fetch a single upcoming race                                                                         |
| `PATCH`  | `/api/running/v1/upcoming-races/:id` | Update. If `linked_activity_id` is set, backend copies `distance_m` + `started_at` from the activity |
| `DELETE` | `/api/running/v1/upcoming-races/:id` | Delete an upcoming race                                                                              |

#### UI — Race Log Page

**Layout:** Upcoming Races section appears above the completed race history table.

**Upcoming race card** (card pattern, not a table row — responsive grid 1/2/3 columns):

- Title, date, distance, location
- Countdown badge: red when ≤7 days, amber when ≤30 days, slate otherwise (reuses logic from NextRace.jsx)
- **Amber info guide** — `bg-amber-50 border border-amber-200`, `Info` icon in `text-amber-500`, text in `text-xs text-amber-800`, `role="note"`:
  > _"This race has not been run yet. Once the race is done, link a Strava activity to complete the results."_
  > Removed from DOM after an activity is linked.
- **Disabled result fields** — shown as metric chips (Finish time, Position, Avg HR, Elevation) with `—` values in `text-slate-300 font-mono` on `bg-slate-50 border border-slate-100`. Tooltip: _"Link a Strava activity to fill in results."_ After linking, chips are replaced with enabled input fields.
- **"Link activity"** button (primary, bottom left) — opens `ActivityPickerDialog` (reused from "Add from activity" flow)
- **"Add to Google Calendar"** button (outline, bottom right) — generates a Google Calendar URL and opens it in a new tab

**After an activity is linked:**

- Amber info guide is removed from the DOM
- Metric chips are replaced with enabled input fields
- **"Save as completed"** button appears — clicking it fades the card out over 300ms and moves the race to the race history table

**Google Calendar URL:**

```
https://calendar.google.com/calendar/render?action=TEMPLATE
  &text={encodeURIComponent(title)}
  &dates={YYYYMMDD}/{YYYYMMDD+1}
  &details={encodeURIComponent(distance + notes)}
  &location={encodeURIComponent(location)}
```

All-day format is used to avoid timezone bugs. Pure frontend — no backend call or API key needed.

**Add upcoming race modal** — fields: title (required), race_date (required, must be a future date), distance (preset Select), location (optional), notes (optional). Zod + react-hook-form, same pattern as existing modals.

**Empty state** — dashed border container (`border-dashed border-slate-200 rounded-xl bg-slate-50`) with a Flag icon, explanatory text, and an "Add a race" button.

#### Acceptance Criteria

```
GIVEN user clicks "Add upcoming race"
WHEN form is filled with title, date (future), distance
THEN upcoming race is saved and appears in the upcoming section

GIVEN upcoming race has not been linked to an activity
WHEN user views the card
THEN amber info guide is shown
AND result fields are displayed as disabled metric chips

GIVEN user clicks "Link activity"
WHEN user selects an activity from the picker
THEN PATCH is called with linked_activity_id
AND amber info guide is removed from the DOM
AND metric chips are replaced with enabled input fields

GIVEN manual fields are now enabled
WHEN user fills in data and clicks "Save as completed"
THEN card fades out over 300ms
AND race appears in the race history table

GIVEN user clicks "Add to Google Calendar"
WHEN the link is generated
THEN a new tab opens with Google Calendar pre-filled

GIVEN race_date has passed but no activity has been linked
WHEN user views the card
THEN amber info guide remains visible (does not auto-expire)
```

#### Validations

| Field             | Rule                                                       |
| ----------------- | ---------------------------------------------------------- |
| `title`           | Required, max 200 chars                                    |
| `race_date`       | Required, must be >= today on create                       |
| `distance_m`      | Required, > 0                                              |
| `location`        | Optional, max 300 chars                                    |
| `finish_position` | Optional, integer > 0, only valid after activity is linked |

#### Test IDs

Registered in `cypress/fixtures/app-constants.json` under `test_ids.upcoming_races.*`:

| ID                                         | Element                                |
| ------------------------------------------ | -------------------------------------- |
| `upcomingRacesSection_raceLogPage`         | Section container on the race-log page |
| `addUpcomingRaceBtn_raceLogPage`           | "Add upcoming race" button             |
| `upcomingRaceCard_raceLogPage`             | Individual race card                   |
| `upcomingRaceInfoGuide_raceLogPage`        | Amber info guide callout               |
| `linkActivityBtn_raceLogPage`              | "Link activity" button per card        |
| `addToCalendarBtn_raceLogPage`             | "Add to Google Calendar" button        |
| `upcomingRaceFormModal_raceLogPage`        | Add/edit modal root                    |
| `upcomingRaceSaveBtn_raceLogPage`          | Save button in modal                   |
| `saveAsCompletedBtn_raceLogPage`           | "Save as completed" button             |
| `deleteUpcomingRaceBtn_raceLogPage`        | Delete button per card                 |
| `deleteUpcomingRaceConfirmBtn_raceLogPage` | Confirm button in delete dialog        |

---

## 14. Computed Metrics Formulas

### Training Stress Score (rTSS)

```
rTSS = (duration_sec × NGS × IF) / (threshold_pace × 3600) × 100
NGS  = avg pace (simplified)
IF   = avg_pace / threshold_pace
```

### TRIMP (HR-based alternative)

```
TRIMP = duration_min × HRr × 0.64 × e^(1.92 × HRr)
HRr   = (avg_hr - resting_hr) / (max_hr - resting_hr)
```

### ACWR

```
ACWR = avg_load_last_7d / avg_load_last_28d
Optimal: 0.8 – 1.3
Warning: 1.3 – 1.5
Danger:  > 1.5 (injury risk increases significantly)
```

### Race predictor (Riegel formula)

```
T2 = T1 × (D2 / D1)^1.06
Example: 5K PR 22:45 → Half marathon ≈ 1:47:xx
```

### VO2max estimation

```
From PR and distance: use VDOT lookup table (Jack Daniels methodology)
From HR + pace: use Firstbeat approximation
```

---

## 15. Background Workers

All background jobs run via **Inngest** — serverless-native, no persistent server required.

Two types of jobs:

- **Event-driven** — triggered by an action (e.g., user connects Strava, webhook arrives)
- **Scheduled (cron)** — run automatically on a schedule, suitable for fast jobs (< 60 seconds)

```
INNGEST FUNCTIONS (event-driven + long-running):

strava/backfill                (trigger: user connects Strava)
  └─ Step 1: fetch all pages of /athlete/activities (paginated)
  └─ Step 2: per activity → fan-out to strava/fetch-streams
  └─ Inngest handles retries automatically on failure

strava/fetch-streams           (trigger: each activity from backfill or webhook)
  └─ Fetch time-series HR/GPS/pace from Strava API
  └─ Insert into activity_streams
  └─ Trigger anomaly-detector on completion

strava/handle-webhook-event    (trigger: POST /api/sync/webhook)
  └─ create → fetch new activity detail + streams
  └─ update → re-fetch and update data
  └─ delete → soft delete or remove from DB

ai/anomaly-detector            (trigger: after strava/fetch-streams completes)
  └─ Fetch latest activity + 30-day baseline for same activity type
  └─ Check these metrics:

  ACWR spike
    condition : acwr > 1.5
    severity  : warning
    example   : "Training load this week is 1.8x higher than your 4-week average"

  Abnormal HR drift
    condition : avg_hr of latest activity > (baseline avg_hr × 1.10) at same pace (±10%)
    severity  : attention
    example   : "Average HR 162 bpm on today's easy run — 12% higher than usual at this pace"

  Significant pace drop
    condition : avg_pace > (baseline avg_pace × 1.08) for the same activity type
    severity  : attention
    example   : "Today's tempo run pace is 8% slower than your 4-week average"

  Consistency disruption
    condition : no activity for 10 days (previously averaging ≥ 3 runs/week)
    severity  : info
    example   : "You haven't run in 10 days — your goal race is X weeks away"

  └─ If anomaly found → insert into ai_insights with insight_type = 'anomaly'
  └─ If no anomaly → no insert, no notification

ai/generate-daily-insight      (trigger: cron daily 06:00)
  └─ AI generates 1 insight card for today

ai/weekly-review               (trigger: cron Sunday 19:00)
  └─ AI generates a comprehensive week summary

SCHEDULED CRON FUNCTIONS:

stravaGapHeal                  (cron: 0 2 * * * — daily at 02:00)
  └─ Find activities with enriched_at IS NULL older than 1 hour
  └─ Only targets users with an active Strava connection (needs_reconnect = false)
  └─ Cap: 50 activities per user per run (GAP_CAP_PER_USER)
  └─ Sends strava/fetch-streams Inngest event for each qualifying activity

raceReminderNotification       (cron: 0 8 * * * — daily at 08:00)
  └─ Find upcoming races at 14 / 7 / 3 / 1 days away
  └─ Check if notification already sent for that threshold (notifications_sent JSONB column)
  └─ Send push notification with race-specific message
  └─ Mark threshold as sent in rt_upcoming_races.notifications_sent
  └─ Respects notify_race_reminder + push_notifications_enabled settings
  └─ Clears expired push subscriptions automatically

fridayPrepNotification         (cron: 0 8 * * 5 — every Friday at 08:00)
  └─ Determine current week range (Monday to now)
  └─ Skip if friday_prep insight already exists for this week_start (deduplication)
  └─ Build weekly context via buildFridayPrepContext (recent activities, training load, etc.)
  └─ Call Claude Sonnet 4.6 via generateInsight (max_tokens 1500, insight_type 'friday_prep')
  └─ Save insight to rt_ai_insights with data_refs: { week_start, mode }
  └─ Send push notification: "Weekend Training Plan Ready"
  └─ Respects notify_friday_prep + push_notifications_enabled settings
  └─ Clears expired push subscriptions automatically

compute-daily-metrics          (daily 03:00)
  └─ Compute TSS, ACWR, training load aggregation from yesterday's activities

strava-sync-poll               (every 1 hour)
  └─ Fallback when Strava webhook is missed — check for new activities since last_sync_at
  └─ If new activities found → trigger strava/fetch-streams via Inngest
```

### Inngest setup

Inngest requires one endpoint in the app to receive function invocations:

```
POST  /api/inngest    ← Inngest server sends jobs here for execution
```

All Inngest functions are registered at this endpoint. Inngest free tier: 50,000 events/month — sufficient for a personal app.

---

## 16. Push Notification (PWA)

### 15.1 Setup overview

Push notifications in a PWA work via three components:

```
Browser (Service Worker)  ←→  Push Service (browser vendor)  ←→  App Server
```

- **VAPID keys** — a public/private key pair that proves notifications genuinely come from our server
- **Service Worker** — a script running in the browser background that receives push events even when the app is not open
- **Push subscription** — an object from the browser containing a unique endpoint per device, stored in the DB

### 15.2 Setup flow

```
1. User opens app → browser requests notification permission
2. User clicks "Allow"
3. Browser registers service worker → receives a PushSubscription object:
   {
     endpoint: "https://fcm.googleapis.com/...",
     keys: { p256dh: "...", auth: "..." }
   }
4. App sends subscription to server:
   POST /api/running/v1/user/push-subscription
   body: { subscription }
5. Server saves to rt_user_settings.push_subscription
6. Server can now push notifications to this device at any time
```

### 15.3 Server-side: sending notifications

```javascript
import webpush from 'web-push'

webpush.setVapidDetails(
  'mailto:' + process.env.VAPID_EMAIL,
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
)

async function sendPushNotification(userId, payload) {
  const settings = await getUserSettings(userId)
  if (!settings.push_notifications_enabled) return
  if (!settings.push_subscription) return

  await webpush.sendNotification(settings.push_subscription, JSON.stringify(payload))
}

// Example payload
const payload = {
  title: 'Weekly Review Ready',
  body: 'This week: 42km, ACWR 1.1 — best performance this month.',
  icon: '/icon-192.png',
  url: '/analytics',
}
```

### 15.4 Notification triggers

| Event                          | Trigger                                     | Send condition                                   | Setting  |
| ------------------------------ | ------------------------------------------- | ------------------------------------------------ | -------- |
| Post-activity insight complete | Inngest `ai/generate-post-activity-insight` | `notify_post_activity = true`                    | Settings |
| Weekly review complete         | Cron Sunday 19:00                           | `notify_weekly_review = true`                    | Settings |
| Anomaly detected               | Inngest `ai/check-anomaly`                  | `notify_anomaly = true` + severity ≥ `attention` | Settings |
| Friday prep                    | Inngest cron Friday 08:00                   | `notify_friday_prep = true`                      | Settings |
| Race reminder                  | Inngest cron daily 08:00                    | `notify_race_reminder = true`                    | Settings |

**Friday prep** is a combined notification: training load for the current week + recommended weekend sessions. Generated by Claude Sonnet 4.6 (see `fridayPrepNotification` in section 15).

All settings default to `true`. Users can disable them individually on the Settings page.

### 15.5 Required environment variables

```
VAPID_PUBLIC_KEY=    ← generate once: npx web-push generate-vapid-keys
VAPID_PRIVATE_KEY=   ← store in .env, never commit
VAPID_EMAIL=         ← contact email for the push service
```

### 15.6 Additional endpoints

```
POST   /api/running/v1/user/push-subscription    ← save subscription object from browser
DELETE /api/running/v1/user/push-subscription    ← remove subscription (user disables notifications)
```

### 15.7 Service worker (public/sw.js)

```javascript
self.addEventListener('push', (event) => {
  const data = event.data.json()
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      data: { url: data.url },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(clients.openWindow(event.notification.data.url))
})
```

---

## 17. Encryption Strategy

### 16.1 What is encrypted

| Data                                  | Location     | Reason                                                        |
| ------------------------------------- | ------------ | ------------------------------------------------------------- |
| `strava_credentials.access_token`     | DB           | Active token — if leaked, an attacker can read all activities |
| `strava_credentials.refresh_token`    | DB           | More critical — long-lived, can generate new access tokens    |
| `garmin_credentials.credentials_data` | DB (Phase 2) | Garmin credentials, depends on integration method             |

### 16.2 Algorithm

**AES-256-GCM** — chosen because:

- 256-bit key — strong
- GCM mode — authenticated encryption, also detects tampering
- Built into Node.js `crypto` module — no extra library needed

### 16.3 Implementasi

```javascript
import { createCipheriv, createDecipheriv, randomBytes } from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex') // 32 bytes = 64 hex chars

export function encrypt(plaintext) {
  const iv = randomBytes(12) // 96-bit IV for GCM
  const cipher = createCipheriv(ALGORITHM, KEY, iv)

  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag() // 16-byte auth tag

  // Stored as: iv(12) + authTag(16) + ciphertext — all in hex
  return iv.toString('hex') + authTag.toString('hex') + encrypted.toString('hex')
}

export function decrypt(ciphertext) {
  const iv = Buffer.from(ciphertext.slice(0, 24), 'hex') // 12 bytes
  const authTag = Buffer.from(ciphertext.slice(24, 56), 'hex') // 16 bytes
  const content = Buffer.from(ciphertext.slice(56), 'hex')

  const decipher = createDecipheriv(ALGORITHM, KEY, iv)
  decipher.setAuthTag(authTag)

  return decipher.update(content) + decipher.final('utf8')
}
```

The IV (Initialization Vector) is freshly generated on every encryption call — never reused. The IV does not need to be secret; it is stored alongside the ciphertext.

### 16.4 Key management

```
ENCRYPTION_KEY=   ← 64 hex characters (= 32 bytes)
                  ← generate: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
                  ← store in .env.local and Vercel environment variables
                  ← NEVER commit to git
```

Key rotation: if `ENCRYPTION_KEY` needs to change, a migration is required — decrypt all tokens with the old key and re-encrypt with the new key. This process must be atomic and run during a maintenance window.

### 16.5 Where encrypt/decrypt is called

| Operation                | When                                                         |
| ------------------------ | ------------------------------------------------------------ |
| `encrypt(access_token)`  | On save to DB — after OAuth callback and after token refresh |
| `decrypt(access_token)`  | Immediately before making a call to the Strava API           |
| `encrypt(refresh_token)` | Same as access_token                                         |
| `decrypt(refresh_token)` | During the token refresh process                             |

Tokens are never logged in plaintext — not even in error logs.

---

## 18. Non-functional Requirements

### Performance

- Dashboard load < 2 seconds
- Activity detail render < 1 second
- AI streaming: first token < 2 seconds
- Strava sync: background, non-blocking

### Security

- Strava tokens encrypted AES-256-GCM at rest (see section 17 for implementation details)
- HTTPS only, HSTS enabled
- All API keys in environment variables, never in code
- Session via Supabase SSR (httpOnly cookie)
- Strava token refresh + rotation on every call
- Personal data is not sent to AI as training data

### Reliability

- Graceful degradation when Strava API is down (serve last cached data)
- Retry with exponential backoff for all external calls
- Polling fallback when webhook is missed
- Daily encrypted DB backup
- Manual entry always works regardless of Strava connection status

---

## 19. Development Phases & Timeline

### Phase 1 — MVP

| #   | Phase                       | Scope                                                                                                                 | Estimate     |
| --- | --------------------------- | --------------------------------------------------------------------------------------------------------------------- | ------------ |
| 1   | **Setup**                   | Scaffold Next.js, Supabase auth (shared), Drizzle + DB schema, Vercel deploy, Inngest setup, env vars                 | 1 week       |
| 2   | **Onboarding**              | Onboarding wizard (biometric + Strava connect + goal), `/api/user/profile`, `/api/user/settings`, middleware redirect | 0.5 weeks    |
| 3   | **Strava ingestion**        | OAuth flow, webhook (GET verify + POST handler), backfill via Inngest, polling fallback, rate limit, token encryption | 1.5 weeks    |
| 4   | **Upload & manual entry**   | GPX/FIT parser, dedup logic, manual workout form, daily health log                                                    | 1 week       |
| 5   | **Dashboard & activity UI** | Dashboard, activity list, activity detail + map + charts, streams downsampling                                        | 1.5 weeks    |
| 6   | **Analytics**               | Trend charts, training load (ACWR), race predictor, PR tracking, VO2max estimation                                    | 1 week       |
| 7   | **AI Insight Engine**       | Post-activity insight, weekly review, anomaly detector, on-demand analysis                                            | 1 week       |
| 8   | **PWA + push notification** | Service worker, VAPID setup, push subscription flow, notification triggers                                            | 0.5 weeks    |
|     | **— MVP shipped —**         |                                                                                                                       | **~7 weeks** |

### Phase 2 — Health integration

| #   | Phase                  | Scope                                                                   | Estimate              |
| --- | ---------------------- | ----------------------------------------------------------------------- | --------------------- |
| 9   | **Garmin integration** | Strategy TBD (official API / unofficial), credentials, sync job         | 2 weeks               |
| 10  | **Health UI**          | Health tabs, daily health card, mini trends per metric                  | 1.5 weeks             |
| 11  | **Advanced analytics** | Correlation view (2-metric overlay), readiness score composite          | 1.5 weeks             |
| 12  | **AI Coach advanced**  | Cross-metric reasoning, HRV/RHR-based anomaly detection, readiness mode | 1.5 weeks             |
| 13  | **Chat Coach**         | Live chat interface, conversation history, tool use, streaming SSE      | 1.5 weeks             |
|     | **— Full platform —**  |                                                                         | **~15.5 weeks total** |

### Sequencing notes

- Phase 1 #2 (Onboarding) **must complete before** #3 (Strava ingestion) — backfill requires the user to have a row in the DB first
- Phase 1 #3 (Strava ingestion) **must complete before** #5 (Dashboard) — no data means no UI to test
- Phase 1 #8 (PWA) can run in parallel with #7 (AI Coach) to move faster
- Phase 2 can start after MVP has been stable for at least 4 weeks of real usage

---

## 20. Risks

| Risk                                       | Likelihood | Impact | Mitigation                                                                      |
| ------------------------------------------ | ---------- | ------ | ------------------------------------------------------------------------------- |
| Strava rate limit hit during backfill      | Medium     | Low    | Throttle to 80 req/15 min, queue via Inngest                                    |
| Webhook missed events                      | Medium     | Low    | Polling fallback every 1 hour                                                   |
| Inngest free tier limit exceeded           | Low        | Low    | 50k events/month is sufficient for a personal app. Monitor in Inngest dashboard |
| Garmin Phase 2 more complex than estimated | Medium     | Medium | Schema already prepared, can fall back to unofficial library                    |
| AI cost overrun                            | Medium     | Medium | Monitor token usage, cache context                                              |
| Data loss                                  | Low        | High   | Daily encrypted backup                                                          |
| Strava policy change                       | Low        | Medium | Raw data stored in `activities.raw_data`, can be re-processed                   |

---

## 21. Architectural Decisions (final)

| #   | Question             | Decision                                | Implications                                                                                                              |
| --- | -------------------- | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| 1   | Deployment           | **Vercel**                              | Serverless — API routes run as Vercel Functions. Long-running jobs via Inngest. Scheduled jobs via Inngest cron           |
| 2   | Database time-series | **Regular PostgreSQL** (no TimescaleDB) | Uses proper indexes on `timestamp` + `activity_id` columns. Sufficient for personal app data volumes                      |
| 3   | AI model             | **Claude Sonnet 4.6 for all queries**   | No routing logic needed. Estimated cost ~$6.3/month                                                                       |
| 4   | HR zones methodology | **All three methods**                   | User can pick the methodology in Settings. Default: % of Max HR (simplest). Karvonen and Lactate Threshold also available |
| 5   | Garmin Phase 2       | **Wait** until Phase 1 is stable        | No need to apply for Garmin API now. Focus on Strava first                                                                |
| 6   | Notification         | **Push notification (PWA)**             | Requires service worker + Web Push API. Used for: weekly review ready, training anomalies, race reminders, Friday prep    |
| 7   | Strava disconnect    | **Default: retain historical data**     | When the user disconnects Strava, workout data stays in the DB. User can manually delete all data from the Danger Zone    |

### Note: Inngest + Vercel Cron

Vercel serverless does not natively support long-running background workers. The solution:

- **Inngest** for all event-driven jobs that may run long (Strava backfill, stream fetching, anomaly detection, weekly review AI)
- **Inngest cron** for scheduled jobs: compute daily metrics, polling fallback every 1 hour

Inngest works by sending job invocations to the `/api/inngest` endpoint in the app — the Vercel function executes the work, while Inngest manages retries, fan-out, and step execution.

---

### 21a. HR Zones Detail — DONE

All three methodologies are available; the user selects one in Settings → HR Zones (`rt_user_settings.hr_zones_method`, default `max_hr`). Implemented in `lib/services/running/analytics/getZoneAnalytics.js`.

| Methodology                 | Formula                                 | When to use                                            | Required profile field          |
| --------------------------- | --------------------------------------- | ------------------------------------------------------ | ------------------------------- |
| **% Max HR** (default)      | Zone = HR / max_hr × 100                | Default. Simplest — no resting HR needed               | `max_hr`                        |
| **HR Reserve (Karvonen)**   | HRR = (HR - RHR) / (max_HR - RHR) × 100 | More accurate for endurance. Requires resting HR input | `max_hr`, `resting_hr_baseline` |
| **Threshold-based (Friel)** | Zone relative to lactate threshold HR   | Most accurate. Requires threshold HR from a test       | `threshold_hr`                  |

Implemented zone boundaries (% of each methodology's anchor value):

| Zone | Nama      | % (Max HR) | % (Karvonen)  | % (Threshold HR) |
| ---- | --------- | ---------- | ------------- | ---------------- |
| Z1   | Recovery  | < 60%      | < 50% (floor) | < 81%            |
| Z2   | Aerobic   | 60–70%     | 50–65%        | 81–89%           |
| Z3   | Tempo     | 70–80%     | 65–75%        | 89–94%           |
| Z4   | Threshold | 80–90%     | 75–90%        | 94–106%          |
| Z5   | VO2 max   | > 90%      | > 90%         | > 106%           |

Karvonen Z1 has a hard floor at 50% HRR (not open-ended `< 50%`) — anything below resting + 50% HRR still falls into Z1. Z4 in the Threshold method is intentionally wider (94–106%) — this is the standard Friel band around lactate threshold, not a typo.

---

### 21b. Pace Zones Detail — DONE

Single methodology — Daniels-style % of threshold pace, anchored to `rt_users.threshold_pace_sec` (seconds per km). Implemented in `lib/services/running/analytics/getZoneAnalytics.js` (`computePaceBoundaries`).

| Zone | Name      | Range (× threshold pace) |
| ---- | --------- | ------------------------ |
| Z1   | Easy      | ≥ 1.29×T (slower)        |
| Z2   | Aerobic   | 1.14×T – 1.29×T          |
| Z3   | Tempo     | 1.06×T – 1.14×T          |
| Z4   | Threshold | 0.97×T – 1.06×T          |
| Z5   | VO2max    | < 0.97×T (faster)        |

**Threshold pace input — Settings → Pace Zones** (`settings/components/PaceZonesSection.jsx`), two modes:

| Mode          | Test ID                               | Behaviour                                                                                          |
| ------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Manual        | `paceZonesMode_manual_settingsPage`   | User types pace directly as `mm:ss` (`thresholdPaceInput_settingsPage`). Validates 2:00–15:00 /km. |
| From Activity | `paceZonesMode_activity_settingsPage` | `detectThresholdPaceBtn_settingsPage` calls `GET /api/running/v1/user/threshold-pace-detect`       |

**Detection algorithm** (`threshold-pace-detect/route.js`): requires `threshold_hr` to already be set. Fetches run activities (`Run` / `TrailRun` / `VirtualRun`) from the last 90 days that have `avg_hr`, then samples stream rows where `heart_rate` is within ±6% of `threshold_hr` and `velocity_m_s` is between 1.5–7.0 m/s. The average velocity of those samples becomes `threshold_pace_sec`. Requires at least 30 sample points — returns 404 "Insufficient data" if fewer. Saves the result (manual or detected) to `rt_users.threshold_pace_sec` via `updateUserProfile`.

---

### 21c. Cadence Bands Detail — DONE

Used in two places with different data sources — important not to conflate:

| Location              | Field                                 | Unit                                                                                                        |
| --------------------- | ------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Zone Analytics card   | `rt_activity_streams.cadence`         | Full spm — already doubled at ingest from Strava (`stravaFetchStreams.js`; Strava sends single-leg cadence) |
| Activity detail chart | `cadence_spm` (computed in component) | Also full spm, computed from raw stream cadence                                                             |

Band boundaries (same in both places, source: `StreamCharts.jsx`):

| Band         | Range (spm) |
| ------------ | ----------- |
| Beginner     | < 165       |
| Recreational | 165–175     |
| Semi-athlete | 175–185     |
| Elite        | ≥ 185       |

180 spm is often cited as the "ideal target" — this comes from Jack Daniels' observation of elite Olympic runners at race pace, not from a controlled study. Optimal cadence is individual (depends on leg length and speed); below 170 spm is associated with higher ground reaction force and increased injury risk.

---

---

## 22. Racing Weight

**Priority:** P2 — nice to have. Informational only; no coaching/prescription.

**Location:** `app/main/running/(app)/race-log/components/RacingWeightSection.jsx`, rendered on the Race Log detail page for each completed race entry.

### 22.1 Overview

The Racing Weight section shows the user's current weight relative to an evidence-based optimal BMI range for their race distance category. It is purely informational — no recommendations to lose or gain weight.

Requires `weight_kg` and `height_cm` to be set in the user's profile (section 11.7.1). Returns null (renders nothing) if either field is missing.

### 22.2 Race Distance Categories and Optimal BMI Ranges

| Category | Distance range | Optimal BMI |
| -------- | -------------- | ----------- |
| 5K       | < 7 km         | 19–23       |
| 10K      | 7–15 km        | 19–22       |
| Half     | 15–30 km       | 19–21       |
| Full     | ≥ 30 km        | 18.5–21     |

Category is derived from the linked race's `distance_m`. If no completed race is linked or no race distance is available, the section does not render.

### 22.3 UI

**Progress bar (`racingWeightBar_{pageId}`):**

- Horizontal bar spanning the full BMI range visible on screen (e.g. 15–30).
- Optimal band highlighted in violet.
- Current weight dot positioned on the bar based on computed BMI.
- Current BMI and current weight shown as text alongside the dot.

**What-if estimate (`racingWeightWhatIf_{pageId}`):**

- Shown only when the user's current BMI is outside the optimal range.
- Estimates the time improvement (or loss) using a simplified linear model based on weight delta to the nearest optimal BMI boundary.
- Framing is neutral — "estimated race time at optimal weight" not "you should lose X kg".

**Section root:** `racingWeightSection_{pageId}` where `{pageId}` is the race log entry ID.

### 22.4 Acceptance Criteria

```
GIVEN user has weight_kg and height_cm set in profile
AND race entry has a known distance_m
WHEN Race Log detail page loads
THEN RacingWeightSection renders with the correct BMI category for the race distance

GIVEN user's BMI is within the optimal range for the race distance category
WHEN section renders
THEN current weight dot is shown inside the violet optimal band
AND no what-if estimate is shown

GIVEN user's BMI is outside the optimal range
WHEN section renders
THEN what-if estimate is shown below the progress bar
AND framing is neutral (no direct weight loss/gain prescription)

GIVEN user's profile has no weight_kg or no height_cm
WHEN Race Log detail page loads
THEN RacingWeightSection does not render (returns null)
```

---

_End of document. Version 3.2 — 2026-06-17 — Comprehensive PRD overhaul. (A) Translated all remaining Indonesian text to English throughout the file — sections 11.1, 11.2, 12.1–12.9, 13.1–13.10, 14–21 and all inline DB/code comments. (B) Added 8 missing analytics chart specs to new section 11.2b: Fitness Age Trend, Endurance Score Trend, PMC, Calorie Burn Trend, Weekly Elevation Trend, Terrain Distribution, Running Power, Best Pace by Distance. (C) Added YtdStats component spec and Endurance Score tile to section 11.1. (D) Added section 11.6 Pace Calculator page spec: 3-tab UI (Pace / Projection / Steps), Riegel race projection table, splits table, unit toggle with localStorage persistence, test IDs. (E) Added section 11.7 Running Settings page spec with 6 subsections: 11.7.1 Profile, 11.7.2 HR Zones, 11.7.3 Pace Zones, 11.7.4 Notifications, 11.7.5 Strava Connection, 11.7.6 Danger Zone. (F) Expanded section 8.8 AI endpoints: added POST /api/running/v1/ai/insights/followup, POST /api/running/v1/ai/insights/daily, GET /api/running/v1/ai/injury-coach/history. (G) Added section 22 Racing Weight: BMI-based optimal ranges per race category, progress bar + what-if UI spec, acceptance criteria. (H) Added GET /api/running/v1/calendar to section 8.7 (Analytics API). (I) Added POST /api/running/v1/auth/strava/re-enrich and POST /api/running/v1/auth/strava/re-enrich-metrics to section 5.9 (Re-enrich endpoints). (J) Added stravaGapHeal, raceReminderNotification, fridayPrepNotification to section 15 (Background Workers) with full cron schedule and step-by-step logic. (K) Fixed API path: DELETE /api/user/activities → DELETE /api/running/v1/user/activities in section 11.7.6._

_Previous: Version 3.0 — 2026-06-06 — GitHub Issue #160. Added section 10.11 Injury & Sports Medicine AI Coach: two new AI roles (Sports Physiotherapist `focus:physio` + Sports Medicine Physician `focus:sports_medicine`), new DB table `rt_symptom_logs` (auto-archive after 30 days inactivity), `InjuryCoachCard.jsx` component spec (placed between DailyInsightCard and FridayPrepCard on Dashboard), context form with body part / injury phase pills / question textarea, persistent disclaimer strip, client-side pain 10/10 block (no LLM call), `[ESCALATE]` token detection, ACWR > 1.4 + recent symptom trigger, `POST /api/running/v1/ai/injury-coach` endpoint spec, acceptance criteria, validations, error states, and 16 test IDs._

_Previous: Version 2.9 — 2026-06-02 — GitHub Issue #93. Added §5.8 Connection Health & Broken State: needs_reconnect flag lifecycle, Inngest exit behavior on flag=true, persistent amber banner spec (test IDs: stravaDisconnectBanner / stravaReconnectBtn), Settings reconnect path, and error state classification (401 permanent vs 5xx transient). Updated §5.2 Token Refresh failure branch: 401 → set needs_reconnect=TRUE + abort Inngest job (no retry) + log Sentry; 5xx/network → existing exponential backoff unchanged. Updated strava_credentials schema: added needs_reconnect BOOLEAN NOT NULL DEFAULT FALSE with migration ALTER TABLE statement. Updated GET /api/user/strava-status response shape to include needs_reconnect: boolean._

_Previous: Version 2.7 — 2026-05-30 — Section 10.4 Implementation Status: marked EF trend arrow (id="efTrendArrow"), VO2max 30-day rolling average on Analytics page (Vo2maxTrendChart.jsx), and Analytics page /running/analytics as DONE. Updated EF stat tile testid to reflect actual implementation (id="efficiencyFactor_activityDetailPage"). Post-delivery validation for v1.1 features completed — all 12 acceptance criteria pass._

_Previous: Version 2.6 — 2026-05-29 — Section 13 Race Log: added client-side filtering & search to 13.5 (debounced text search + distance filter chips All/5K/10K/21K/42K/Other; chips only rendered when matching data exists; filters stack); added acceptance criteria for search and filter chip behaviors to 13.7; added test IDs raceSearchInput, raceFilterChip_all, raceFilterChip_5k, raceFilterChip_10k, raceFilterChip_21k, raceFilterChip_42k, raceFilterChip_other to 13.9._

_Previous: Version 2.5 — Section 13 Race Log synced with actual implementation: (1) DB columns renamed position_overall/position_category → position_place/position_male throughout schema, API specs, validations table. (2) UI spec updated from card layout to table layout; table columns documented. (3) "Add from activity" flow (addRaceFromActivityBtn + ActivityPickerDialog + RaceConfirmDialog) documented. (4) Race Log detail page /running/race-log/[id] added as Section 13.5b with own test IDs. (5) GET /api/running/v1/race-log/:id endpoint added to Section 13.4. (6) Test IDs section split into list page / detail page; missing IDs (raceLogLoadingSkeleton, raceLogList, raceLogCard, raceLogDeleteBtn on list) flagged as known gaps for Tester._
