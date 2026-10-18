## 22. Racing Weight

**Priority:** P2 — nice to have. Informational only; no coaching/prescription.

**Location:** `app/main/running/(app)/race-log/components/RacingWeightSection.jsx`, rendered on the Race Log detail page for each completed race entry.

### 22.1 Overview

The Racing Weight section shows the user's current weight relative to an evidence-based optimal BMI range for their race distance category. It is purely informational — no recommendations to lose or gain weight.

Requires `weight_kg` and `height_cm` to be set in the user's profile (section 11.7.1). Returns null (renders nothing) if either field is missing.

### 22.2 Race Distance Categories and Optimal BMI Ranges

| Category | Distance range | Optimal BMI |
| -------- | -------------- | ----------- |
| 5K       | < 7 km         | 19–23       |
| 10K      | 7–15 km        | 19–22       |
| Half     | 15–30 km       | 19–21       |
| Full     | ≥ 30 km        | 18.5–21     |

Category is derived from the linked race's `distance_m`. If no completed race is linked or no race distance is available, the section does not render.

### 22.3 UI

**Progress bar (`racingWeightBar_{pageId}`):**

- Horizontal bar spanning the full BMI range visible on screen (e.g. 15–30).
- Optimal band highlighted in violet.
- Current weight dot positioned on the bar based on computed BMI.
- Current BMI and current weight shown as text alongside the dot.

**What-if estimate (`racingWeightWhatIf_{pageId}`):**

- Shown only when the user's current BMI is outside the optimal range.
- Estimates the time improvement (or loss) using a simplified linear model based on weight delta to the nearest optimal BMI boundary.
- Framing is neutral — "estimated race time at optimal weight" not "you should lose X kg".

**Section root:** `racingWeightSection_{pageId}` where `{pageId}` is the race log entry ID.

### 22.4 Acceptance Criteria

```
GIVEN user has weight_kg and height_cm set in profile
AND race entry has a known distance_m
WHEN Race Log detail page loads
THEN RacingWeightSection renders with the correct BMI category for the race distance

GIVEN user's BMI is within the optimal range for the race distance category
WHEN section renders
THEN current weight dot is shown inside the violet optimal band
AND no what-if estimate is shown

GIVEN user's BMI is outside the optimal range
WHEN section renders
THEN what-if estimate is shown below the progress bar
AND framing is neutral (no direct weight loss/gain prescription)

GIVEN user's profile has no weight_kg or no height_cm
WHEN Race Log detail page loads
THEN RacingWeightSection does not render (returns null)
```

---

_End of document. Version 3.3 — 2026-07-14 — Added section 23 Route Builder: first formal PRD spec for the Route Builder feature. Covers current as-built state, v1 improvements (empty state, pace input, distance disclaimer, delete waypoint, last waypoint highlight, mobile floating undo, route line border, saved routes empty CTA), v2 improvements (GPX export, fullscreen drawing mode), DB schema for rt_saved_routes, API endpoints, UI specs, test IDs, and acceptance criteria._

_Previous: Version 3.2 — 2026-06-17 — Comprehensive PRD overhaul. (A) Translated all remaining Indonesian text to English throughout the file — sections 11.1, 11.2, 12.1–12.9, 13.1–13.10, 14–21 and all inline DB/code comments. (B) Added 8 missing analytics chart specs to new section 11.2b: Fitness Age Trend, Endurance Score Trend, PMC, Calorie Burn Trend, Weekly Elevation Trend, Terrain Distribution, Running Power, Best Pace by Distance. (C) Added YtdStats component spec and Endurance Score tile to section 11.1. (D) Added section 11.6 Pace Calculator page spec: 3-tab UI (Pace / Projection / Steps), Riegel race projection table, splits table, unit toggle with localStorage persistence, test IDs. (E) Added section 11.7 Running Settings page spec with 6 subsections: 11.7.1 Profile, 11.7.2 HR Zones, 11.7.3 Pace Zones, 11.7.4 Notifications, 11.7.5 Strava Connection, 11.7.6 Danger Zone. (F) Expanded section 8.8 AI endpoints: added POST /api/running/v1/ai/insights/followup, POST /api/running/v1/ai/insights/daily, GET /api/running/v1/ai/injury-coach/history. (G) Added section 22 Racing Weight: BMI-based optimal ranges per race category, progress bar + what-if UI spec, acceptance criteria. (H) Added GET /api/running/v1/calendar to section 8.7 (Analytics API). (I) Added POST /api/running/v1/auth/strava/re-enrich and POST /api/running/v1/auth/strava/re-enrich-metrics to section 5.9 (Re-enrich endpoints). (J) Added stravaGapHeal, raceReminderNotification, fridayPrepNotification to section 15 (Background Workers) with full cron schedule and step-by-step logic. (K) Fixed API path: DELETE /api/user/activities → DELETE /api/running/v1/user/activities in section 11.7.6._

_Previous: Version 3.0 — 2026-06-06 — GitHub Issue #160. Added section 10.11 Injury & Sports Medicine AI Coach: two new AI roles (Sports Physiotherapist `focus:physio` + Sports Medicine Physician `focus:sports_medicine`), new DB table `rt_symptom_logs` (auto-archive after 30 days inactivity), `InjuryCoachCard.jsx` component spec (placed between DailyInsightCard and FridayPrepCard on Dashboard), context form with body part / injury phase pills / question textarea, persistent disclaimer strip, client-side pain 10/10 block (no LLM call), `[ESCALATE]` token detection, ACWR > 1.4 + recent symptom trigger, `POST /api/running/v1/ai/injury-coach` endpoint spec, acceptance criteria, validations, error states, and 16 test IDs._

_Previous: Version 2.9 — 2026-06-02 — GitHub Issue #93. Added §5.8 Connection Health & Broken State: needs_reconnect flag lifecycle, Inngest exit behavior on flag=true, persistent amber banner spec (test IDs: stravaDisconnectBanner / stravaReconnectBtn), Settings reconnect path, and error state classification (401 permanent vs 5xx transient). Updated §5.2 Token Refresh failure branch: 401 → set needs_reconnect=TRUE + abort Inngest job (no retry) + log Sentry; 5xx/network → existing exponential backoff unchanged. Updated strava_credentials schema: added needs_reconnect BOOLEAN NOT NULL DEFAULT FALSE with migration ALTER TABLE statement. Updated GET /api/user/strava-status response shape to include needs_reconnect: boolean._

_Previous: Version 2.7 — 2026-05-30 — Section 10.4 Implementation Status: marked EF trend arrow (id="efTrendArrow"), VO2max 30-day rolling average on Analytics page (Vo2maxTrendChart.jsx), and Analytics page /running/analytics as DONE. Updated EF stat tile testid to reflect actual implementation (id="efficiencyFactor_activityDetailPage"). Post-delivery validation for v1.1 features completed — all 12 acceptance criteria pass._

_Previous: Version 2.6 — 2026-05-29 — Section 13 Race Log: added client-side filtering & search to 13.5 (debounced text search + distance filter chips All/5K/10K/21K/42K/Other; chips only rendered when matching data exists; filters stack); added acceptance criteria for search and filter chip behaviors to 13.7; added test IDs raceSearchInput, raceFilterChip_all, raceFilterChip_5k, raceFilterChip_10k, raceFilterChip_21k, raceFilterChip_42k, raceFilterChip_other to 13.9._

_Previous: Version 2.5 — Section 13 Race Log synced with actual implementation: (1) DB columns renamed position_overall/position_category → position_place/position_male throughout schema, API specs, validations table. (2) UI spec updated from card layout to table layout; table columns documented. (3) "Add from activity" flow (addRaceFromActivityBtn + ActivityPickerDialog + RaceConfirmDialog) documented. (4) Race Log detail page /running/race-log/[id] added as Section 13.5b with own test IDs. (5) GET /api/running/v1/race-log/:id endpoint added to Section 13.4. (6) Test IDs section split into list page / detail page; missing IDs (raceLogLoadingSkeleton, raceLogList, raceLogCard, raceLogDeleteBtn on list) flagged as known gaps for Tester._

---
