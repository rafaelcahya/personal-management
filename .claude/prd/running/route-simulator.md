## 24. Route Pacing Simulator

**Page:** `/running/route-simulator`
**Status:** New feature — first spec.

---

### 24.1 Overview

The Route Pacing Simulator helps you plan how to run a hilly route so you hit a target while keeping your effort even. You give it a route that has elevation data and a target (either an average pace or a finish time), and it works out the actual pace you should run each part of the route.

The key idea: on a route with climbs and descents, running the exact same pace everywhere is a bad strategy — you blow up on the climbs and coast the descents. Instead the simulator keeps your **effort** even and lets your **pace** move with the terrain (slower uphill, faster downhill), so the overall average still lands on your target. That is how experienced runners actually race hills.

**Route comes from one of two places** — both already carry elevation:

- **Upload a GPX file** of a planned route (from Strava routes, Komoot, a race organiser, etc.)
- **Pick a past activity** you have already run (uses the `altitude_m` stream)

Drawing a route on the map (Route Builder, section 23) is not a source here — those routes are straight-line and have no elevation.

This is a separate menu from Route Builder. Route Builder plans _where_ you run; the Simulator plans _how_ you run it.

---

### 24.2 User Stories

> As a runner, I want to upload a GPX of a planned route and set a target pace so that I get a per-km plan that already accounts for the hills.

> As a runner, I want to reuse the elevation profile of a past run so that I can plan a repeat effort without a file.

> As a runner, I want a color-coded elevation profile that shows where to ease off and where to let it roll so that I don't burn out on the climbs.

> As a runner, I want a realistic predicted finish time for a hilly route so that my expectations match reality instead of a flat-course guess.

> As a runner, I want the AI coach to explain the strategy in plain language so that I actually know how to run it on the day.

> As a runner, I want to save simulations so that I can revisit and compare strategies for the same race.

---

### 24.3 The Pacing Model

This is the engine every output is built on. It runs server-side when a simulation (or preview) is requested.

**Step 1 — Segment the route.**
Resample the route into fixed ~100 m segments. For each segment `i` compute distance `d_i` (m), elevation change `Δh_i` (m), and gradient `g_i = Δh_i / d_i` (a fraction), clamped to `[-0.30, +0.30]` to keep the model sane on GPS noise and cliffs.

**Step 2 — Grade Adjustment Factor (GAF).**
Use Minetti's energy-cost-of-running polynomial (the same family Strava's GAP is based on). Cost of transport at gradient `i` (fraction), in J/kg/m:

```
Cr(i) = 155.4·i⁵ − 30.4·i⁴ − 43.3·i³ + 46.3·i² + 19.5·i + 3.6
GAF(g) = Cr(g) / Cr(0)          // Cr(0) = 3.6
```

`GAF > 1` on climbs (costs more), and it dips to a minimum around −10% to −15% before rising again on steep descents — so downhill is _not_ treated as free speed. Braking cost is built in.

**Step 3 — Solve for the even-effort flat-equivalent pace `E`.**
`E` (sec/km) is the pace you would hold on flat ground at the chosen effort. Actual pace on segment `i` is `E · GAF(g_i)`. Total time is:

```
T(E) = Σ (d_i / 1000) · E · GAF(g_i) = E · Σ (d_i / 1000) · GAF(g_i)
```

`T` is linear in `E`, so `E` solves in closed form (no search needed):

```
E = T_target / Σ[(d_i / 1000) · GAF(g_i)]
```

- **Time mode:** `T_target` = the finish time the user set.
- **Pace mode:** `T_target = target_pace × (total_distance / 1000)`.

**Step 4 — Actual pace per segment** = `E · GAF(g_i)`. Aggregate the 100 m segments up to per-km rows for the plan table.

**Step 5 — Effort zones (chart color).** Classify each segment by gradient:

| Gradient        | Zone    | Instruction                                  | Color |
| --------------- | ------- | -------------------------------------------- | ----- |
| `g > +2%`       | Climb   | Ease off — run slower than target, save legs | Amber |
| `−2% ≤ g ≤ +2%` | Cruise  | Hold target pace                             | Slate |
| `g < −2%`       | Descend | Let it roll but stay controlled              | Green |

**Step 6 — Energy budget.** Cumulative metabolic work `Σ Cr(g_i)·d_i` (J/kg), shown as **% of total consumed vs distance**. Because effort is even, the budget burns evenly over _time_ but non-linearly over _distance_ — a climb eats a bigger slice of the tank per km. The chart makes the expensive stretches obvious.

**Step 7 — HR / effort guidance.** Map `E` to an HR zone using the user's `max_hr` / threshold. Since effort is even, the target HR band is roughly constant for the whole route. Guidance text: hold this zone throughout; expect HR to drift up on climbs — don't chase pace to force it back down.

**Step 8 — Reality check.** Requires `threshold_pace_sec` on the profile. If the computed `E` is **faster than** the user's threshold pace, the target demands running above lactate threshold for the entire route — not sustainable. Set `is_realistic = false`, and compute a suggested achievable finish by re-solving with `E = threshold_pace_sec`. If `threshold_pace_sec` is not set, skip the check and show an info note that setting threshold pace unlocks it.

> **Model note:** GAF here is speed-independent, so `E` is closed-form. If a future version adds speed- or fatigue-dependent cost, this becomes an iterative solve (binary search on `E`) — the rest of the pipeline is unchanged. Personal calibration of the GAF curve from historical hill splits is deferred to a later phase.

---

### 24.4 Database

```sql
CREATE TABLE rt_route_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('gpx_upload','activity')),
  source_activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,  -- set when source = 'activity'
  target_mode TEXT NOT NULL CHECK (target_mode IN ('pace','time')),
  target_pace_sec_per_km NUMERIC(6,2),      -- set when target_mode = 'pace'
  target_time_sec INT,                      -- set when target_mode = 'time'
  total_distance_m NUMERIC(10,2) NOT NULL,  -- route distance = the plan distance
  total_elevation_gain_m NUMERIC(7,2) NOT NULL,
  total_elevation_loss_m NUMERIC(7,2) NOT NULL,
  effort_flat_pace_sec_per_km NUMERIC(6,2) NOT NULL,  -- E
  predicted_time_sec INT NOT NULL,          -- even-effort finish on this route
  is_realistic BOOLEAN NOT NULL DEFAULT TRUE,
  suggested_time_sec INT,                   -- set when is_realistic = false
  elevation_profile JSONB NOT NULL,         -- [{cum_dist_m, ele_m, grade, gaf, pace_sec_per_km, zone, energy_pct}]
  km_splits JSONB NOT NULL,                 -- [{km, pace_sec_per_km, ele_gain_m, ele_loss_m, target_hr_low, target_hr_high}]
  ai_strategy TEXT,                         -- AI Coach narrative; null until generated
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_route_sim_user ON rt_route_simulations(user_id, created_at DESC);
```

The route defines the distance — there is no separate "target distance" field. A 10.2 km GPX plans for 10.2 km, which is more honest than pretending it is exactly 10 km.

---

### 24.5 API Endpoints

```
GET    /api/running/v1/route-simulations              <- list saved simulations (id, name, distance, predicted time, created_at)
POST   /api/running/v1/route-simulations/preview      <- compute WITHOUT saving; returns full result for live preview
POST   /api/running/v1/route-simulations              <- compute + save; returns saved row
GET    /api/running/v1/route-simulations/:id          <- full detail (profile + splits + ai_strategy)
PATCH  /api/running/v1/route-simulations/:id          <- rename
DELETE /api/running/v1/route-simulations/:id          <- delete
POST   /api/running/v1/route-simulations/:id/ai-strategy  <- generate / regenerate AI narrative
```

**Notes:**

- `preview` and `POST` share the same compute core. `preview` is stateless (nothing written), used to show the result before the user commits to Save.
- GPX source: `POST`/`preview` accept the GPX as multipart file upload (or a parsed points array). Reuse the existing GPX parser from activity upload (section 6.1 / file upload). Reject GPX with no elevation tags (see error states).
- Activity source: body carries `source: 'activity'`, `activity_id`. Backend reads the activity's altitude stream. To populate the activity picker, the client can call the existing `GET /api/activities` and filter to activities with `elevation_gain_m > 0`.
- All endpoints are session-gated (401) with ownership checks on `:id` (403 / 404).
- `ai-strategy` calls Claude (Sonnet 4.6, temp 0.3, max ~400 tokens). Context = target, total distance, total gain/loss, predicted time, the km splits, and the locations of the biggest climbs and descents. Output is a plain-language strategy saved to `ai_strategy`. Follows the AI patterns in section 10 (validation, single retry, graceful skip).

---

### 24.6 UI — Route Simulator Page

Follows the standard section-card pattern: icon + title + subtitle header, skeleton on load, error + retry. Violet focus ring on all inputs. All ids use the `{component}_routeSimulatorPage` convention.

**Layout (top to bottom):**

1. **Input card** — `simulatorInputCard_routeSimulatorPage`
   - Source toggle: `Upload GPX` / `From Activity` (`sourceToggle_routeSimulatorPage`)
     - GPX: file input `gpxUpload_routeSimulatorPage`
     - Activity: searchable select of past activities with elevation `activitySelect_routeSimulatorPage`
   - Target mode toggle: `Pace` / `Time` (`targetModeToggle_routeSimulatorPage`)
     - Pace input `mm:ss` (`targetPaceInput_routeSimulatorPage`)
     - Time input `h:mm:ss` (`targetTimeInput_routeSimulatorPage`)
   - `Simulate` button (`simulateBtn_routeSimulatorPage`) → calls `preview`
   - Name input + `Save` button (`saveSimulationBtn_routeSimulatorPage`) → calls `POST`

2. **Result — summary strip** — `simResultSummary_routeSimulatorPage`
   - Total distance · total gain / loss · predicted finish · flat-equivalent effort pace
   - **Reality-check banner** (`realityCheckBanner_routeSimulatorPage`, amber) when `is_realistic = false`: "This target means running above your threshold the whole way — likely not sustainable. A realistic finish is ~{suggested_time}."

3. **Elevation profile + effort zones** — `elevationChart_routeSimulatorPage`
   - Recharts area chart of elevation vs distance, segments colored by zone (amber / slate / green). Legend included.

4. **Energy budget** — `energyBudgetChart_routeSimulatorPage`
   - Cumulative % of energy consumed vs distance, with markers on the biggest-cost climbs.

5. **Per-km pace plan table** — `paceTable_routeSimulatorPage`
   - Columns: KM · Target Pace · Elev +/− · Target HR · Zone. Table headers uppercase, tracking-wide.

6. **HR / effort guidance** — `effortGuidance_routeSimulatorPage`
   - Target HR band + one-line coaching note.

7. **AI strategy card** — `aiStrategyCard_routeSimulatorPage`
   - Shows `ai_strategy`. `Generate strategy` / `Regenerate` button (`generateStrategyBtn_routeSimulatorPage`) with loading + error states.

8. **Saved simulations card** — `savedSimulationsCard_routeSimulatorPage`
   - List of saved rows with view / rename / delete; skeleton, error+retry, empty state + CTA.

---

### 24.7 Validations

| Field           | Rule                                                                     |
| --------------- | ------------------------------------------------------------------------ |
| Simulation name | Required to save, 1–100 chars, trimmed                                   |
| GPX file        | Valid GPX, must contain elevation (`<ele>`) data, ≤ 10 MB                |
| Activity source | Selected activity must have an elevation stream (`elevation_gain_m > 0`) |
| Target pace     | `mm:ss`, range 2:30–15:00 /km                                            |
| Target time     | `h:mm:ss`, positive, ≥ a floor derived from route distance (sanity)      |
| Target mode     | Exactly one of pace / time must be provided                              |

---

### 24.8 Error States

| Scenario                           | Handling                                                                              |
| ---------------------------------- | ------------------------------------------------------------------------------------- |
| GPX has no elevation data          | Reject before compute: "This GPX has no elevation data, so it can't be simulated."    |
| GPX invalid / unparseable          | `toast.error('Could not read this GPX file')`                                         |
| Selected activity has no elevation | Disable it in the picker; if forced, "This activity has no elevation data."           |
| Target impossible for route        | Not an error — `is_realistic = false` + amber banner with suggested finish (see 24.3) |
| Threshold pace not set             | Info note in banner: "Set your threshold pace in Settings for a realistic check."     |
| Save / list / delete fails         | `toast.error` with API message; list has error + Retry state                          |
| AI strategy generation fails       | Card shows error + Retry; simulation itself is unaffected                             |
| Unauthorized / not found on `:id`  | 403 / 404 → `toast.error('Access denied')` / `toast.error('Simulation not found')`    |

---

### 24.9 Test IDs

| ID                                           | Description                          |
| -------------------------------------------- | ------------------------------------ |
| `simulatorInputCard_routeSimulatorPage`      | Input card container                 |
| `sourceToggle_routeSimulatorPage`            | GPX / Activity source toggle         |
| `gpxUpload_routeSimulatorPage`               | GPX file input                       |
| `activitySelect_routeSimulatorPage`          | Past-activity picker                 |
| `targetModeToggle_routeSimulatorPage`        | Pace / Time toggle                   |
| `targetPaceInput_routeSimulatorPage`         | Target pace input                    |
| `targetTimeInput_routeSimulatorPage`         | Target time input                    |
| `simulateBtn_routeSimulatorPage`             | Runs preview compute                 |
| `saveSimulationBtn_routeSimulatorPage`       | Saves the simulation                 |
| `simResultSummary_routeSimulatorPage`        | Summary strip                        |
| `realityCheckBanner_routeSimulatorPage`      | Amber banner when target unrealistic |
| `elevationChart_routeSimulatorPage`          | Elevation profile + effort zones     |
| `energyBudgetChart_routeSimulatorPage`       | Energy budget chart                  |
| `paceTable_routeSimulatorPage`               | Per-km pace plan table               |
| `effortGuidance_routeSimulatorPage`          | HR / effort guidance block           |
| `aiStrategyCard_routeSimulatorPage`          | AI strategy narrative card           |
| `generateStrategyBtn_routeSimulatorPage`     | Generate / regenerate AI strategy    |
| `savedSimulationsCard_routeSimulatorPage`    | Saved simulations card               |
| `savedSimulationsLoading_routeSimulatorPage` | Skeleton rows                        |
| `savedSimulationsError_routeSimulatorPage`   | Error + Retry                        |
| `savedSimulationsEmpty_routeSimulatorPage`   | Empty state + CTA                    |
| `savedSim_{id}_routeSimulatorPage`           | Per-simulation row                   |
| `viewSimBtn_{id}_routeSimulatorPage`         | View a saved simulation              |
| `renameSimBtn_{id}_routeSimulatorPage`       | Rename                               |
| `deleteSimBtn_{id}_routeSimulatorPage`       | Delete                               |

---

### 24.10 Acceptance Criteria

**24.10.1 Compute from GPX**

```
GIVEN user uploads a valid GPX with elevation and sets target pace 5:00 /km
WHEN user clicks Simulate
THEN a per-km plan is shown whose overall average pace equals ~5:00 /km
AND uphill km show a slower pace than 5:00 and downhill km show a faster pace
AND the elevation chart is colored by climb / cruise / descend zones
```

**24.10.2 Compute from activity**

```
GIVEN user picks a past activity that has elevation data and sets a finish time
WHEN user clicks Simulate
THEN the plan is computed from that activity's elevation profile
AND predicted finish time equals the target time (within rounding)
```

**24.10.3 Even-effort behavior**

```
GIVEN a route with significant climbs
WHEN the plan is computed
THEN target HR band is roughly constant across all km (even effort)
AND per-km pace varies with gradient
```

**24.10.4 Reality check**

```
GIVEN threshold_pace_sec is set AND the computed effort pace E is faster than it
THEN is_realistic = false
AND realityCheckBanner_routeSimulatorPage shows a suggested achievable finish time

GIVEN threshold_pace_sec is not set
THEN the banner shows an info note to set threshold pace, and no false warning is raised
```

**24.10.5 GPX without elevation**

```
GIVEN user uploads a GPX that has no <ele> data
WHEN the file is parsed
THEN compute is blocked with a clear message and no simulation is produced
```

**24.10.6 Save, list, delete**

```
GIVEN a computed simulation and a name
WHEN user clicks Save
THEN it is persisted and appears in savedSimulationsCard_routeSimulatorPage

GIVEN a saved simulation belonging to another user
WHEN user requests it by id
THEN the API returns 403
```

**24.10.7 AI strategy**

```
GIVEN a saved simulation
WHEN user clicks Generate strategy
THEN a plain-language strategy is generated and shown in aiStrategyCard_routeSimulatorPage
AND it references where to hold back (climbs) and where to press (descents/flats)

GIVEN AI generation fails
THEN the card shows an error + Retry and the simulation data is unaffected
```
