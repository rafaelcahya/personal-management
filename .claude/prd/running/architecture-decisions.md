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
