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
