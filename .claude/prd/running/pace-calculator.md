### 11.6 Pace Calculator page

**Route:** `/main/running/run-calculator`
**Component:** `app/main/running/(app)/run-calculator/page.jsx`

> As a runner, I want to calculate my target pace, project a finish time for a given distance, and see per-km splits, so that I can plan my race strategy without leaving the app.

The Pace Calculator is a fully client-side tool — no API calls are made. All calculations use in-browser JavaScript. The unit preference (km / mi) is persisted to `localStorage` under the key `runCalculatorUnit`.

**Three calculator modes (tabbed layout):**

| Tab              | Test ID                       | Purpose                                                               |
| ---------------- | ----------------------------- | --------------------------------------------------------------------- |
| Pace Mode        | `tabPace_runCalculator`       | Given distance + total time → compute avg pace, speed in km/h and mph |
| Projection Mode  | `tabProjection_runCalculator` | Given pace → find finish time for a distance OR distance for a time   |
| Steps → Distance | `tabSteps_runCalculator`      | Given step count → estimate distance (assumes 0.9m avg step length)   |

**Pace Mode inputs:**

- Distance selector (`DistanceSelect.jsx`) — preset dropdown (5K, 10K, 21.1K, 42.2K, Custom) + custom numeric input when "Custom" is selected. Test IDs: `distancePreset_runCalculator`, `customDistance_runCalculator`
- Time input (`TimeInput.jsx`) — HH:MM:SS fields. Test IDs: `time_runCalculator_{hours,minutes,seconds}`
- Results: pace /km (`paceKm_runCalculator`), pace /mi (`paceMi_runCalculator`), speed km/h (`speedKmh_runCalculator`), speed mph (`speedMph_runCalculator`)

**Projection Mode inputs:**

- Pace input (MM:SS per km or mi) — `projPaceMinutes_runCalculator`, `projPaceSeconds_runCalculator`
- Sub-mode toggle (`projSubMode_runCalculator`): "I have a distance → find time" (`projModeDistance_runCalculator`) or "I have a time → find distance" (`projModeTime_runCalculator`)
- Distance selector: `projDistancePreset_runCalculator`, `projCustomDistance_runCalculator`
- Time input: `projTime_runCalculator_{hours,minutes,seconds}`
- Results: estimated time (`projResultTime_runCalculator`) or estimated distance (`projResultDistance_runCalculator`), avg pace (`projAvgPace_runCalculator`)

**Steps Mode input:**

- Step count input (`stepsCount_runCalculator`) — positive integer, max 200,000
- Results: distance in km (`stepsDistanceKm_runCalculator`), distance in mi (`stepsDistanceMi_runCalculator`)

**Below the tabs (when valid pace + distance are computed):**

- `SplitsTable.jsx` — per-km or per-mi splits up to a max of 50 rows (grouped when distance is large); shows split number, split time, cumulative time
- `RaceProjectionTable.jsx` — Riegel-formula projections for common race distances based on the current pace/time pair

**Validation and warnings:**

- Pace outside 2:00–20:00 /km (120–1,200 s/km) → amber warning banner "Pace seems unusual — please check your inputs"
- Steps input that is not a positive integer → amber warning "Steps must be a positive whole number"
- Steps > 200,000 → treated as invalid

**Unit toggle (`unitToggle_runCalculator`):** km / mi radio buttons. Switching unit recalculates all displayed values immediately. Selected unit is saved to `localStorage`.

**Acceptance criteria:**

```
GIVEN user selects 10K distance and enters time 50:00
WHEN Pace Mode calculates
THEN pace displays 5:00 /km and 8:03 /mi

GIVEN user enters pace 5:00 /km and selects 21.1K distance in Projection Mode
WHEN result is computed
THEN estimated time displays 1:45:33

GIVEN user enters 10000 steps in Steps Mode
THEN distance displays 9.00 km and 5.59 mi

GIVEN calculated pace is below 2:00 /km
WHEN result renders
THEN amber warning appears: "Pace seems unusual — please check your inputs"

GIVEN valid pace + distance are in Pace Mode or Projection Mode
WHEN the split table renders
THEN rows show correct split time and cumulative time per km (or mi)

GIVEN user switches unit from km to mi
WHEN all result tiles update
THEN pace displays in /mi and speed in mph; unit preference is saved to localStorage
```

---
