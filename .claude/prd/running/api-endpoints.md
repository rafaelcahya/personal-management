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

### 8.9 Garmin merge (#922)

New Garmin endpoints and changes to activity detail, activity list, and sync status are described in `garmin-integration.md`, section 26.11. The contract is in Postman: folder **Running > Garmin merge (#922, planned)**.

---
