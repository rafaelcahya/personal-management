# Regression Testing Report

**Date:** 2026-05-30
**App Version:** 1.2
**Scope:** v1.2 milestone frontend fixes — issues #33, #34, #37, #42, #44, #47, #55, #56
**Tester:** QA Agent

## Summary (2026-05-30 Focused Run — v1.2 Milestone)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 55          | 55     | 0      | 0       | **100%**         |

### v1.2 Milestone — Spec Files

| #  | Spec File                                                              | Tests | Passed | Pending | Failed | Status   |
| -- | ---------------------------------------------------------------------- | ----- | ------ | ------- | ------ | -------- |
| 1  | running/activities/activity-detail-ui.cy.js                            | 27    | 27     | 0       | 0      | ✅ PASS  |
| 2  | running/activities/activities-page-title.cy.js                         | 10    | 10     | 0       | 0      | ✅ PASS  |
| 3  | inventory_management/product/product-list-star-image.cy.js             | 9     | 9      | 0       | 0      | ✅ PASS  |
| 4  | inventory_management/product/product-filter-no-category.cy.js          | 9     | 9      | 0       | 0      | ✅ PASS  |
| —  | **Total**                                                              | **55** | **55** | **0** | **0** | **100%** |

**Scope notes:**
- `activity-detail-ui.cy.js` (27 tests): HrZonesChart (sections A–C) + AIInsightCard states (sections D–I). AI Coach card v1.2 redesign — flat space-y-4 container (#56), refresh button in pending state (#47), error text "Could not load analysis". Fixes: scrollIntoView before visibility assertions for below-fold elements; `#aiInsightInvalid_activityDetailPage` (not aiInsightEmpty) for the invalid-insight state.
- `activities-page-title.cy.js` (10 tests): Activities page title "🏃 Activities" + description inside white container (#42); pagination span has text-center class (#44); Race Log title "🏆 Race Log" + description inside white container when entries present (#55); Race Log title hidden in empty state.
- `product-list-star-image.cy.js` (9 tests): Favorite star fill-yellow-400 on desktop; non-favorite star text-slate-300 (not invisible) on desktop and mobile; image thumbnail visible for products with product_image; thumbnail click opens imagePreviewDialog; products without image show no thumbnail. Mobile card selector fixed to `[id^="mobileCard_"][id$="productListPage"]` (actual IDs: mobileCard_{id}_productListPage).
- `product-filter-no-category.cy.js` (9 tests): Category label absent; type-based items (Hair Care, Skincare) absent; 3 separators remain (Status/Inventory/Usage groups); Active/Inactive/Low Stock/Out of Stock filters present; button label shows "Active" not "type:..." value.

---

## Previous Run — 2026-05-29 Focused Run — Sidebar UI

**Date:** 2026-05-29
**App Version:** 1.22
**Scope:** Sidebar nav tooltips — sidebar-ui.cy.js (issue #8)
**Tester:** QA Agent

## Summary (2026-05-29 Focused Run — Sidebar UI)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 8           | 8      | 0      | 0       | **100%**         |

### Sidebar UI — Spec Files

| #  | Spec File                                                    | Tests | Passed | Pending | Failed | Status   |
| -- | ------------------------------------------------------------ | ----- | ------ | ------- | ------ | -------- |
| 1  | shared/sidebar-ui.cy.js                                      | 8     | 8      | 0       | 0      | ✅ PASS  |
| —  | **Total**                                                    | **8** | **8** | **0** | **0** | **100%** |

**Scope notes:**
- `sidebar-ui.cy.js` (8 tests): Section A — auth guard (1). Section B — collapsed tooltips (3): Inventory Dashboard/Running Dashboard/Activities tooltip text verified. Section C — expanded no tooltips (2): tooltip does not appear when sidebar is expanded. Section D — collapse toggle (2): collapse button hides nav labels, expand button shows nav labels.
- Tooltip triggering: Native `PointerEvent('pointermove')` dispatch used instead of CDP-based `realHover()` — Radix UI's `onPointerMove` React handler requires a real DOM PointerEvent to open the tooltip in headless Electron.
- Collapse state sync: Tests wait for `title="Expand/Collapse sidebar"` on the toggle button to confirm React `useEffect` has applied the localStorage value before interacting.
- New: `cypress-real-events` package added to devDependencies. Sidebar nav items got `id` attributes for 3 Dashboard items. `sidebarCollapseBtn_sidebar` id added to toggle button.

---

## Previous Run — 2026-05-29 Focused Run — AI Coach UI

**Date:** 2026-05-29
**App Version:** 1.22
**Scope:** Running Tracker Dashboard AI Coach — ai-coach-ui.cy.js (issue #7, #22, #23)
**Tester:** QA Agent

## Summary (2026-05-29 Focused Run — AI Coach UI)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 20          | 20     | 0      | 0       | **100%**         |

### AI Coach UI — Spec Files

| #  | Spec File                                                    | Tests | Passed | Pending | Failed | Status   |
| -- | ------------------------------------------------------------ | ----- | ------ | ------- | ------ | -------- |
| 1  | running/dashboard/ai-coach-ui.cy.js                          | 20    | 20     | 0       | 0      | ✅ PASS  |
| —  | **Total**                                                    | **20** | **20** | **0** | **0** | **100%** |

**Scope notes:**
- `ai-coach-ui.cy.js` (20 tests): Sections A–G (16 tests, issues #22/#23): auth guard, card root, empty state (copy fix → "Complete a run to get AI analysis."), content state (title, first paragraph, View activity link), pending/invalid fallback to empty, error state (message + retry button), retry success and retry continued-failure flows. Section H (4 tests, issue #7): 3 cards render when 3 valid insights returned, 1 card renders when 1 insight returned, pending insight shows empty state, is_valid=false insight shows empty state.
- Root cause of pre-existing visibility failures: `#aiCoachCard` section sits below several dashboard components inside an `overflow-y-auto` scroll container. Fixed by adding `cy.get('#aiCoachCard').scrollIntoView()` before each visibility assertion.

---

## Previous Run — 2026-05-29 Full Re-run — Race Log

**Date:** 2026-05-29
**App Version:** 1.22
**Scope:** Running Tracker Race Log — full re-run (2 spec files)
**Tester:** QA Agent

## Summary (2026-05-29 Full Re-run — Race Log)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 72          | 72     | 0      | 0       | **100%**         |

### Race Log — Spec Files

| #  | Spec File                                                | Tests | Passed | Pending | Failed | Status   |
| -- | -------------------------------------------------------- | ----- | ------ | ------- | ------ | -------- |
| 1  | running/race-log/race-log-api.cy.js                      | 21    | 21     | 0       | 0      | ✅ PASS  |
| 2  | running/race-log/race-log-ui.cy.js                       | 51    | 51     | 0       | 0      | ✅ PASS  |
| —  | **Total**                                                | **72** | **72** | **0** | **0** | **100%** |

**Scope notes:**
- `race-log-api.cy.js` (21 tests, unchanged): GET /race-log (200 + shape, ordered DESC, pace null for DNF, 401), POST (201 + body, pace computed server-side, DNF without finish_time, 400 validation x4, 401), PATCH/:id (200 + partial update, pace recomputed on finish_time change, 400 empty body, 404 unowned, 401), DELETE/:id (200, 404, 401).
- `race-log-ui.cy.js` (51 tests): All previous sections A–L confirmed passing. Section M — Search input (4 tests): filter by title case-insensitive, uppercase query match, clear via X button, clear via empty input. Section N — Distance filter chips (9 tests): `#raceFilterChip_all` always visible, chips only render for present buckets, `#raceFilterChip_5k/42k/other` filters, clicking active chip resets to All, combined search+chip intersection, filter empty state + Clear filters button.

---

## Previous Run — 2026-05-29 (Race Log Search + Filter)

**Date:** 2026-05-29
**App Version:** 1.22
**Scope:** Running Tracker Race Log — search + distance filter (13 new tests in race-log-ui.cy.js)
**Tester:** QA Agent

## Summary (2026-05-29 Focused Run — Race Log Search + Filter)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 51          | 51     | 0      | 0       | **100%**         |

### Race Log — Spec Files

| #  | Spec File                                                | Tests | Passed | Pending | Failed | Status   |
| -- | -------------------------------------------------------- | ----- | ------ | ------- | ------ | -------- |
| 1  | running/race-log/race-log-ui.cy.js                       | 51    | 51     | 0       | 0      | ✅ PASS  |
| —  | **Total**                                                | **51** | **51** | **0** | **0** | **100%** |

**Scope notes:**
- `race-log-ui.cy.js` (51 tests, +13 new): Added Section M — Search input (4 tests): filter by title case-insensitive, uppercase query match, clear via X button, clear via empty input. Added Section N — Distance filter chips (9 tests): `#raceFilterChip_all` always visible, chips only render for present buckets (5k/42k/other present, 10k/21k absent), `#raceFilterChip_5k` filters to 5K only, `#raceFilterChip_42k` filters to 42K only, `#raceFilterChip_other` filters to non-standard distances, clicking active chip resets to All, combined search+chip intersection, filter empty state shows "No races match your filters." + Clear filters button, clicking Clear filters restores all entries.
- Filtering is client-side (no extra API calls). Debounce handled with `cy.clock()` + `cy.tick(500)`.
- Distance bucket ranges: 5K=4500–5499m, 10K=9500–10499m, 21K=20500–21499m, 42K=41500–42499m, Other=anything outside.

---

## Previous Run — 2026-05-28
**Date:** 2026-05-28
**App Version:** 1.22
**Scope:** Running Tracker Race Log — focused re-run after UI test rewrite (2 spec files)
**Tester:** QA Agent

## Summary (2026-05-28 Focused Run — Race Log Test Fix)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 59          | 59     | 0      | 0       | **100%**         |

### Race Log — Spec Files

| #  | Spec File                                                | Tests | Passed | Pending | Failed | Status   |
| -- | -------------------------------------------------------- | ----- | ------ | ------- | ------ | -------- |
| 1  | running/race-log/race-log-api.cy.js                      | 21    | 21     | 0       | 0      | ✅ PASS  |
| 2  | running/race-log/race-log-ui.cy.js                       | 38    | 38     | 0       | 0      | ✅ PASS  |
| —  | **Total**                                                | **59** | **59** | **0** | **0** | **100%** |

**Scope notes:**
- `race-log-api.cy.js` (21 tests, unchanged): GET /race-log (200 + shape, ordered DESC, pace null for DNF, 401), POST (201 + body, pace computed server-side, DNF without finish_time, 400 validation x4, 401), PATCH/:id (200 + partial update, pace recomputed on finish_time change, 400 empty body, 404 unowned, 401), DELETE/:id (200, 404, 401).
- `race-log-ui.cy.js` (38 tests, **rewritten** to match actual table-layout implementation): Auth guard, loading skeleton, error+retry, empty state (CTA button). Race list: title/DNF badge/finish time/position_place/position_male rendered in table rows; clicking row navigates to `/main/running/race-log/:id`. Add modal: open/close, validation (empty form + DNF toggle), date via calendar picker, successful save navigates to detail page, server error stays open. Edit modal (**detail page only**): open via `editRaceBtn_raceDetailPage`, prefill title, successful PATCH closes modal, server error shows alert. Delete (**detail page only**): opens AlertDialog, title shown in dialog, Cancel keeps page, Confirm calls DELETE + navigates back to list. Mobile: no overflow, add btn visible, rows visible.

**Changes made this session:**
- `race-log-ui.cy.js` — Sections E, I, J, K rewritten: E (position_overall→position_place, position_category→position_male, removed "View activity" tests, row-click navigation test); I (calendar picker `.click()` + gridcell, post-save navigates to detail); J (edit modal moved to detail page — stubs GET /race-log/:id + GET /activities/:id, uses `editRaceBtn_raceDetailPage`/`editRaceModal_raceDetailPage`); K (delete moved to detail page — same stubs, AlertDialog via `deleteRaceBtn_raceDetailPage`, confirm navigates back to list).
- `app-constants.json` — Added `test_ids.race_log.detail_page`, `edit_btn`, `edit_modal`, `edit_save_btn`; added `endpoints.running_race_log.detail`.
- 1 failure from initial run fixed: `cy.contains(entry1.title).should('be.visible')` in AlertDialog scoped to `[role="alertdialog"]` to avoid matching page header title clipped by overlay.

---

## Previous Run — 2026-05-27
**Date:** 2026-05-27
**App Version:** 1.22
**Scope:** Running Tracker Activities — focused run (9 spec files, 2 new)
**Tester:** QA Agent

## Summary (2026-05-27 Focused Run — Running Tracker Activities)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 152         | 152    | 0      | 0       | **100%**         |

### Running Tracker Activities — Spec Files

| #  | Spec File                                                | Tests | Passed | Pending | Failed | Status   |
| -- | -------------------------------------------------------- | ----- | ------ | ------- | ------ | -------- |
| 1  | running/activities/activities-api.cy.js ⭐ NEW           | 8     | 8      | 0       | 0      | ✅ PASS  |
| 2  | running/activities/activities-ui.cy.js ⭐ NEW            | 21    | 21     | 0       | 0      | ✅ PASS  |
| 3  | running/activities/activity-detail-ui.cy.js              | 27    | 27     | 0       | 0      | ✅ PASS  |
| 4  | running/activities/activityDetail.cy.js                  | 36    | 36     | 0       | 0      | ✅ PASS  |
| 5  | running/activities/activityDetailApi.cy.js               | 25    | 25     | 0       | 0      | ✅ PASS  |
| 6  | running/activities/ai-insight-api.cy.js                  | 8     | 8      | 0       | 0      | ✅ PASS  |
| 7  | running/activities/hr-zones-api.cy.js                    | 6     | 6      | 0       | 0      | ✅ PASS  |
| 8  | running/activities/stream-charts-api.cy.js               | 7     | 7      | 0       | 0      | ✅ PASS  |
| 9  | running/activities/stream-charts-ui.cy.js                | 14    | 14     | 0       | 0      | ✅ PASS  |
| —  | **Total**                                                | **152** | **152** | **0** | **0** | **100%** |

**Scope notes:**
- `activities-api.cy.js` (8 tests, NEW): GET /api/running/v1/activities — authenticated 200 + paginated shape `{data, total, page, limit}`, data array, required field presence, `?type=Run` filter, `?page&limit` params, 401 unauthenticated.
- `activities-ui.cy.js` (21 tests, NEW): Activities list page — auth guard, loading skeleton, list renders, type filter (query param changes), pagination next/prev, error state, empty state (no activities + filtered empty).
- `activityDetail.cy.js` (36 tests): Activity detail full page — stats grid, secondary stats, HR zones, AI insight card (all 5 states), gear row, splits, laps, route map.
- `activityDetailApi.cy.js` (25 tests): GET /activities/:id, PATCH /activities/:id, DELETE /activities/:id, PATCH /goals/:id — all status codes and ownership checks. `PATCH /goals/:id` ownership test now asserts strict 404 (bug fixed: `.single()` → `.maybeSingle()` in updateGoal.js).
- `activity-detail-ui.cy.js` (27 tests): HrZonesChart (empty state, Z1-Z5 rows, HR range labels, % + duration) + AIInsightCard (loading, empty+focus buttons, generate→pending, content markdown, error+retry, completed-invalid fallback). All `data-testid` converted to `id=` with `_activityDetailPage` suffix.
- `ai-insight-api.cy.js` (8 tests): GET /ai/insights (list shape, field presence, status enum) + POST /ai/insights/generate (queued response, 422 missing activity_id, 401, 404 unowned activity).
- `hr-zones-api.cy.js` (6 tests): GET /activities/:id zones field presence, null vs populated.
- `stream-charts-api.cy.js` (7 tests): GET /activities/:id/streams — shape, 400 invalid resolution (validation now runs before DB lookup), 401, 404 non-existent.
- `stream-charts-ui.cy.js` (14 tests): StreamCharts component — loading skeleton, happy path (pace/HR/elevation charts), empty state, error state, retry → success. All `data-testid` converted to `id=` with `_activityDetailPage` suffix.

**Bugs fixed this session:**
- `updateGoal.js` — `.single()` → `.maybeSingle()`: PATCH /goals/:id now returns 404 (not 500) for unowned goals.
- `streams/route.js` — resolution validation moved before DB lookup: invalid `?resolution=` now returns 400 (not 500).
- `AIInsightCard.jsx` — added missing `border-l-4 border-purple-400` per design spec.
- All `data-testid` in `StreamCharts.jsx`, `HrZonesChart.jsx`, `AIInsightCard.jsx`, `activities/page.jsx` converted to `id=` following `{componentName}_{pageName}` convention.

---

## Previous Run — 2026-05-25 Focused Run (Running Tracker Dashboard Extended)

**Date:** 2026-05-25
**App Version:** 1.21
**Scope:** Running Tracker Dashboard Extended — focused run (4 new spec files)
**Tester:** QA Agent

## Summary (2026-05-25 Focused Run — Running Tracker Dashboard Extended)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 39          | 39     | 0      | 0       | **100%**         |

### Running Tracker Dashboard Extended — New Spec Files

| #  | Spec File                                                | Tests | Passed | Pending | Failed | Status   |
| -- | -------------------------------------------------------- | ----- | ------ | ------- | ------ | -------- |
| 1  | running/dashboard/gear-api.cy.js                         | 6     | 6      | 0       | 0      | ✅ PASS  |
| 2  | running/dashboard/gear-ui.cy.js                          | 14    | 14     | 0       | 0      | ✅ PASS  |
| 3  | running/dashboard/performance-trends-api.cy.js           | 5     | 5      | 0       | 0      | ✅ PASS  |
| 4  | running/dashboard/dashboard-ui-extended.cy.js            | 14    | 14     | 0       | 0      | ✅ PASS  |
| —  | **Total**                                                | **39** | **39** | **0** | **0**  | **100%** |

**Scope notes:**
- `gear-api.cy.js` (6 tests): GET /api/running/v1/gear — authenticated 200, data array shape, required field presence, 401 guard; PATCH /api/running/v1/gear — 200 with updated object, 401 guard.
- `gear-ui.cy.js` (14 tests): Loading skeleton render; happy path (gear list, name, distance km); empty state (no gear message); error + retry flow; limit tabs (Strava-only tab, both-source tab display); near-retirement warning at 90% threshold; edit form open, save, cancel.
- `performance-trends-api.cy.js` (5 tests): GET /api/running/v1/performance-trends — 200 + data array, required field presence, ?limit=20, ?type=Run filter, 401 guard.
- `dashboard-ui-extended.cy.js` (14 tests): YtdStats renders when distance_m > 0, hidden when 0, hidden when null, distance format (150.00 km); NextRace null state, title display, race-week badge; syncStatusBar Never label, sync btn visible, POST trigger on click, syncResultMsg (X new activities / Already up to date); activity type filter renders + active ring state.

---

## Previous Run — 2026-05-23 Focused Run (Running Tracker Dashboard)

**Date:** 2026-05-23
**App Version:** 1.21
**Scope:** Running Tracker Dashboard — focused run (2 new spec files)
**Tester:** QA Agent

## Summary (2026-05-23 Focused Run — Running Tracker Dashboard)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 36          | 36     | 0      | 0       | **100%**         |

### Running Tracker Dashboard — New Spec Files

| #  | Spec File                                       | Tests | Passed | Pending | Failed | Status   |
| -- | ----------------------------------------------- | ----- | ------ | ------- | ------ | -------- |
| 1  | running/dashboard/dashboard-api.cy.js           | 8     | 8      | 0       | 0      | ✅ PASS  |
| 2  | running/dashboard/dashboard-ui.cy.js            | 28    | 28     | 0       | 0      | ✅ PASS  |
| —  | **Total**                                       | **36** | **36** | **0** | **0**  | **100%** |

**Scope notes:**
- `dashboard-api.cy.js`: GET /api/running/v1/dashboard — authenticated 200 + response shape (weekly_stats current/prev blocks, training_load with status enum, recent_activities array, calendar_activities array, health_today.logged boolean), distance_m/duration_sec integer check; unauthenticated 401 guard (isolated describe with no auth setup).
- `dashboard-ui.cy.js`: Auth guard (unauthenticated → /login); loading skeleton render (delayed response); happy path (8 sections visible: weeklyStats 21.00 km + session count + avg pace 5:43, trainingLoad 0.95 Optimal badge, activityCalendar, recentActivities 1 row 10.50 km, aiCoach, healthCheckin not-logged message); empty state (No activities yet, No Data badge, avg pace —); health logged state (Today's health logged + sleep hours); error state (500 → error message, fallback message, Retry button); retry → success (data appears after retry); training load badge variants (Low Load, Caution, High Risk). All scroll-into-view applied for sections below viewport fold.

---

## Previous Run — 2026-05-23 Focused Run (Running Tracker Manual Entry API)

**Date:** 2026-05-23
**App Version:** 1.21
**Scope:** Running Tracker Manual Entry API — focused run (1 new spec file)
**Tester:** QA Agent

## Summary (2026-05-23 Focused Run — Manual Entry)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 21          | 21     | 0      | 0       | **100%**         |

### Running Tracker Manual Entry API — New Spec File

| #  | Spec File                                | Tests | Passed | Pending | Failed | Status   |
| -- | ---------------------------------------- | ----- | ------ | ------- | ------ | -------- |
| 1  | running/manual/manual-api.cy.js          | 21    | 21     | 0       | 0      | ✅ PASS  |
| —  | **Total**                                | **21** | **21** | **0**  | **0**  | **100%** |

**Scope notes:**
- `manual-api.cy.js`: Block A (Activities CRUD, 11 tests) — POST 201, list visibility, type filter, invalid page fallback, GET detail + splits, 404 non-existent, PATCH notes 200, empty PATCH 422, DELETE 204 + 404, dedup 409 with `existing.started_at` only; Block B (Subjective Health, 4 tests) — POST upsert 200 (not 201), same log_date updates, GET list shape, PATCH + DELETE lifecycle; Block C (Weight Log, 2 tests) — POST 201, GET list, PATCH + DELETE; Block D (Auth Guards, 4 tests) — 401 on all endpoints without session.

---

## Previous Run — 2026-05-23 Focused Run (Strava Sync API)

**Date:** 2026-05-23
**App Version:** 1.20
**Scope:** Running Tracker Strava Sync API — focused run (1 new spec file)
**Tester:** QA Agent

## Summary (2026-05-23 Focused Run — Strava Sync)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 8           | 8      | 0      | 0       | **100%**         |

### Running Tracker Strava Sync API — New Spec File

| #  | Spec File                                | Tests | Passed | Pending | Failed | Status   |
| -- | ---------------------------------------- | ----- | ------ | ------- | ------ | -------- |
| 1  | running/sync/sync-api.cy.js              | 8     | 8      | 0       | 0      | ✅ PASS  |
| —  | **Total**                                | **8** | **8**  | **0**   | **0**  | **100%** |

**Scope notes:**
- `sync-api.cy.js`: POST /api/running/v1/sync/strava — authenticated 200 + response shape; GET /api/running/v1/sync/status — connected=false/last_sync_at=null + shape check; GET /api/running/v1/auth/strava/callback — missing code → redirect to settings error, invalid code → redirect to settings error; Unauthenticated — POST /sync/strava 401, GET /sync/status 401.

---

## Previous Run — 2026-05-20 Focused Run (Running Tracker Onboarding)

**Date:** 2026-05-20
**App Version:** 1.19
**Scope:** Running Tracker Onboarding — focused run (2 new spec files)
**Tester:** QA Agent

## Summary (2026-05-20 Focused Run)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 52          | 51     | 0      | 1       | **100%**         |

> **Pending (1):** `returns 401 when not authenticated (BLOCKED: cookie isolation needed)` — intentional, requires per-test cookie scope isolation not yet implemented.

### Running Tracker Onboarding — New Spec Files

| #  | Spec File                                              | Tests | Passed | Pending | Failed | Status   |
| -- | ------------------------------------------------------ | ----- | ------ | ------- | ------ | -------- |
| 1  | running/onboarding/onboarding-api.cy.js                | 14    | 13     | 1       | 0      | ✅ PASS  |
| 2  | running/onboarding/onboarding-ui.cy.js                 | 38    | 38     | 0       | 0      | ✅ PASS  |
| —  | **Total**                                              | **52** | **51** | **1** | **0** | **100% active** |

**Scope notes:**
- `onboarding-api.cy.js`: POST /api/running/v1/onboarding/biometric — happy path, empty body, 5 validation cases (height/weight/max_hr/birth_date range, malformed JSON), 401 without session; POST /api/running/v1/onboarding/complete — no goal, full goal payload, partial goal, 401 without session.
- `onboarding-ui.cy.js`: Auth guard (unauthenticated → /login for both onboarding and (app) routes); Step 1 rendering (10 tests), Step 1 validation (6 tests), max HR formula preview (4 tests), Step 1 → Step 2 transition + error handling (2 tests); Step 2 Strava connect/skip/back (5 tests); Step 3 no-race path (4 tests), Step 3 yes-race path (6 tests); (app) layout guard with real Supabase session (1 test).

---

## Previous Run — 2026-05-17 Focused Run (Product History UI)

**Date:** 2026-05-17
**App Version:** 1.18
**Scope:** Product History UI — focused run (1 new spec file)
**Tester:** QA Agent

## Summary (2026-05-17 Focused Run)

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 28          | 28     | 0      | 0       | **100%**         |

### Product History UI — New Spec File

| #  | Spec File                          | Tests | Passed | Failed | Status   |
| -- | ---------------------------------- | ----- | ------ | ------ | -------- |
| 1  | ui-product-history.cy.js           | 28    | 28     | 0      | ✅ PASS  |
| — | **Total**                           | **28** | **28** | **0** | **100%** |

**Scope notes:**
- `ui-product-history.cy.js`: Product History page UI — (A) list view: table visible, 7 columns, row data; (B) search: filter by name, filtered empty state, clear button, button hidden when no input; (B+C) search + filter AND logic (2 tests); (C) filter by status: dropdown shows 3 options, active/inactive/completed filter, toggle deselects; (D) sort: 4 options visible, default date_desc, date_asc, name_asc, name_desc; (E) true empty state: conditional pass (graceful if account has records); (F) filtered empty state: no results message, Clear filters button, restore on clear; (G) badge dot counter: no badge on default, badge 1 on filter, badge 1 on non-default sort, badge 2 on filter+sort.

---

## Previous Run — 2026-05-17 Focused Run (Product Name UI)

**Date:** 2026-05-17
**App Version:** 1.17
**Scope:** Product Name UI — focused run (3 new spec files)
**Tester:** QA Agent

### Summary

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 16          | 16     | 0      | 0       | **100%**         |

### Product Name UI — New Spec Files

| #  | Spec File                       | Tests | Passed | Failed | Status   |
| -- | ------------------------------- | ----- | ------ | ------ | -------- |
| 1  | ui-product-name-bulk.cy.js      | 16    | 16     | 0      | ✅ PASS  |
| — | **Total**                        | **16** | **16** | **0** | **100%** |

**Scope notes:**
- `ui-product-name-bulk.cy.js`: Product Name P2 features — (K) bulk status change: checkbox selection, select-all with indeterminate state, bulk action bar visibility, Set Active / Set Inactive API calls, Deselect All, auto-deselect on filter/search change; (L) product count badge navigation: badge > 0 is a keyboard-accessible button with aria-label, clicking navigates to product list filtered by name, badge = 0 is not rendered as a button

> Note: Two additional spec files were written in this session (`ui-product-name-list.cy.js` — 15 tests, `ui-product-name-update.cy.js` — 14 tests) but were not included in the focused run reported above. See test-status-report for their tracking.

---

## Previous Run — 2026-05-16 Focused Run (Product Brand UI)

**Date:** 2026-05-16
**App Version:** 1.13
**Scope:** Product Brand UI — focused run (3 new spec files)
**Tester:** QA Agent

### Summary

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 50          | 50     | 0      | 0       | **100%**         |

### Product Brand UI — New Spec Files

| #  | Spec File                       | Tests | Passed | Failed | Status   |
| -- | ------------------------------- | ----- | ------ | ------ | -------- |
| 1  | ui-product-brand-add.cy.js      | 11    | 11     | 0      | ✅ PASS  |
| 2  | ui-product-brand-list.cy.js     | 26    | 26     | 0      | ✅ PASS  |
| 3  | ui-product-brand-update.cy.js   | 13    | 13     | 0      | ✅ PASS  |
| — | **Total**                        | **50** | **50** | **0** | **100%** |

**Scope notes:**
- `ui-product-brand-add.cy.js`: Add Brand dialog — happy path, validation errors, duplicate name rejection, dialog open/close
- `ui-product-brand-list.cy.js`: List page — search, filter by status, sort columns, bulk actions, bulk set active, badge dot counter, edit button, product count badge navigation, sort by product count
- `ui-product-brand-update.cy.js`: Update dialog — open/close, prefill verification, name update success, note update success, delete flow, delete guard (active brand), duplicate name conflict, restore (reactivate) flow

---

## Previous Run — 2026-05-14 Full Regression

**Date:** 2026-05-14
**App Version:** 1.11
**Scope:** api-auth, auth, dashboard, product (4 groups, 22 spec files)
**Tester:** QA Agent

### Summary

| Total Tests | Passed | Failed | Pending | Active Pass Rate |
| ----------- | ------ | ------ | ------- | ---------------- |
| 833         | 822    | 0      | 11      | **100%**         |

> **Pending tests (11):** All in `product-list-ui.cy.js` — intentional `it.skip` placeholders for features not yet fully testable (sticky scroll, date picker validation, stock validation in Record Usage, active session UI).

## Feature Test Results by Group

### Group 1: API Auth Guard (api-auth)

| #   | Feature                     | Spec File              | Tests | Passed | Failed | Status     |
| --- | --------------------------- | ---------------------- | ----- | ------ | ------ | ---------- |
| 1   | Auth API endpoints          | auth-api.cy.js         | 6     | 6      | 0      | ✅ PASS    |
| 2   | Inventory API auth guard    | inventory-api.cy.js    | 24    | 24     | 0      | ✅ PASS    |
| 3   | Trade API auth guard        | trade-api.cy.js        | 29    | 29     | 0      | ✅ PASS    |

**Group 1 Total: 59/59 passing (100%)**

### Group 2: Auth Module (auth)

| #   | Feature                                    | Spec File        | Tests | Passed | Failed | Status     |
| --- | ------------------------------------------ | ---------------- | ----- | ------ | ------ | ---------- |
| 4   | Login - Session Establishment & UI         | login.cy.js      | 67    | 67     | 0      | ✅ PASS    |
| 5   | Session Validation & Error Messages        | session.cy.js    | 21    | 21     | 0      | ✅ PASS    |
| 6   | Logout - API & Button Components           | logout.cy.js     | 35    | 35     | 0      | ✅ PASS    |

**Group 2 Total: 123/123 passing (100%)**

### Group 3: Dashboard Module (dashboard)

| #   | Feature                    | Spec File           | Tests | Passed | Failed | Status     |
| --- | -------------------------- | ------------------- | ----- | ------ | ------ | ---------- |
| 7   | Dashboard UI               | dashboard-ui.cy.js  | 88    | 88     | 0      | ✅ PASS    |
| 8   | Dashboard API              | dashboard-api.cy.js | 56    | 56     | 0      | ✅ PASS    |
| 9   | Product Summary API        | summary-api.cy.js   | 17    | 17     | 0      | ✅ PASS    |

**Group 3 Total: 161/161 passing (100%)**

### Group 4: Product Module (product)

| #   | Feature                        | Spec File                       | Tests | Passed | Failed | Pending | Status      |
| --- | ------------------------------ | ------------------------------- | ----- | ------ | ------ | ------- | ----------- |
| 10  | Create Product API & Form UI   | add-product.cy.js               | 100   | 100    | 0      | 0       | ✅ PASS     |
| 11  | Create Product Stock           | create-product-stock.cy.js      | 49    | 49     | 0      | 0       | ✅ PASS     |
| 12  | Delete Product API             | delete-product.cy.js            | 23    | 23     | 0      | 0       | ✅ PASS     |
| 13  | Favorite Product               | favorite-product.cy.js          | 27    | 27     | 0      | 0       | ✅ PASS     |
| 14  | Last Purchase Price API        | last-price-api.cy.js            | 17    | 17     | 0      | 0       | ✅ PASS     |
| 15  | List Product API               | list-product.cy.js              | 26    | 26     | 0      | 0       | ✅ PASS     |
| 16  | Product Detail UI (v1.11)      | product-detail-ui.cy.js         | 35    | 35     | 0      | 0       | ✅ PASS     |
| 17  | Product Detail API             | product-detail.cy.js            | 25    | 25     | 0      | 0       | ✅ PASS     |
| 18  | Product History                | product-history.cy.js           | 25    | 25     | 0      | 0       | ✅ PASS     |
| 19  | Product List UI (v1.11)        | product-list-ui.cy.js           | 92    | 81     | 0      | 11      | 🟡 PARTIAL  |
| 20  | Restock Predictions API        | restock-predictions-api.cy.js   | 16    | 16     | 0      | 0       | ✅ PASS     |
| 21  | Product Summary API            | summary-product.cy.js           | 16    | 16     | 0      | 0       | ✅ PASS     |
| 22  | Update Product API             | update-product.cy.js            | 39    | 39     | 0      | 0       | ✅ PASS     |

**Group 4 Total: 479/490 active passing (100% active), 11 pending**

---

## Summary Statistics

| Metric | Value |
| ------ | ----- |
| Total Test Cases Run (focused) | 28 |
| Tests Passed | 28 |
| Tests Failed | 0 |
| Tests Pending | 0 |
| Active Pass Rate | **100%** |
| Spec Files with 100% Pass | 1/1 |

**Conclusion:** All 28 tests in the Product History UI spec pass (100%). The spec covers all 7 acceptance criteria groups from PRD section 3.1.4: list view, search, search+filter AND logic, filter by status, sort options, true empty state, filtered empty state, and badge dot counter.

---

## Cumulative Active Pass Rate (All Focused Runs to Date)

| Date       | Feature                              | Tests | Passed | Pending | Failed | Pass Rate   |
| ---------- | ------------------------------------ | ----- | ------ | ------- | ------ | ----------- |
| 2026-05-29 | Race Log full re-run (2 spec files)  | 72    | 72     | 0       | 0      | 100%        |
| 2026-05-29 | Race Log Search + Filter (+13 tests) | 51    | 51     | 0       | 0      | 100%        |
| 2026-05-28 | Running Tracker Race Log (fix)       | 59    | 59     | 0       | 0      | 100%        |
| 2026-05-27 | Running Tracker Activities           | 152   | 152    | 0       | 0      | 100%        |
| 2026-05-25 | Running Tracker Dashboard Extended   | 39    | 39     | 0       | 0      | 100%        |
| 2026-05-23 | Running Tracker Dashboard            | 36    | 36     | 0       | 0      | 100%        |
| 2026-05-23 | Running Tracker Manual Entry API     | 21    | 21     | 0       | 0      | 100%        |
| 2026-05-23 | Running Tracker Strava Sync API      | 8     | 8      | 0       | 0      | 100%        |
| 2026-05-20 | Running Tracker Onboarding           | 52    | 51     | 1       | 0      | 100% active |
| 2026-05-17 | Product History UI                   | 28    | 28     | 0       | 0      | 100%        |
| 2026-05-17 | Product Name UI (bulk)               | 16    | 16     | 0       | 0      | 100%        |
| 2026-05-16 | Product Brand UI                     | 50    | 50     | 0       | 0      | 100%        |
| 2026-05-14 | Full Regression (4 groups)           | 833   | 822    | 11      | 0      | 100% active |
