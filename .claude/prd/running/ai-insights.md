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
