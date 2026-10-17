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
