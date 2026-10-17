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
