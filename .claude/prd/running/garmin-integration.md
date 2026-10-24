## 26. Garmin Integration (Activity Merge, #922)

**API contract:** Postman collection `postman/personal-management.postman_collection.json` → folder **Running > Garmin merge (#922, planned)**. Payloads live there, not here.
**Related:** Strava sync in `strava.md` (section 5), activity page in `activity-detail.md` (section 11.3), Settings in `settings.md` (section 11.7).

### 26.1 Overview

Every activity comes from Strava today. Strava only passes on the basics from the watch and drops a lot of Garmin-only numbers. We tested the Garmin Connect Personal API on a real 15K run (Forerunner 165):

- The core numbers (distance, time, HR, calories, power, laps) are the same as Strava. Garmin isn't more accurate, it's more detailed.
- Garmin adds: Training Effect and its label, ground contact time, vertical oscillation and ratio, stride length, grade-adjusted pace, RPE and feel from the watch, Body Battery cost, and estimated sweat loss.
- Not filled on the FR165: training load, recovery HR, lactate threshold HR. These stay empty (nullable) and no screen is built on them.

**Decisions (final):**

- **Keep Strava, enrich with Garmin.** Strava is not replaced.
- **The merge happens in our database**, not with live calls. The app never calls Garmin when a page loads.
- The Strava webhook triggers the Garmin match. A daily job imports Garmin runs that are missing from our DB.
- Garmin Personal API: read-only, no webhook. The user makes an API key in Garmin Connect (valid 30 to 365 days). We swap it for an access token (a raw JWT, valid 24 hours, no refresh token).

**Out of scope:**

- Parsing FIT files (per-second running dynamics).
- Sleep, HRV, stress, and daily wellness data (separate future issue).
- A weekly trend chart for Running Form, a Training Effect filter, and AI Coach using Garmin metrics (future work).
- Push or in-app notifications for key expiry (future work, see 26.3).

### 26.2 Merge rules

| Data                                                                                                                                                         | Winner | Notes                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ | ----------------------------------------------------------------------- |
| Training Effect (aerobic, anaerobic, label, messages), running dynamics (ground contact, vertical oscillation and ratio, stride length), body battery, sweat | Garmin | Shown in the `garmin` object                                            |
| Map, streams, splits, best efforts, gear, kudos, achievements, PRs                                                                                           | Strava | Garmin never touches these                                              |
| Core numbers (distance, time, HR, calories, power)                                                                                                           | Strava | They are the same anyway. Garmin-only rows (26.5) use the Garmin values |
| `perceived_exertion`                                                                                                                                         | User   | Filled from Garmin RPE only when empty. See below                       |

**`perceived_exertion` rules:**

- Garmin RPE is rounded to a whole number from 1 to 10.
- It is written only when `perceived_exertion` is empty. A value the user typed is never overwritten.
- If the user clears it later, the next Garmin refresh fills it again.
- `activity.data_sources` tells the app where things came from: `primary` is `strava` or `garmin`, `garmin_linked` is true or false, `perceived_exertion_from` is `garmin` or null.

### 26.3 Garmin connection (Settings)

The card sits on the Running Settings page, next to the Strava section (section 11.7).

#### User Stories

- As a runner, I want to paste my Garmin API key in Settings, so that my runs get the extra Garmin numbers without me doing anything else.
- As a runner, I want to remove the Garmin connection, so that the app forgets my key when I don't want it linked anymore.
- As a runner, I want to see when my key expires, so that I can make a new one before the extra data stops.
- As a runner, I want my missed runs to come back after I reconnect, so that I don't have holes in my history.

#### Connection states

| Status          | When                                           | What the card shows                                              |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------- |
| `not_connected` | No key saved                                   | Explain text + key field + expiry date field + "Connect" button  |
| `connected`     | Key works and not expired                      | Last 4 characters, "expires in N days", last sync time, "Remove" |
| `expired`       | Today is past `key_expires_at`                 | Message "Your key expired" + field to save a new key             |
| `invalid`       | Garmin rejected the key before its expiry date | Message with last error + field to save a new key                |

The key itself is never shown again after saving. Only the last 4 characters and the expiry date.

#### Acceptance Criteria

- GIVEN I'm not connected WHEN I save a valid key and an expiry date THEN the key is checked with Garmin, saved encrypted, and the card shows `connected` with the last 4 characters and the expiry date.
- GIVEN I enter a key Garmin rejects WHEN I save THEN nothing is stored and I see "Garmin rejected the API key".
- GIVEN Garmin is down WHEN I save a key THEN nothing is stored and I see "Garmin API is unavailable. Try again later."
- GIVEN I'm connected WHEN I call the connection endpoint THEN the key is never in the response. Only `key_last4` and `key_expires_at`.
- GIVEN I'm connected WHEN I remove the connection THEN the stored key and cached token are deleted, the card shows `not_connected`, and metrics already linked to my activities stay.
- GIVEN I'm connected WHEN the key has 14 days or less left THEN the card shows an amber warning "Expires in N days. Make a new key in Garmin Connect."
- GIVEN I'm connected WHEN the key has more than 14 days left THEN the card shows "Expires in N days" with no warning.
- GIVEN my status was `expired` or `invalid` WHEN I save a new working key THEN a sync starts on its own from the last successful sync time back, capped at 90 days, so missed runs are linked or imported.
- GIVEN the Garmin key is expired or invalid WHEN a Strava activity syncs THEN Strava works as normal and only the Garmin step is skipped.
- GIVEN I have never synced with Garmin WHEN I save a key THEN the catch-up covers the last 7 days.

Key expiry reminders by push or in-app notification are not part of this version.

### 26.4 Linking a Strava activity to Garmin

- GIVEN a Strava activity is saved WHEN Garmin is connected THEN a background job looks for a Garmin activity with a start time within 60 seconds and a distance within 2%, and links it.
- GIVEN more than one Garmin activity matches WHEN linking THEN the one with the closest start time is used.
- GIVEN no Garmin activity matches WHEN linking THEN the activity stays Strava-only (`garmin` is `null`). The daily job tries again later.
- GIVEN a Garmin activity is already linked to another run WHEN linking THEN it is not linked twice.
- GIVEN Garmin is down or rate-limited (429) WHEN linking THEN the Strava activity is already saved and nothing is lost. The job retries with backoff. Garmin requests run one after another, never in parallel.
- GIVEN an activity is linked WHEN the match is made THEN the Garmin metrics are saved in our DB and `perceived_exertion` follows the rules in 26.2.
- GIVEN I open "Refresh Garmin metrics" for one activity WHEN it isn't linked yet THEN matching runs again first, then the metrics are fetched again.

### 26.5 Daily import of missing runs

User story: As a runner, I want runs that exist on my Garmin but not in the app to show up on their own, so that no run is ever missing.

- GIVEN Garmin is connected WHEN the daily job runs THEN it checks the last 7 days of Garmin activities and imports any that don't exist in our DB, with `source = 'garmin'`.
- GIVEN a Garmin run is already linked or matches an existing run (26.4 rules) WHEN the job runs THEN it is not imported again.
- GIVEN a run came from Garmin (e.g. the 5K on 23 Oct 2026 that Strava never delivered) WHEN I look at the dashboard and stats THEN it counts like any other run. On its detail page the map, splits, streams, best efforts, and gear sections are empty and hidden.
- GIVEN a Garmin-sourced run exists WHEN Strava later delivers the same run THEN the Strava webhook finds that row using the 26.4 match and upgrades it to `source = 'strava'`. No duplicate is created.
- GIVEN the key is expired, invalid, or missing WHEN the job runs THEN it skips this user and does not fail.

The Strava-side reason for the 23 Oct run missing is a separate bug and is not fixed here.

### 26.6 Manual sync

- GIVEN Garmin is connected WHEN I trigger a sync with no dates THEN the last 7 days are linked and gaps imported. The endpoint returns right away (202) and the work runs in the background.
- GIVEN I send a date range WHEN it is 90 days or less THEN that range is synced.
- GIVEN I send a range over 90 days WHEN I trigger a sync THEN I get a validation error "Date range must be 90 days or less".
- GIVEN a Garmin sync is already running WHEN I trigger another THEN I get "A Garmin sync is already running" (429).
- GIVEN Garmin is not connected WHEN I trigger a sync or refresh THEN I get "Garmin is not connected" (409).

### 26.7 What the user sees

UI/UX owns layout and test ids. This section only says what must be there.

**Activity detail page (section 11.3):**

- A **Running Form** section: ground contact time, vertical oscillation, vertical ratio, stride length, cadence. Only shown when the activity has Garmin data. Each tile is hidden when its value is null.
- A **Training Effect** section: aerobic and anaerobic effect and the label (for example Lactate Threshold). Hidden when empty.
- Also shown when filled: grade-adjusted pace, body battery cost, sweat loss.
- No Garmin data means these sections are not on the page at all. No empty cards, no errors.
- RPE shows in the existing RPE tile. When it came from Garmin, say so in a hint.
- Training load, recovery HR, and lactate threshold HR have no UI.
- A "Refresh Garmin metrics" action appears when Garmin is connected.

**Activities list:** each row shows a small Training Effect label badge when there is one. `has_garmin` marks runs with Garmin data.

**Sync status:** the existing sync status also tells the Garmin state (`status`, last sync time, key expiry). The Garmin card in Settings uses the connection endpoint.

### 26.8 Validations

| Field / Rule         | Rule                                                           | Error                                      |
| -------------------- | -------------------------------------------------------------- | ------------------------------------------ |
| `api_key`            | Required, not empty. Must be accepted by Garmin when saved     | "Garmin rejected the API key"              |
| `expires_at`         | Required date. Today or later, and at most 1 year from today   | "Pick the expiry date you chose in Garmin" |
| Sync `from` / `to`   | Valid dates, `from` before or equal to `to`, range max 90 days | "Date range must be 90 days or less"       |
| Match window         | Start within 60 seconds and distance within 2%                 | No link made                               |
| `perceived_exertion` | Garmin RPE rounded to 1 to 10, only when empty                 | Not written otherwise                      |
| Ownership            | Every endpoint only touches the logged-in user's data          | 404 for other users' activities            |

### 26.9 Error states

| Situation                           | What happens                                                    |
| ----------------------------------- | --------------------------------------------------------------- |
| Garmin API down on save             | 502 "Garmin API is unavailable", nothing stored                 |
| Garmin API down in background job   | Retry with backoff. Strava data is unaffected                   |
| Garmin returns 429                  | Back off and retry. Requests stay one at a time                 |
| Cached token expired (401)          | Swap the stored key for a new token once and retry              |
| Key rejected on swap                | Status becomes `invalid`, `last_error` is set, Garmin jobs skip |
| Past `key_expires_at`               | Status becomes `expired`, Garmin jobs skip                      |
| Refresh with no matching Garmin run | 404 "No matching Garmin activity"                               |
| Not connected                       | 409 "Garmin is not connected"                                   |
| Sync already running                | 429 "A Garmin sync is already running"                          |
| Not logged in                       | 401 "Authentication required"                                   |

### 26.10 Data model (summary)

Exact columns are decided in the backend plan. The rules are:

- `rt_activities.garmin_activity_id` — set when linked or imported. Unique per user.
- `rt_activity_garmin_metrics` — one row per linked activity (1:1). Training Effect, running dynamics, RPE, feel, body battery, sweat, and the nullable FR165-unsupported fields. Also `matched_at`.
- `rt_garmin_credentials` — one row per user: encrypted API key, last 4 characters, expiry, cached access token (encrypted) and its expiry, status, `last_error`, `last_synced_at`.
- The API key and token are encrypted like the Strava tokens (see `encryption.md`) and are never returned by any endpoint or written to logs.
- Removing the connection deletes `rt_garmin_credentials` only. Linked metrics stay.

### 26.11 Endpoints

All under `/api/running/v1`. Request and response examples are in the Postman folder named at the top of this section.

| Method | Path                              | Purpose                                                         | Success |
| ------ | --------------------------------- | --------------------------------------------------------------- | ------- |
| GET    | `/activities/{id}`                | Changed: adds `garmin` (or `null`) and `activity.data_sources`  | 200     |
| GET    | `/activities`                     | Changed: adds `has_garmin` and `training_effect_label` per item | 200     |
| GET    | `/sync/status`                    | Changed: adds the Garmin state, last sync, key expiry           | 200     |
| POST   | `/activities/{id}/garmin/refresh` | Match again if needed and refresh Garmin metrics                | 200     |
| POST   | `/sync/garmin`                    | Queue a manual sync, max 90 days                                | 202     |
| GET    | `/garmin/connection`              | Connection status (never the key)                               | 200     |
| PUT    | `/garmin/connection`              | Check and save the API key and expiry                           | 200     |
| DELETE | `/garmin/connection`              | Remove the key and cached token                                 | 204     |

### 26.12 Background jobs

| Job                  | Trigger                                        | Does                                                           |
| -------------------- | ---------------------------------------------- | -------------------------------------------------------------- |
| Link Garmin activity | After a Strava activity is saved               | Match (26.4), save metrics, fill RPE                           |
| Garmin daily sync    | Daily cron                                     | Import missing runs from the last 7 days (26.5), link unlinked |
| Garmin manual sync   | `POST /sync/garmin` and a successful reconnect | Same work for a date range, max 90 days                        |

All jobs skip users without a working Garmin key, call Garmin one request at a time, and back off on 429.

### 26.13 Definition of Done

- [ ] Garmin card in Running Settings with all four states and the expiry warning
- [ ] Key stored encrypted, never returned, removed on disconnect
- [ ] Strava activities link to Garmin automatically (60 seconds, 2%)
- [ ] Merge rules and RPE rule work as in 26.2
- [ ] Daily import and manual sync work, including the reconnect catch-up
- [ ] Garmin-sourced runs upgrade to Strava with no duplicates
- [ ] Detail page shows Running Form and Training Effect only when data exists
- [ ] List shows the Training Effect label
- [ ] Expired or invalid key never breaks Strava sync
- [ ] All endpoints match the Postman folder, and Backend adds example payloads for list and sync status
- [ ] Cypress API tests pass 100%
