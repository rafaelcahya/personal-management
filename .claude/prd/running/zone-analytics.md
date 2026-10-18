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
