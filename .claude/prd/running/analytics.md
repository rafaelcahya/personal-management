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
