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
