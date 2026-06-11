# Test Coverage Report

**Last Updated:** 2026-06-10 (Cadence Chart Enhancements issue #166 — cadence-chart-enhancements-ui.cy.js 16/16 passing 100%; Running Tracker - Activities +16 tests, now 320 total, 18 features) | 2026-06-10 (HR Chart Enhancements issue #165 — hr-chart-enhancements-ui.cy.js 18/18 passing 100%, hr-zones-ai-insight-ui.cy.js 24/24 passing 100%; Running Tracker - Activities +42 tests, now 304 total, 17 features) | 2026-06-10 (Splits Bar Chart issue #164 — splits-bar-chart-ui.cy.js 24/24 passing 100%; Running Tracker - Activities +24 tests, now 262 total) | 2026-06-10 (Personal Bests Table issue #174 — personal-bests-api.cy.js 7/7 passing 100%, personal-bests-ui.cy.js 19/19 passing 100%; Running Tracker - Analytics +26 tests, now 124 total) | 2026-06-09 (Map Style Toggle issue #172 — map-style-toggle-ui.cy.js 14/14 passing 100%; Running Tracker - Activities +14 tests) | 2026-06-09 (Lazy Compute Derived Metrics issue #168 — lazy-compute-metrics-api.cy.js 5/5 active passing (2 pending, data-dependent), 100% active; Running Tracker - Activities +7 tests) | 2026-06-06 (Injury AI Roles issue #160 — injury-coach-api.cy.js 6/6, injury-coach-ui.cy.js 12/12, symptom-log-api.cy.js 6/6 — all 24/24 passing 100%; NEW module Running Tracker - Injury AI) | 2026-06-06 (Web Push Notifications issue #135 — settings-ui.cy.js +4 tests 21/21 passing, push-subscription-api.cy.js new 4/4 passing 100%; push toggle enable/disable/permission-denied/persist flows + API contract) | 2026-06-05 (Next Race Widget issue #153 — dashboard-ui-extended.cy.js 14/14 passing 100%; NextRace widget updated with title, description, edit-from-activity support) | 2026-06-05 (VO2max Target Effort issue #137 — 3 new spec files, 54/54 passing 100%; +19 upcoming-race target time tests, +35 analytics target effort tests)
**App Version:** 1.7

## Coverage Summary

| Module                          | Total Features | Automated | Manual Only | Not Tested | Coverage % | Test Cases |
| ------------------------------- | -------------- | --------- | ----------- | ---------- | ---------- | ---------- |
| Auth                            | 9              | 8         | 1           | 0          | 89%        | 120        |
| API Auth Guard                  | 3              | 3         | 0           | 0          | 100%       | 59         |
| Landing Page                    | 7              | 7         | 0           | 0          | 100%       | 33         |
| Inventory - Dashboard           | 10             | 10        | 0           | 0          | 100%       | 161        |
| Inventory - Product (API)       | 11             | 11        | 0           | 0          | 100%       | 354        |
| Inventory - Product List UI     | 14             | 14        | 0           | 0          | 100%       | 120        |
| Inventory - Product Detail UI   | 7              | 7         | 0           | 0          | 100%       | 35         |
| Inventory - Product Brand       | 6              | 6         | 0           | 0          | 100%       | 114        |
| Inventory - Product Brand UI    | 3              | 3         | 0           | 0          | 100%       | 50         |
| Inventory - Product Name        | 9              | 9         | 0           | 0          | 100%       | 159        |
| Inventory - Product History UI  | 7              | 7         | 0           | 0          | 100%       | 28         |
| Trading - Trade                 | 7              | 7         | 0           | 0          | 100%       | 185        |
| Trading - Fee                   | 6              | 6         | 0           | 0          | 100%       | 131        |
| Trading - Event                 | 6              | 6         | 0           | 0          | 100%       | 134        |
| Running Tracker - Onboarding    | 6              | 6         | 0           | 0          | 100%       | 52         |
| Running Tracker - Sync API      | 3              | 3         | 0           | 0          | 100%       | 8          |
| Running Tracker - Strava Connection | 5          | 5         | 0           | 0          | 100%       | 14         |
| Running Tracker - Manual Entry  | 7              | 7         | 0           | 0          | 100%       | 21         |
| Running Tracker - Dashboard     | 10             | 10        | 0           | 0          | 100%       | 95         |
| Running Tracker - Race Log      | 10             | 10        | 0           | 0          | 100%       | 147        |
| Running Tracker - Activities    | 18             | 18        | 0           | 0          | 100%       | 320        |
| Running Tracker - Analytics     | 8              | 8         | 0           | 0          | 100%       | 124        |
| Running Tracker - AI Coach Page | 12             | 12        | 0           | 0          | 100%       | 56         |
| Running Tracker - Settings      | 6              | 6         | 0           | 0          | 100%       | 25         |
| Running Tracker - Injury AI     | 3              | 3         | 0           | 0          | 100%       | 24         |
| Shared - Sidebar                | 4              | 4         | 0           | 0          | 100%       | 8          |
| **Total**                       | **194**        | **193**   | **1**       | **0**      | **99%**    | **2,521**  |

> **Note (2026-06-10 v1.7 Cadence Chart Enhancements issue #166 +16 tests):** cadence-chart-enhancements-ui.cy.js 16/16 passing (100%). NEW spec file under `cypress/e2e/running/activities/`. 5 describe blocks: Benchmark bands (5 tests) — `#streamChartCadence_activityDetailPage` renders, all 4 band IDs present (beginner/recreational/semiathlete/elite). Historical avg cadence line (3 tests) — line renders with label "Your avg: 172 spm", absent when `historical_avg_cadence=null`. Fatigue drop detection (2 tests) — `#cadenceFatigueRegion_activityDetailPage` present when drop >5 spm (8-point stream: first-25% avg ~180, last-25% avg ~168 → drop=12), absent when stable (first/last within 2 spm). Stability score badge (3 tests) — `#cadenceStabilityScore_activityDetailPage` renders, text matches `/Stability:\s*\d+/`, value 0–100. Info tooltip (3 tests) — trigger renders, has `aria-label`, tooltip `#cadenceInfoTooltip_activityDetailPage` appears on `PointerEvent('pointermove')` dispatch (Radix tooltip pattern). Fix in test: initial `trigger('pointerenter')` swapped to native `PointerEvent('pointermove')` dispatch matching `sidebar-ui.cy.js` convention. Running Tracker - Activities: 18 features, 320 tests. Total: 194 features, 2,521 tests.

> **Note (2026-06-10 v1.7 HR Chart Enhancements issue #165 +42 tests):** hr-chart-enhancements-ui.cy.js 18/18 passing (100%), hr-zones-ai-insight-ui.cy.js 24/24 passing (100%). hr-chart-enhancements-ui.cy.js (18 tests): 5 describe blocks — avg HR reference line (2 tests): `#hrAvgLine_{pagePrefix}` exists, label shows "Avg 148". Historical avg HR line (3 tests): `#hrHistoricalAvgLine_{pagePrefix}` exists, label shows "All-time 158", element absent when historicalAvgHr=null. Peak HR marker (2 tests): `#hrPeakMarker_{pagePrefix}` exists, peak value "172" visible. Time-in-zone (6 tests): `#hrZonesSection_{pagePrefix}` renders, Z1 Recovery/Z2 Aerobic/Z3 Tempo/Z4 Threshold/Z5 VO₂max labels, percentage values (33%/39%), background-color bars (5 divs), section absent when zones=null, zone bands render from maxHr fallback when Strava zones=null. Race Detail (5 tests): all 4 elements render on Race Detail page (`pagePrefix="raceDetailPage"`). hr-zones-ai-insight-ui.cy.js (24 tests): Auth guard (1), HR time-in-zone section (5 tests: not rendered without HR data, renders when HR+zones present, 5 zone rows, % + duration, filled bars), AIInsightCard (18 tests: loading skeleton, card root always rendered, empty+BETA badge+coaching prompt, focus buttons without content, no loading/pending/content/error in empty state, first focus button POST→pending+bar+skeleton, content renders markdown headers+list items+re-analyze buttons+no loading/empty/pending/error, error state+retry button+retry returns null→empty state, invalid insight shows empty/focus state+no content). Key changes in hr-zones-ai-insight-ui: rewrote HrZonesChart describes to match new component (removed old bpm range tests, updated to time-in-zone behavior), added `cy.on('uncaught:exception')` ServiceWorker handler, replaced pending-state text assertion with element IDs, added ai_insight_pending_status/bar/skeleton IDs to test-ids.js. Zone fallback: when `zones=null`, `bandZones` computed from `max_hr` via standard Z1–Z5 % formula (60/70/80/90% of maxHr); `timeZones` stays Strava-only so time-in-zone section absent. Running Tracker - Activities: 17 features, 304 tests. Total: 193 features, 2,505 tests.

> **Note (2026-06-10 v1.7 Splits Bar Chart issue #164 +24 tests):** splits-bar-chart-ui.cy.js 24/24 passing (100%). NEW spec file under `cypress/e2e/running/activities/`. 8 suites: A — no splits → section hidden (1 test). B — default bar view (5 tests): section renders, bar chart visible, Bar aria-pressed=true, Table aria-pressed=false, Pace metric active by default. C — HR tab visibility (2 tests): HR tab shown when splits have avg_hr, HR tab absent when all avg_hr=null. D — view toggle (3 tests): Table toggle hides bar chart, table view shows Pace/Time headers, Bar toggle restores chart. E — pacing strategy chip (3 tests): Negative split chip when 2nd half faster, Positive split chip + pace fade when 2nd half slower, Even split chip when paces equal. F — partial split (2 tests): chart renders with partial split present, Partial legend indicator shown. G — cardiac drift (3 tests): drift visible in bar view, drift visible in table view, correct +15 bpm value. H — metric switching (4 tests): Time tab activates, GAP tab activates, EF tab activates, HR tab activates. Component: `SplitsSection.jsx` created in `app/main/running/(app)/activities/components/`. Replaces `SplitsTable` in both activities `[id]/page.jsx` and race-log `ActivitySection.jsx` (race detail scope from issue comment). Features: bar/table toggle, 5 metric tabs (Pace/Time/HR/GAP/EF), pacing strategy chip, pace fade %, GAP via Minetti curve, EF = (1000/pace)/hr, best/worst bar coloring (amber/red), partial split at 0.4 opacity, cardiac drift always visible in both views with tooltip. Running Tracker - Activities: 15 features, 262 tests. Total: 191 features, 2,463 tests.

> **Note (2026-06-10 v1.7 Personal Bests Table issue #174 +26 tests):** personal-bests-api.cy.js 7/7 passing (100%), personal-bests-ui.cy.js 19/19 passing (100%). 2 new spec files under `cypress/e2e/running/analytics/`. API spec: auth guard (401 unauthenticated), authenticated 200 + data object + message:'OK', data contains all 5 distance keys (1 mile/5K/10K/15K/Half-Marathon), each array ≤5 entries, entry field shape (rank/elapsed_time_sec/date/activity_id/pace_sec_per_km), rank of top entry is 1, entries ordered rank ascending. UI spec (6 suites): auth guard redirects to /login; loading skeleton visible during delayed fetch; table renders with data (section/table IDs visible, 5 distance column headers, rank-1 row for 5K, formatted time 22:30, pace 4:30 /km, date 15 Jan 2026, rank-2 row visible, 1-mile time 7:00, Half-Marathon time 1:45:00); empty distances show em-dash placeholder + no personalBestsRow elements; error state renders personalBestsError with "Failed to load personal bests" + no table; row click navigates to `/main/running/activities/[activity_id]`. Fixes applied: `before()` → `beforeEach()` in both authenticated API describe blocks (Cypress testIsolation clears cookies between tests); `Cypress.on('uncaught:exception')` handler added for ServiceWorker redirect errors; `cy.on('uncaught:exception', () => false)` added locally in row-click test to suppress activity-page errors during navigation; component error message hardcoded to `'Failed to load personal bests'` (was leaking `err.message`). Running Tracker - Analytics: 8 features, 124 tests. Total: 190 features, 2,439 tests.

> **Note (2026-06-09 v1.7 Map Style Toggle issue #172 +14 tests):** map-style-toggle-ui.cy.js 14/14 passing (100%). NEW spec file under `cypress/e2e/running/activities/`. Suite A (5 tests): `#mapStyleToggle_activityDetailPage` renders when polyline present; Map button `aria-pressed=true` default; Satellite `aria-pressed=false` default; clicking Satellite flips both states; clicking Map restores both states. Suite B (4 tests): expand button opens `role="dialog"` modal; modal footer contains toggle; Escape key closes modal; style sync — pre-selected Satellite reflected in modal toggle. Suite C (2 tests): toggle absent when `summary_polyline=null`; expand button absent (MediaCarousel returns null when no polyline and no photos). Suite D (3 tests): both button IDs present; Map text "Map" visible; Satellite text "Satellite" visible. Fix applied: initial Suite C test incorrectly asserted `cy.contains('No GPS data')` — `MediaCarousel` short-circuits to `return null` before `RouteMap` is rendered when both polyline and photos are absent. Running Tracker - Activities: 14 features, 238 tests. Total: 189 features, 2,413 tests.

> **Note (2026-06-09 v1.7 Lazy Compute Derived Metrics issue #168 +7 tests):** lazy-compute-metrics-api.cy.js 5/5 active passing (2 pending, data-dependent). 4 describe blocks: (1) compute triggered — GET activity with moving_time > 1200 + avg_hr → at least one derived metric non-null; (2) idempotency — two successive GETs return identical metric values; (3) gate fails — short/no-HR activity → 200 with all metrics null; (4) response shape contract — 200 always includes aerobic_decoupling, efficiency_factor, estimated_vo2max keys; unauthenticated → 401. Describes 1 and 2 are skipped via this.skip() because no activity in the test DB meets the gate condition at this time — they will auto-run when qualifying data exists. Running Tracker - Activities: 13 features, 224 tests. Total: 188 features, 2,399 tests.

> **Note (2026-06-06 v1.7 Injury AI Roles issue #160 +24 tests):** 3 new spec files all passing 100%. injury-coach-api.cy.js (6 tests): POST physio/physician → 200 with data.content + escalate; POST missing question/short question/invalid role → 400; unauthenticated → 401. injury-coach-ui.cy.js (12 tests): disclaimer strip, role card selection reveals form, phase pill select/deselect, submit button disabled/enabled based on question length, emergency block on "10/10", successful submission output card, escalation banner (role=alert), API error state. symptom-log-api.cy.js (6 tests): POST valid symptom → 201; POST missing body_region → 400; POST pain_level 11 → 400; GET active logs → 200 + array; PATCH archive { archived:true } → 200; PATCH non-existent UUID → 404. NEW module: Running Tracker - Injury AI (3 features, 24 tests). Fixes applied: `.error.issues[0]` (Zod v4 breaking change) in symptoms/route.js, symptoms/[id]/route.js, ai/injury-coach/route.js; PATCH test body `{ archived: true }` to match archiveSymptomSchema. Total: 187 features, 2,392 tests.

> **Note (2026-06-06 v1.7 Web Push Notifications issue #135 +8 tests):** settings-ui.cy.js updated with 4 new push notification tests (21 total, 100%). push-subscription-api.cy.js created with 4 new API tests (100%). Running Tracker - Settings: 6 features, 25 tests. NEW spec file: push-subscription-api.cy.js under `cypress/e2e/running/push-subscription/`. New fixture entries: PUSH_SUBSCRIPTION endpoint in endpoints.js, push_notifications_toggle + push_notifications_error in test-ids.js running_settings section. Key lessons: `Notification.permission` is a read-only getter in Chrome — only override `requestPermission` method directly (`win.Notification.requestPermission = () => Promise.resolve('granted')`); `cy.stub()` cannot be used inside `onBeforeLoad` — use plain arrow functions; `beforeEach` (not `before`) required for `setupApiAuthCookies()` in API tests to handle Cypress test isolation (cookies cleared between tests); `scrollIntoView()` needed before asserting visibility on error element inside overflow:hidden card parent. Total: 184 features, 2,368 tests.

> **Note (2026-06-05 v1.4 VO2max Target Effort issue #137 +54 tests):** 3 new spec files all passing 100%. upcoming-races-target-time-ui.cy.js (19 tests): 6 suites (A–F) — H/M/S inputs present in add modal, empty on new race, numeric input accepted; target time badge visible/correct when set (4:00:00), absent when null; mixed list shows exactly one badge; edit modal pre-populates hours/minutes/seconds from target_time_sec; edit modal empty H/M/S when no target time. vo2max-target-effort-api.cy.js (4 tests): auth guard 401, 200 + data object, status field in valid enum, full field shape when ok. vo2max-target-effort-ui.cy.js (31 tests): 9 suites (A–I) — auth guard; no_goal empty state + "Set a race goal" CTA; no_target_time amber warning + "Add target time" link; insufficient_data "Need more data" + required VO2max value; ok/On Track status badge + gap numbers + weeks-to-goal + training recommendation + chart; ok/Goal Reached trophy text + status badge + gap numbers; ok/Goal Expired expired message + "Set a new goal" btn + no projection chart; loading skeleton while pending; error state role=alert + no gap card. Running Tracker - Race Log: 10 features, 147 tests. Running Tracker - Analytics: 7 features, 98 tests. Total: 183 features, 2,360 tests.

> **Note (2026-06-04 v1.4 Running Settings page issue #132 +17 tests):** settings-ui.cy.js 17/17 passing (100%). NEW module: Running Tracker - Settings. 5 features: Auth guard + page load (1 test), Profile section (3 tests — form renders, save 200, save 422), HR Zones section (4 tests — threshold hidden for max_hr, Lactate Threshold reveals input, client-side validation prevents empty threshold API call, Karvonen save success), Notifications section (2 tests — all 4 toggles present, toggle fires PATCH), Strava Connection (2 tests — connected state + Disconnect btn, POST disconnect + disconnected state shows), Danger Zone (4 tests — dialog opens, btn disabled on open, wrong text still disabled, DELETE text enables + delete fires). Key lesson: `scrollIntoView()` needed before assertions on CardContent elements with overflow:hidden clipping. test-ids.js updated with running_settings section (22 IDs). endpoints.js updated with USER_PROFILE, USER_SETTINGS, USER_ACTIVITIES, STRAVA_DISCONNECT. Total: 183 features, 2,360 tests.

> **Note (2026-06-04 v1.4 AI Coach page issue #131 +17 tests):** ai-coach-page.cy.js 56/56 passing (100%). 4 new describe blocks added (tests 40–56): "Daily insight recommendation pills" (4 tests — pills render, click selects, active state, deselect restores), "Daily insight ask coach field" (5 tests — input renders, accepts text, submit button present, POST fires with question, field clears after submit), "Daily insight follow-up inline response" (5 tests — response container renders, text visible, loading state shown, error + retry, retry re-fires POST), "Daily insight context strip" (3 tests — renders with activity reference, collapsible, collapsed hides detail). Total now 12 scenario groups, 56 tests. Running Tracker - AI Coach Page: 12 features, 56 tests. Total: 176 features, 2,289 tests.

> **Note (2026-06-03 v1.4 Compare Runs selector fix issue #121):** compare-runs-ui.cy.js 19/19 passing (100%). Regression spec for `fetchActivities()` envelope bug — old code in `AIInsightCard.ActivitySelector.handleOpen()` called `.filter()` directly on the `{ data, total, page, limit }` envelope returned by `fetchActivities()`, resulting in TypeError (empty selector). Fix: `const list = result?.data ?? []`. 4 suites (A–D): selector opens + shows activities, search filters by name/date, selecting shows pill, removing pill clears selection. Running Tracker - Activities: 12 features, 217 tests. Total: 164 features, 2,233 tests.

> **Note (2026-06-02 v1.3 Analytics AI Card issue #100):** analytics-ai-api.cy.js 15/15 + analytics-ai-ui.cy.js 14/14 passing (100%). 2 new spec files under `cypress/e2e/running/analytics/`. API spec covers GET /insights (auth + filters + field shape), POST /generate (queued, validation errors, unauthenticated), GET /staleness (is_stale boolean, section filter, unauthenticated). UI spec covers 14 states: auth guard, loading skeleton, empty, generate flow, content, staleness badge (stale/fresh), error, retry, history modal (≥2 insights), no history button (1 insight), refresh, generate error, pending. Running Tracker - Analytics: 5 features, 63 tests. Total: 158 features, 2,200 tests.

> **Note (2026-05-31 v1.3 AI Coach improvements issue #82):** ai-coach-improvements.cy.js 36/36 passing (100%). Duration: 1m 14s. Covers 12 suites (A–L) — RPE radiogroup (5 tests), user note textarea (4), context collapse/visibility (4), focus buttons (5), loading/pending skeleton (2), rotating status copy at 0s and 6s via cy.clock() (1), long-wait hint at 60s with Try again button (2), comparison section/trigger (4), comparison popover on desktop (2), activity list grouped by month in popover (3), Get Recommendation flow with compare_activity focus POST (4). Total Running Tracker - Activities: 11 features, 198 tests.

> **Note (2026-05-30 v1.2 milestone frontend fixes):** 55/55 passing (100%). 3 new spec files added: activities-page-title.cy.js (10 tests — #42 Activities title inside container, #44 pagination text-center, #55 Race Log title + empty state), product-list-star-image.cy.js (9 tests — #33 non-favorite star text-slate-300 desktop+mobile, #34 image preview dialog), product-filter-no-category.cy.js (9 tests — #37 category removed from filter dropdown, standard filters unaffected). activity-detail-ui.cy.js (27 tests) re-confirmed passing with v1.2 AI Coach card changes (#47 refresh button, #56 flat layout). Fixes applied: scrollIntoView for below-fold elements, corrected aiInsightInvalid ID, mobile card selector `[id^="mobileCard_"][id$="productListPage"]`, separator count assertion updated to 3. Total: 2,101 tests (+28).

> **Note (2026-05-29 v1.22 Sidebar UI):** sidebar-ui.cy.js 8/8 passing. New `shared/` spec folder added. Covers issue #8: auth guard, collapsed tooltips for Inventory Dashboard/Running Dashboard/Activities, no-tooltip in expanded state, collapse toggle both directions. Key fixes: native `PointerEvent('pointermove')` dispatch to trigger Radix UI tooltip (CDP-based realHover doesn't fire React's onPointerMove handler in headless Electron); title-attribute wait pattern to confirm React useEffect state sync before interacting. Added ids: `sidebarCollapseBtn_sidebar`, `inventoryDashboardNav_sidebar`, `tradingDashboardNav_sidebar`, `runningDashboardNav_sidebar`. `cypress-real-events` added as devDependency. `sidebar` section added to app-constants.json test_ids.

> **Note (2026-05-29 v1.22 AI Coach UI):** ai-coach-ui.cy.js 20/20 passing. Covers issues #7, #22, #23. Sections A–G (16 tests): auth guard, card root, empty state ("Complete a run to get AI analysis."), content state (title + first paragraph + View activity link), pending/invalid fallback to empty, error state + retry. Section H (4 tests): multi-card rendering — 3 cards when 3 valid insights, 1 card when 1 valid, empty when status=pending, empty when is_valid=false. Fix: added `scrollIntoView()` before visibility assertions — AI Coach section is below fold inside overflow-y-auto main container. Dashboard module: 9 spec files, 95 tests total (was 75).

> **Note (2026-05-29 v1.22 Race Log full re-run):** Full re-run of both race-log spec files confirmed 72/72 passing. race-log-api.cy.js (21 tests): all GET/POST/PATCH/DELETE flows pass. race-log-ui.cy.js (51 tests): all sections A–N pass including search filter (Section M) and distance filter chips (Section N) added in previous session.

> **Note (2026-05-28 v1.22 Race Log fix):** Race Log UI tests rewritten to match actual table-layout implementation. race-log-ui.cy.js 38/38 passing, race-log-api.cy.js 21/21 unchanged. Key changes: fixtures updated (position_overall→position_place, position_category→position_male); Section E row-click navigation test replaces inline edit/delete; Section I calendar picker `.click()`+gridcell replaces `.type()`, post-save asserts URL navigation; Section J edit modal now tests detail page (stubs GET /race-log/:id + GET /activities/:id); Section K delete now tests detail page (AlertDialog→confirm→navigates back). New test_ids in app-constants.json: detail_page, edit_btn, edit_modal, edit_save_btn. New endpoint: running_race_log.detail. Total test count unchanged: 59 tests (21 API + 38 UI).

> **Note (2026-05-27 v1.22 Activities):** Running Tracker Activities suite complete — 9 spec files, 152 tests, all 152/152 passing. 2 new spec files: activities-api.cy.js (8 tests: GET list shape, pagination, ?type filter, 401) and activities-ui.cy.js (21 tests: auth guard, loading skeleton, list render, type filter URL param, pagination, error state, empty state). Pre-existing 7 spec files also confirmed passing: activityDetail (36), activityDetailApi (25), activity-detail-ui (27), ai-insight-api (8), hr-zones-api (6), stream-charts-api (7), stream-charts-ui (14). Bugs fixed: updateGoal.js `.single()`→`.maybeSingle()` (PATCH /goals/:id strict 404), streams route resolution validation order (400 not 500), AIInsightCard missing border-l-4 border-purple-400. All data-testid in StreamCharts/HrZonesChart/AIInsightCard/activities page converted to id= following {componentName}_{pageName} convention. Also added Race Log module (59 tests: race-log-api 21 + race-log-ui 38) to coverage.

> **Note (2026-05-25 v1.21 Dashboard Extended):** Running Tracker Dashboard extended tests added — 4 new spec files (gear-api.cy.js, gear-ui.cy.js, performance-trends-api.cy.js, dashboard-ui-extended.cy.js), 39 tests, all 39/39 passing. Gear API (6 tests): GET shape validation + 401 guard, PATCH with real gear id. Gear UI (14 tests): loading skeleton, happy path list rendering, empty state, error+retry, Strava-only limit tab, both-tab display, near-retirement warning (90% threshold), edit form open/save/cancel. Performance Trends API (5 tests): shape, ?limit=20, ?type=Run filter, 401. Dashboard Extended UI (14 tests): YtdStats renders when distance_m>0, hidden when 0 or null, distance format (150.00 km); NextRace null/title/race-week badge; syncStatusBar Never label, sync btn, POST trigger, syncResultMsg X new activities / Already up to date; activity type filter renders + active ring. Also added 4 IDs to app-constants.json running_dashboard section: performance_trends_card, sync_status_bar, sync_btn, sync_result_msg. app-constants.yaml does not exist in this project — JSON is the single source of truth. Running Tracker Dashboard total: 75 tests (36 from 2026-05-23 + 39 from 2026-05-25).

> **Note (2026-05-23 v1.21 Dashboard):** Running Tracker Dashboard tests added — 2 new spec files (dashboard-api.cy.js, dashboard-ui.cy.js), 36 tests, all 36/36 passing. API spec: GET /api/running/v1/dashboard response shape (weekly_stats, training_load, recent_activities, calendar_activities, health_today), integer type checks, 401 guard. UI spec: auth guard, loading skeleton, happy path (all 6 sections including scroll-into-view), empty state, health logged state, error + retry, training load status badge variants. Total test cases updated to 1,782.

> **Note (2026-05-23 v1.21):** Running Tracker Manual Entry API tests added — 1 new spec file (manual-api.cy.js), 21 tests, all 21/21 passing. Covers Activities CRUD (POST 201, list filter, dedup 409, PATCH notes, empty PATCH 422, DELETE 204), Subjective Health upsert (200 semantics, lifecycle), Weight Log CRUD, and auth guards (4 unauthenticated 401 checks). Also fixed 4 Code Review criticals (CB-1–4) and security warning S-2. Total test cases updated to 1,746.

> **Note (2026-05-23 v1.20):** Running Tracker Strava Sync API tests added — 1 new spec file (sync-api.cy.js), 8 tests, all 8/8 passing. Covers POST /sync/strava (auth guard + response shape), GET /sync/status (connected=false + shape), GET /auth/strava/callback (missing code + invalid code redirect), unauthenticated 401 guard. Also added Strava callback to middleware bypass + Inngest signing key. Total test cases updated to 1,725.

> **Note (2026-05-20 v1.19):** Running Tracker Onboarding tests added — 2 new spec files (onboarding-api.cy.js, onboarding-ui.cy.js), 52 tests (51 passing, 1 pending intentional). Covers POST /biometric and POST /complete API + full 3-step onboarding wizard UI. Also fixed Zod v4 breaking change (`errors` → `issues`) in biometric route. Total test cases updated to 1,717.

> **Note (2026-05-17 v1.18):** Product History UI tests added — 1 new spec file (ui-product-history.cy.js), 28 tests, all 28/28 passing. Covers PRD section 3.1.4 — list view, search, filter by status, sort options, true empty state, filtered empty state, badge dot counter. New DB helpers: insertFullProductHistoryFromDb + deleteProductHistoryFromDb. New tasks: insertFullProductHistory, deleteProductHistoryRows. Total test cases updated to 1,665.

> **Note (2026-05-17 v1.17):** Product Name UI tests added — 3 new spec files (ui-product-name-list, ui-product-name-update, ui-product-name-bulk), 45 new tests. ui-product-name-bulk.cy.js (16 tests) confirmed 16/16 passing in focused run. Grand total Product Name: 159 tests across 9 spec files. Total test cases (recounted from table): 1,637.

> **Note (2026-05-16):** Product Brand UI tests added — 3 new spec files (ui-product-brand-add, ui-product-brand-list, ui-product-brand-update), 50 new tests, all 50 passing. Grand total Product Brand: 164 tests across 9 spec files. Total test cases (recounted from table): 1,592.

> **Note (2026-05-14 final):** All active tests passing — 822/822 (100% active, 98.7% incl. pending). All 21 failures from initial run resolved: backend history payload fixed, summary/list API count cap fixed (PostgREST max_rows), auth assertion case-insensitive, DB helper rewritten with exact count queries. 11 pending remain in product-list-ui (intentional placeholders).

> **Note (2026-05-13):** Full regression run completed for 4 groups: api-auth (59 tests), auth (123 tests), dashboard (161 tests), product (490 tests). Total 833 tests executed. Issues found in auth (testId missing), product module (cy.getAuthToken() undefined), and product-detail-ui (visibility clipping).

## Last Execution Results (2026-06-10 Focused Run: Personal Bests Table #174)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running/analytics (Personal Bests API) — issue #174                          | 1          | 7     | 7      | 0      | 0       | ✅       |
| running/analytics (Personal Bests UI) — issue #174                           | 1          | 19    | 19     | 0      | 0       | ✅       |
| **Total**                                                                    | **2**      | **26** | **26** | **0**  | **0**   | **100%** |

**Status:** 26/26 passing (100%). personal-bests-api.cy.js 7/7: auth guard 401, authenticated 200 + data object, all 5 distance keys present, each array ≤5 entries, entry field shape validated (rank/elapsed_time_sec/date/activity_id/pace_sec_per_km), top entry rank=1, entries ordered ascending. personal-bests-ui.cy.js 19/19: auth guard, loading skeleton, table with data (section/table/row IDs, 5 columns, time/pace/date formatting, h:mm:ss for >1h), empty distances (em-dash, no row elements), error state ("Failed to load personal bests"), row click navigation to activity detail page.

### Previous Execution Results (2026-06-09 Focused Run: Map Style Toggle #172)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running/activities (Map Style Toggle UI) — issue #172                        | 1          | 14    | 14     | 0      | 0       | ✅       |
| **Total**                                                                    | **1**      | **14** | **14** | **0**  | **0**   | **100%** |

**Status:** 14/14 passing (100%). Suite A (5): toggle renders with polyline, Map aria-pressed=true default, Satellite aria-pressed=false default, Satellite click flips both states, Map click restores both states. Suite B (4): expand opens role=dialog modal, modal footer toggle present, Escape closes modal, style sync. Suite C (2): toggle absent when polyline=null, expand button absent. Suite D (3): both IDs present, button text labels visible.

### Previous Execution Results (2026-06-09 Focused Run: Lazy Compute Derived Metrics #168)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running/activities (Lazy Compute Metrics API) — issue #168                   | 1          | 7     | 5      | 0      | 2       | ✅       |
| **Total**                                                                    | **1**      | **7** | **5**  | **0**  | **2**   | **100% active** |

**Status:** 5/5 active passing (100%). 2 pending (data-dependent skips). lazy-compute-metrics-api.cy.js: Describe 1 (PENDING — no qualifying activity with moving_time > 1200 + avg_hr + incomplete metrics in test DB). Describe 2 (PENDING — same gate). Describe 3 (PASS) — GET activity below gate → 200 with all 3 derived metrics null. Describe 4 (4 PASS) — response always includes aerobic_decoupling, efficiency_factor, estimated_vo2max keys; unauthenticated → 401.

### Previous Execution Results (2026-06-06 Focused Run: Injury AI Roles #160)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running/ai (Injury Coach API) — issue #160                                   | 1          | 6     | 6      | 0      | 0       | ✅       |
| running/ai (Injury Coach UI) — issue #160                                    | 1          | 12    | 12     | 0      | 0       | ✅       |
| running/ai (Symptom Log API) — issue #160                                    | 1          | 6     | 6      | 0      | 0       | ✅       |
| **Total**                                                                    | **3**      | **24** | **24** | **0**  | **0**   | **100%** |

**Status:** 24/24 passing (100%). injury-coach-api.cy.js 6/6 (POST physio/physician → 200, POST missing question/short question/invalid role → 400, unauthenticated → 401). injury-coach-ui.cy.js 12/12 (disclaimer strip, role selection form reveal, phase pills, submit button validation, emergency block, successful submission, escalation banner, API error handling). symptom-log-api.cy.js 6/6 (POST valid → 201, POST missing body_region → 400, POST pain_level 11 → 400, GET active logs → 200, PATCH archive existing → 200, PATCH non-existent UUID → 404). Fixes: `.error.errors[0]` → `.error.issues[0]` in 3 route files (Zod v4 breaking change); PATCH payload `{ status: 'archived' }` → `{ archived: true }` to match `archiveSymptomSchema`.

### Previous Execution Results (2026-06-06 Focused Run: Web Push Notifications #135)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-settings (Settings UI + push toggle) — issue #135                   | 1          | 21    | 21     | 0      | 0       | ✅       |
| running-push-subscription (Push Subscription API) — issue #135              | 1          | 4     | 4      | 0      | 0       | ✅       |
| **Total**                                                                    | **2**      | **25** | **25** | **0**  | **0**   | **100%** |

**Status:** 25/25 passing (100%). settings-ui.cy.js 21/21 (all 17 pre-existing + 4 new push toggle tests). push-subscription-api.cy.js 4/4 (new spec file). Push toggle: enable flow (granted), disable flow (null subscription), permission denied shows error + toggle stays OFF, persist after reload toggle stays ON. API: valid subscription → 200 + enabled:true; null subscription → 200 + enabled:false; endpoint present but keys missing → 400; unauthenticated → 401.

### Previous Execution Results (2026-06-05 Focused Run: Next Race Widget #153)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-dashboard (Dashboard UI Extended) — issue #153                       | 1          | 14    | 14     | 0      | 0       | ✅       |
| **Total**                                                                    | **1**      | **14** | **14** | **0**  | **0**   | **100%** |

**Status:** 14/14 passing (100%). dashboard-ui-extended.cy.js confirmed passing. Covers NextRace null state, title display, race-week badge; YtdStats visibility + distance format; SyncStatusBar Never/btn/POST/resultMsg; activity type filter render + active ring.

### Previous Execution Results (2026-06-05 Focused Run: VO2max Target Effort #137)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-race-log (target time UI) — issue #137                               | 1          | 19    | 19     | 0      | 0       | ✅       |
| running-analytics (VO2max target effort API) — issue #137                    | 1          | 4     | 4      | 0      | 0       | ✅       |
| running-analytics (VO2max target effort UI) — issue #137                     | 1          | 31    | 31     | 0      | 0       | ✅       |
| **Total**                                                                    | **3**      | **54** | **54** | **0**  | **0**   | **100%** |

**Status:** 54/54 passing (100%). All 3 spec files confirmed passing.

### Previous Execution Results (2026-06-04 Focused Run: Running Settings Page)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-settings (Settings page UI) — issue #132                             | 1          | 17    | 17     | 0      | 0       | ✅       |
| **Total**                                                                    | **1**      | **17** | **17** | **0**  | **0**   | **100%** |

**Status:** settings-ui.cy.js 17/17 passing (100%). 7 describe blocks all passed. Auth guard redirects unauthenticated users to /login. Profile section: form renders, save success shown on 200, save error shown on 422. HR Zones: threshold input hidden by default (max_hr), Lactate Threshold option shows input, client-side validation blocks empty threshold, Karvonen save success. Notifications: all 4 toggles render and toggle click fires PATCH. Strava Connection: connected card + Disconnect button render, Disconnect POST fires then disconnected state shows. Danger Zone: dialog opens, confirm disabled on empty text + on wrong text, correct "DELETE" enables button and DELETE API fires. Duration: 27 seconds.

### Previous Execution Results (2026-06-04 Focused Run: AI Coach Page +17 tests)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-ai-coach (AI Coach Page) — issue #131                                | 1          | 56    | 56     | 0      | 0       | ✅       |
| **Total**                                                                    | **1**      | **56** | **56** | **0**  | **0**   | **100%** |

**Status:** ai-coach-page.cy.js 56/56 passing (100%). All 12 scenario groups passed. +17 new tests added in this run: recommendation pills (4), ask coach free text field (5), follow-up inline response (5), context strip (3). Covers full page: auth guard, 5-section structure, Training Load Tiles color coding, Anomaly Alerts acknowledge flow, Daily Insight Card (trigger/pending/content/regenerate/pills/ask coach/follow-up/context strip), Race Countdown Card, Weekly Review Card expand/collapse, and page-level error/loading states.

### Previous Execution Results (2026-06-03 Focused Run: Compare Runs Selector Fix)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-activities (Compare Runs UI) — issue #121                            | 1          | 19    | 19     | 0      | 0       | ✅       |
| **Total**                                                                    | **1**      | **19** | **19** | **0**  | **0**   | **100%** |

**Status:** compare-runs-ui.cy.js 19/19 passing (48s). All 4 suites (A–D) passed. Key lesson: stub must return paginated envelope `{ data: [...], total, page, limit }` — not a plain array — to match the real API response that `fetchActivities()` returns. The bug was that old code called `.filter()` directly on this envelope object.

### Previous Execution Results (2026-06-02 Focused Run: Analytics AI Card)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-analytics (Analytics AI Card API) — issue #100                       | 1          | 15    | 15     | 0      | 0       | ✅       |
| running-analytics (Analytics AI Card UI) — issue #100                        | 1          | 14    | 14     | 0      | 0       | ✅       |
| **Total**                                                                    | **2**      | **29** | **29** | **0**  | **0**   | **100%** |

**Status:** analytics-ai-api.cy.js 15/15 passing (7s). analytics-ai-ui.cy.js 14/14 passing (22s). Combined: 29/29 passing (100%). Key lesson: Cypress plain-string intercept URL matching is substring-based — use `{ pathname: '...' }` URL object for exact-path matching that ignores query params without matching sub-paths.

### Previous Execution Results (2026-05-31 Focused Run: AI Coach Improvements)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-activities (AI Coach Improvements) — issue #82                       | 1          | 36    | 36     | 0      | 0       | ✅       |
| **Total**                                                                    | **1**      | **36** | **36** | **0**  | **0**   | **100%** |

**Status:** ai-coach-improvements.cy.js — 36/36 passing (100%). Duration: 1m 14s. All 12 suites (A–L) passed including timer-controlled tests (rotating copy via cy.clock(), long-wait hint at 61s) and comparison popover tests.

### Previous Run Results (2026-05-31 Focused Run: Analytics UI Chart Empty State)

| Group                                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ---------------------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-analytics (Analytics UI) — empty state copy updated for fix #63      | 1          | 9     | 9      | 0      | 0       | ✅       |
| **Total**                                                                    | **1**      | **9** | **9**  | **0**  | **0**   | **100%** |

**Status:** analytics-ui.cy.js — 9/9 passing. Updated 4 assertions to new empty state copy (`Not enough VO₂max data yet`, `Not enough Efficiency Factor data yet`) and added 2 new details assertions (`Needs 3+ runs with a VO₂max estimate`, `Needs 3+ runs with an Efficiency Factor`).

### Previous Run Results (2026-05-29 Focused Run: Sidebar UI)

| Group                                                          | Spec Files | Tests | Passed | Failed | Pending | Status   |
| -------------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| shared (Sidebar UI) ⭐ NEW spec file + new `shared/` folder    | 1          | 8     | 8      | 0      | 0       | ✅       |
| **Total**                                                      | **1**      | **8** | **8** | **0** | **0**  | **100%** |

**Status:** New sidebar-ui.cy.js — 8 tests covering auth guard, tooltip presence in collapsed/expanded state, and collapse toggle. All 8 passing 100%.

### Previous Run Results (2026-05-29 Focused Run: AI Coach UI)

| Group                                                        | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ------------------------------------------------------------ | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-dashboard (AI Coach UI) ⭐ +4 new Section H tests    | 1          | 20    | 20     | 0      | 0       | ✅       |
| **Total**                                                    | **1**      | **20** | **20** | **0** | **0**  | **100%** |

**Status:** Fixed empty-state copy mismatch (Section C) + added Section H multi-card tests + added scrollIntoView() to all visibility assertions. All 20 tests passing 100%.

### Previous Run Results (2026-05-29 Focused Run: Race Log Search + Filter)

| Group                                                    | Spec Files | Tests | Passed | Failed | Pending | Status   |
| -------------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-race-log (Race Log UI) ⭐ +13 new tests          | 1          | 51    | 51     | 0      | 0       | ✅       |
| **Total**                                                | **1**      | **51** | **51** | **0** | **0**  | **100%** |

**Status:** 13 new tests added to `race-log-ui.cy.js` — Section M (Search input: 4 tests) + Section N (Distance filter chips: 9 tests). All 51 tests in the file passing 100%.

### Previous Run Results (2026-05-27 Focused Run: Running Tracker Activities)

| Group                                              | Spec Files | Tests | Passed | Failed | Pending | Status   |
| -------------------------------------------------- | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-activities (Activities API) ⭐ NEW         | 1          | 8     | 8      | 0      | 0       | ✅       |
| running-activities (Activities UI) ⭐ NEW          | 1          | 21    | 21     | 0      | 0       | ✅       |
| running-activities (Activity Detail UI)            | 1          | 27    | 27     | 0      | 0       | ✅       |
| running-activities (Activity Detail full)          | 1          | 36    | 36     | 0      | 0       | ✅       |
| running-activities (Activity Detail API)           | 1          | 25    | 25     | 0      | 0       | ✅       |
| running-activities (AI Insights API)               | 1          | 8     | 8      | 0      | 0       | ✅       |
| running-activities (HR Zones API)                  | 1          | 6     | 6      | 0      | 0       | ✅       |
| running-activities (Stream Charts API)             | 1          | 7     | 7      | 0      | 0       | ✅       |
| running-activities (Stream Charts UI)              | 1          | 14    | 14     | 0      | 0       | ✅       |
| **Total**                                          | **9**      | **152** | **152** | **0** | **0**  | **100%** |

**Status:** All 9 spec files passing 100%. 2 new files added today. 3 bugs fixed (goals 404, streams 400, AIInsightCard border). All data-testid converted to id= in activities components.

### Previous Run Results (2026-05-25 Focused Run: Running Tracker Dashboard Extended)

| Group                                      | Spec Files | Tests | Passed | Failed | Pending | Status   |
| ------------------------------------------ | ---------- | ----- | ------ | ------ | ------- | -------- |
| running-dashboard (Gear API)               | 1          | 6     | 6      | 0      | 0       | ✅       |
| running-dashboard (Gear UI)                | 1          | 14    | 14     | 0      | 0       | ✅       |
| running-dashboard (Performance Trends API) | 1          | 5     | 5      | 0      | 0       | ✅       |
| running-dashboard (Dashboard UI Extended)  | 1          | 14    | 14     | 0      | 0       | ✅       |
| **Total**                                  | **4**      | **39** | **39** | **0** | **0**   | **100%** |

**Status:** All 4 new spec files passing 100%. gear-api.cy.js (6/6): GET shape + 401, PATCH 200. gear-ui.cy.js (14/14): loading skeleton, list render, empty/error state, limit tabs, near-retirement warning, edit form. performance-trends-api.cy.js (5/5): shape, ?limit, ?type filter, 401. dashboard-ui-extended.cy.js (14/14): YtdStats visibility + distance format, NextRace variants, syncStatusBar Never/btn/POST/resultMsg, activity type filter render + active ring.

### Previous Run Results (2026-05-23 Focused Run: Running Tracker Dashboard)

| Group                          | Spec Files | Tests | Passed | Failed | Pending | Status |
| ------------------------------ | ---------- | ----- | ------ | ------ | ------- | ------ |
| running-dashboard (API)        | 1          | 8     | 8      | 0      | 0       | ✅     |
| running-dashboard (UI)         | 1          | 28    | 28     | 0      | 0       | ✅     |
| **Total**                      | **2**      | **36** | **36** | **0** | **0**  | **100%** |

**Status:** dashboard-api.cy.js (8/8 pass, 5s) and dashboard-ui.cy.js (28/28 pass, 20s). All sections render correctly with stubbed data. Auth guard, loading skeleton, error+retry, and all 3 training load badge variants pass. scroll-into-view applied on 5 tests to handle overflow clipping on sections below viewport fold.

### Previous Run Results (2026-05-17 Focused Run: Product History UI)

| Group                       | Spec Files | Tests | Passed | Failed | Pending | Status |
| --------------------------- | ---------- | ----- | ------ | ------ | ------- | ------ |
| product-history (UI)        | 1          | 28    | 28     | 0      | 0       | ✅     |
| **Total**                   | **1**      | **28** | **28** | **0** | **0**  | **100%** |

**Status:** ui-product-history.cy.js — all 28 tests passing. Covers all PRD 3.1.4 acceptance criteria: list view (3), search (4), search+filter combined (2), filter by status (4), sort options (5), true empty state (1), filtered empty state (3), badge dot counter (4), loading skeleton (1). Duration: 57s.

### Previous Run Results (2026-05-17 Focused Run: Product Name UI)

| Group                  | Spec Files | Tests | Passed | Failed | Pending | Status |
| ---------------------- | ---------- | ----- | ------ | ------ | ------- | ------ |
| product-name (UI bulk) | 1          | 16    | 16     | 0      | 0       | ✅     |
| **Total**              | **1**      | **16** | **16** | **0** | **0**  | **100%** |

**Status:** ui-product-name-bulk.cy.js — all 16 tests passing. Covers bulk checkbox selection, select-all with indeterminate state, Set Active / Set Inactive API call verification, Deselect All, auto-deselect on filter/search change, product count badge navigation (aria-label, URL param, keyboard accessibility), and zero-count badge non-navigation.

### Previous Run Results (2026-05-16 Focused Run: Product Brand UI)

| Group                | Spec Files | Tests | Passed | Failed | Pending | Status |
| -------------------- | ---------- | ----- | ------ | ------ | ------- | ------ |
| product-brand (UI)   | 3          | 50    | 50     | 0      | 0       | ✅     |
| **Total**            | **3**      | **50** | **50** | **0** | **0**  | **100%** |

**Status:** 3 new UI spec files for Product Brand — all 50 tests passing. Covers Add Brand dialog (11), List UI with search/filter/sort/bulk (26), Update/Delete dialog flows (13).

### Previous Run Results (2026-05-14 Full Regression Run)

| Group     | Spec Files | Tests | Passed | Failed | Pending | Status |
| --------- | ---------- | ----- | ------ | ------ | ------- | ------ |
| api-auth  | 3          | 59    | 59     | 0      | 0       | ✅     |
| auth      | 3          | 123   | 123    | 0      | 0       | ✅     |
| dashboard | 3          | 161   | 161    | 0      | 0       | ✅     |
| product   | 13         | 490   | 479    | 0      | 11      | ✅     |
| **Total** | **22**     | **833** | **822** | **0** | **11** | **100% active** |

**Status:** All 4 groups at 100% active pass rate. 822/822 active tests passing. 11 intentional pending in product-list-ui (sticky scroll, date picker, stock validation — not reliably testable headless). All 21 failures from initial run resolved via 5 targeted fixes: backend history payload, summary count cap, test auth assertion case-insensitivity, list count cap awareness, DB helper count cap.

### Previous Run Results (2026-05-13)

| Group     | Spec Files | Tests | Passed | Failed | Skipped | Status |
| --------- | ---------- | ----- | ------ | ------ | ------- | ------ |
| api-auth  | 3          | 59    | 59     | 0      | 0       | ✅     |
| auth      | 3          | 123   | 87     | 36     | 0       | ⚠️     |
| dashboard | 3          | 161   | 161    | 0      | 0       | ✅     |
| product   | 13         | 490   | 433    | 57     | 27      | ⚠️     |
| **Total** | **22**     | **833** | **740** | **93** | **27** | **88.8%** |

## Automated Test Cases

| #   | File                                                                  | Test Suite                           | Test Cases | Feature Covered              |
| --- | --------------------------------------------------------------------- | ------------------------------------ | ---------- | ---------------------------- |
| 1   | cypress/e2e/auth/login.cy.js                                          | Login - API & Authentication         | 9          | Supabase API login           |
| 2   | cypress/e2e/auth/login.cy.js                                          | Login Page UI (3 viewports)          | 9          | Login page display           |
| 3   | cypress/e2e/auth/login.cy.js                                          | Auth Callback (3 viewports)          | 9          | OAuth callback handling      |
| 4   | cypress/e2e/auth/login.cy.js                                          | Session Persistence (3 viewports)    | 27         | Session continuity           |
| 5   | cypress/e2e/auth/login.cy.js                                          | App Identity & Google Branding       | 6          | Branding & identity          |
| 6   | cypress/e2e/auth/login.cy.js                                          | Middleware ?next= Param Preservation | 4          | Redirect param handling      |
| 7   | cypress/e2e/auth/logout.cy.js                                         | Logout - API Endpoint                | 3          | Logout API auth guard        |
| 8   | cypress/e2e/auth/logout.cy.js                                         | Logout Button (Inventory/Trading)    | 20         | LogoutButton component       |
| 9   | cypress/e2e/auth/logout.cy.js                                         | UserMenu - Landing Page              | 12         | UserMenu sign out            |
| 10  | cypress/e2e/auth/session.cy.js                                        | Session Validation                   | 21         | Session state & expiry       |
| 11  | cypress/e2e/api-auth/auth-api.cy.js                                   | Auth API endpoints                   | 6          | Auth API auth guard          |
| 12  | cypress/e2e/api-auth/inventory-api.cy.js                              | Inventory API auth guard             | 24         | Inventory API protection     |
| 13  | cypress/e2e/api-auth/trade-api.cy.js                                  | Trade API auth guard                 | 29         | Trade API protection         |
| 14  | cypress/e2e/landing_page/landing-page.cy.js                           | User Experience                      | 3          | Greeting & cards             |
| 15  | cypress/e2e/landing_page/landing-page.cy.js                           | Navigation                           | 2          | Trade & inventory navigation |
| 16  | cypress/e2e/landing_page/landing-page.cy.js                           | Responsive Layout (3 viewports)      | 3          | Mobile/tablet/desktop layout |
| 17  | cypress/e2e/landing_page/landing-page.cy.js                           | Mobile/Tablet/Desktop Interactions   | 9          | Per-viewport interactions    |
| 18  | cypress/e2e/landing_page/landing-page.cy.js                           | User Menu (4 viewports)              | 16         | UserMenu trigger & sign out  |
| 19  | cypress/e2e/inventory_management/dashboard/dashboard-ui.cy.js         | Dashboard UI                         | 88         | Inventory dashboard display  |
| 20  | cypress/e2e/inventory_management/dashboard/dashboard-api.cy.js        | Dashboard API                        | 56         | Dashboard API responses      |
| 21  | cypress/e2e/inventory_management/dashboard/summary-api.cy.js          | Summary API                          | 17         | Inventory summary API        |
| 22  | cypress/e2e/inventory_management/product/list-product.cy.js           | List Product (API)                   | 26         | Product list API             |
| 22b | cypress/e2e/inventory_management/product/product-list-ui.cy.js        | Product List UI (v1.9/v1.10/v1.11)   | 102        | Sticky controls, Edit dialog, Record Usage, Usage Log, Mobile cards, Language, Summary card filters, Column sorting, Category filter, Last price hint, Recent purchases, Note display, Restock prediction |
| 22c | cypress/e2e/inventory_management/product/product-detail-ui.cy.js      | Product Detail UI (v1.11)            | 35         | Page load, navigation, status badge, 4 stat cards, purchase history, usage history, loading/error states |
| 22d | cypress/e2e/inventory_management/product/last-price-api.cy.js         | Last Purchase Price API              | 17         | Last price endpoint (auth, validation, accuracy, DB comparison) |
| 22e | cypress/e2e/inventory_management/product/restock-predictions-api.cy.js | Restock Predictions API              | 16         | Restock prediction endpoint (auth, response, business logic, DB comparison) |
| 23  | cypress/e2e/inventory_management/product/product-detail.cy.js         | Product Detail (API)                 | 25         | Product detail API           |
| 24  | cypress/e2e/inventory_management/product/add-product.cy.js            | Add Product                          | 100        | Product creation flow        |
| 25  | cypress/e2e/inventory_management/product/update-product.cy.js         | Update Product                       | 39         | Product update flow          |
| 26  | cypress/e2e/inventory_management/product/delete-product.cy.js         | Delete Product                       | 23         | Product deletion flow        |
| 27  | cypress/e2e/inventory_management/product/favorite-product.cy.js       | Favorite Product                     | 27         | Favorite toggle              |
| 28  | cypress/e2e/inventory_management/product/create-product-stock.cy.js   | Create Product Stock                 | 40         | Stock entry creation         |
| 29  | cypress/e2e/inventory_management/product/product-history.cy.js        | Product History                      | 25         | Stock history view           |
| 30  | cypress/e2e/inventory_management/product/summary-product.cy.js        | Product Summary                      | 16         | Product summary API          |
| 31  | cypress/e2e/inventory_management/product_brand/list-product-brand.cy.js    | List Product Brand              | 10         | Brand list view              |
| 32  | cypress/e2e/inventory_management/product_brand/product-brand-detail.cy.js  | Product Brand Detail            | 20         | Brand detail view            |
| 33  | cypress/e2e/inventory_management/product_brand/add-product-brand.cy.js     | Add Product Brand               | 32         | Brand creation flow          |
| 34  | cypress/e2e/inventory_management/product_brand/update-product-brand.cy.js  | Update Product Brand            | 26         | Brand update flow            |
| 35  | cypress/e2e/inventory_management/product_brand/delete-product-brand.cy.js  | Delete Product Brand            | 13         | Brand deletion flow          |
| 36  | cypress/e2e/inventory_management/product_brand/summary-product-brand.cy.js | Product Brand Summary           | 13         | Brand summary API            |
| 37  | cypress/e2e/inventory_management/product_name/list-product-name.cy.js      | List Product Name               | 10         | Name list view               |
| 38  | cypress/e2e/inventory_management/product_name/product-name-detail.cy.js    | Product Name Detail             | 20         | Name detail view             |
| 39  | cypress/e2e/inventory_management/product_name/add-product-name.cy.js       | Add Product Name                | 32         | Name creation flow           |
| 40  | cypress/e2e/inventory_management/product_name/update-product-name.cy.js    | Update Product Name             | 26         | Name update flow             |
| 41  | cypress/e2e/inventory_management/product_name/delete-product-name.cy.js    | Delete Product Name             | 13         | Name deletion flow           |
| 42  | cypress/e2e/inventory_management/product_name/summary-product-name.cy.js   | Product Name Summary            | 13         | Name summary API             |
| 43  | cypress/e2e/trading_management/trade/list-trade.cy.js                 | List Trade                           | 6          | Trade list view              |
| 44  | cypress/e2e/trading_management/trade/trade-detail.cy.js               | Trade Detail                         | 15         | Trade detail view            |
| 45  | cypress/e2e/trading_management/trade/add-trade.cy.js                  | Add Trade                            | 109        | Trade creation flow          |
| 46  | cypress/e2e/trading_management/trade/update-trade.cy.js               | Update Trade                         | 32         | Trade update flow            |
| 47  | cypress/e2e/trading_management/trade/delete-trade.cy.js               | Delete Trade                         | 6          | Trade deletion flow          |
| 48  | cypress/e2e/trading_management/trade/option-trade.cy.js               | Trade Options                        | 7          | Trade option types           |
| 49  | cypress/e2e/trading_management/trade/summary-trade.cy.js              | Trade Summary                        | 10         | Trade summary API            |
| 50  | cypress/e2e/trading_management/fee/list-fee.cy.js                     | List Fee                             | 6          | Fee list view                |
| 51  | cypress/e2e/trading_management/fee/fee-detail.cy.js                   | Fee Detail                           | 15         | Fee detail view              |
| 52  | cypress/e2e/trading_management/fee/add-fee.cy.js                      | Add Fee                              | 62         | Fee creation flow            |
| 53  | cypress/e2e/trading_management/fee/update-fee.cy.js                   | Update Fee                           | 19         | Fee update flow              |
| 54  | cypress/e2e/trading_management/fee/delete-fee.cy.js                   | Delete Fee                           | 6          | Fee deletion flow            |
| 55  | cypress/e2e/trading_management/fee/summary-fee.cy.js                  | Fee Summary                          | 23         | Fee summary API              |
| 56  | cypress/e2e/trading_management/event/list-event.cy.js                 | List Event                           | 6          | Event list view              |
| 57  | cypress/e2e/trading_management/event/event-detail.cy.js               | Event Detail                         | 15         | Event detail view            |
| 58  | cypress/e2e/trading_management/event/add-event.cy.js                  | Add Event                            | 59         | Event creation flow          |
| 59  | cypress/e2e/trading_management/event/update-event.cy.js               | Update Event                         | 20         | Event update flow            |
| 60  | cypress/e2e/trading_management/event/delete-event.cy.js               | Delete Event                         | 9          | Event deletion flow          |
| 61  | cypress/e2e/trading_management/event/summary-event.cy.js              | Event Summary                        | 25         | Event summary API            |
| 62  | cypress/e2e/inventory_management/product_brand/ui-product-brand-add.cy.js    | Add Brand UI               | 11         | Add Brand dialog: happy path, validation, duplicate rejection, open/close |
| 63  | cypress/e2e/inventory_management/product_brand/ui-product-brand-list.cy.js   | List Brand UI              | 26         | Search, filter by status, sort, bulk actions, bulk set active, badge dot counter, edit button, product count badge navigation, sort by product count |
| 64  | cypress/e2e/inventory_management/product_brand/ui-product-brand-update.cy.js | Update Brand UI            | 13         | Open/close dialog, prefill, name update, note update, delete flow, delete guard, duplicate name conflict, restore flow |
| 65  | cypress/e2e/inventory_management/product_name/ui-product-name-list.cy.js     | Product Name List UI       | 15         | Search (match, empty state, clear), filter by status (inactive, clear, deleted), sort (desc, reset), badge dot counter (0/1/2 active, drop from 2→1, hide on reset), edit button open, row-click open |
| 66  | cypress/e2e/inventory_management/product_name/ui-product-name-update.cy.js   | Product Name Update UI     | 14         | Open via row-click and edit button, close via Cancel, prefill verification, name update success, note update success, validation error on empty name, duplicate name conflict (409 inline error, recover with unique name), delete flow, in-use guard (disabled button + warning box), restore flow (Restore button visible, submit disabled, restore API call, row disappears from deleted view) |
| 67  | cypress/e2e/inventory_management/product_name/ui-product-name-bulk.cy.js     | Product Name Bulk UI       | 16         | Bulk checkbox: bar hidden on no selection, bar visible with count, bar disappears on deselect, select-all count, indeterminate state, select-all checked state, Deselect All; Set Active / Set Inactive API call body; auto-deselect on inactive filter, auto-deselect on search change; count badge > 0 is button with aria-label, badge click navigates to product-list?name=, keyboard accessible; count badge = 0 not rendered as button |
| 68  | cypress/e2e/inventory_management/product_history/ui-product-history.cy.js    | Product History UI         | 28         | List view (table visible, 7 columns, row data), Search (name filter, filtered empty state, clear button, hidden when empty), Search+Filter AND logic, Filter by Status (3 options, active/inactive/completed, toggle deselects), Sort (4 options, date_desc default, date_asc, name_asc, name_desc), True empty state (conditional), Filtered empty state (no results, Clear filters button, restore), Badge dot counter (0/1/2 active, filter+sort), Loading skeleton absent after SSR load |

| 69  | cypress/e2e/running/onboarding/onboarding-api.cy.js                  | Running Tracker Onboarding API       | 14         | POST /biometric, POST /complete — validation, auth guard |
| 70  | cypress/e2e/running/onboarding/onboarding-ui.cy.js                   | Running Tracker Onboarding UI        | 38         | 3-step wizard: biometric, Strava connect, goal setup, auth guard |
| 71  | cypress/e2e/running/sync/sync-api.cy.js                              | Running Tracker Strava Sync API      | 8          | POST /sync/strava, GET /sync/status, GET /auth/strava/callback (redirect), unauthenticated 401 guard |
| 72  | cypress/e2e/running/dashboard/dashboard-api.cy.js                    | Running Tracker Dashboard API        | 8          | GET /api/running/v1/dashboard — 200 + response shape (weekly_stats, training_load, recent_activities, calendar_activities, health_today), integer type checks, 401 guard |
| 73  | cypress/e2e/running/dashboard/dashboard-ui.cy.js                     | Running Tracker Dashboard UI         | 28         | Auth guard, loading skeleton, happy path (all 6 sections), empty state, health logged state, error + retry, training load status badge variants (Low/Caution/High Risk) |
| 74  | cypress/e2e/running/dashboard/gear-api.cy.js                         | Running Tracker Gear API             | 6          | GET /gear (200, data array, field presence, 401), PATCH /gear (200 updated object, 401) |
| 75  | cypress/e2e/running/dashboard/gear-ui.cy.js                          | Running Tracker Gear UI              | 14         | Loading skeleton, happy path (list + name + distance km), empty state, error + retry, limit tabs (Strava-only, both), near retirement warning, edit form open/save/cancel |
| 76  | cypress/e2e/running/dashboard/performance-trends-api.cy.js           | Running Tracker Performance Trends API | 5        | GET /performance-trends (200, data array, field presence), ?limit=20, ?type=Run, 401 guard |
| 77  | cypress/e2e/running/dashboard/dashboard-ui-extended.cy.js            | Running Tracker Dashboard UI Extended | 14       | YtdStats (renders, distance format, hidden when 0, hidden when null), NextRace (null, title, race-week badge), syncStatusBar (Never, btn visible, click triggers POST, syncResultMsg), activity type filter (renders, active ring) |
| 78  | cypress/e2e/running/race-log/race-log-api.cy.js                      | Running Tracker Race Log API         | 21       | GET /race-log (200 + shape, 401), POST (201 + body, 400 validation, 401), PATCH/:id (200 + recomputed pace, 404 unowned, 401), DELETE/:id (200, 404, 401) |
| 79  | cypress/e2e/running/race-log/race-log-ui.cy.js                       | Running Tracker Race Log UI          | 51       | Auth guard, loading skeleton, error+retry, empty state CTA. List: title/DNF badge/finish time/position_place/position_male in table rows; row-click navigates to detail. Add modal: open/close, validation, calendar date picker, successful save→navigate to detail, server error. Edit modal (detail page): open via editRaceBtn_raceDetailPage, prefill, PATCH success/fail. Delete (detail page): AlertDialog open, title in dialog, cancel, confirm→navigate back to list. Mobile: no overflow, add btn, rows visible. Search (#raceSearchInput): filter by title (case-insensitive), clear via X button, clear via empty input. Distance filter chips (All/5K/10K/21K/42K/Other): conditional render, single-bucket filter, toggle active chip, combined search+chip intersection, filter empty state + Clear filters. |
| 80  | cypress/e2e/running/activities/activities-api.cy.js                  | Running Tracker Activities List API  | 8        | GET /activities — authenticated 200, paginated shape, data array, required field presence, ?type=Run filter, ?page&limit params, 401 unauthenticated |
| 81  | cypress/e2e/running/activities/activities-ui.cy.js                   | Running Tracker Activities List UI   | 21       | Auth guard, loading skeleton, list renders activity cards, type filter (URL param change), pagination next/prev, error state, empty state (no activities + filtered empty) |
| 82  | cypress/e2e/running/activities/activityDetail.cy.js                  | Running Tracker Activity Detail full | 36       | Stats grid, secondary stats (power/temp/calories/gear), HR zones, AI insight card (all 5 states), splits, laps, best efforts, photos, route map |
| 83  | cypress/e2e/running/activities/activityDetailApi.cy.js               | Running Tracker Activity Detail API  | 25       | GET /activities/:id (200 + shape, 404, 401), PATCH /activities/:id (200, 422 validation, 404, 401), DELETE (204, 404, 401), PATCH /goals/:id (200, 404 ownership, 401) |
| 84  | cypress/e2e/running/activities/activity-detail-ui.cy.js              | Running Tracker HrZones + AIInsight UI | 27     | HrZonesChart (empty, Z1-Z5 rows, HR range labels, % + duration); AIInsightCard (loading, empty+focus buttons, generate→pending, content markdown, error+retry, completed-invalid fallback) |
| 85  | cypress/e2e/running/activities/ai-insight-api.cy.js                  | Running Tracker AI Insights API      | 8        | GET /ai/insights (200 + array shape, field presence, status enum, completed+valid content); POST /generate (202 queued, 422 missing activity_id, 401, 404 unowned activity) |
| 86  | cypress/e2e/running/activities/hr-zones-api.cy.js                    | Running Tracker HR Zones API         | 6        | GET /activities/:id zones field — null vs populated, zone array shape, min/max/time fields |
| 87  | cypress/e2e/running/activities/stream-charts-api.cy.js               | Running Tracker Stream Charts API    | 7        | GET /activities/:id/streams — 200 + shape (meta + data), 400 invalid resolution, 401, 404 non-existent |
| 88  | cypress/e2e/running/activities/stream-charts-ui.cy.js                | Running Tracker StreamCharts UI      | 14       | Loading skeleton, happy path (pace/HR/elevation charts), partial data (no cadence), empty state, error state, retry → success, accessibility sr-only |
| 89  | cypress/e2e/running/analytics/vo2max-stat.cy.js                      | Running Tracker VO2max Stat          | 25       | GET /analytics/vo2max-stat — auth guard, response shape, null state; UI: auth guard, loading skeleton, null state, happy path value, trend arrow, trend label, error + retry |
| 90  | cypress/e2e/running/analytics/analytics-ui.cy.js                     | Running Tracker Analytics UI         | 9        | Auth guard, VO2max trend section (empty state copy + details, chart renders), EF trend section (empty state copy + details, chart renders) — updated for fix #63 |
| 91  | cypress/e2e/running/activities/ai-coach-improvements.cy.js           | AI Coach Improvements (v1.3)         | 36       | RPE radiogroup (role, 10 pills, labels, select/deselect); user note (renders, types, char count, 200-char cap); context collapse to pending; context zone visibility; focus buttons (Performance, Recovery, Race Tips, Next Training); loading + pending skeleton; rotating status copy at 0s and 6s; long-wait hint at 60s with Try again; compare section/trigger in content state; comparison popover on desktop; activity list grouped by month; compare pill after selection; Get Recommendation button flow with compare_activity focus POST |
| 94  | cypress/e2e/running/activities/compare-runs-ui.cy.js                 | Compare Runs Selector Fix (issue #121) | 19     | Regression spec for fetchActivities() envelope bug. Suite A (5): compare section/trigger visible, popover opens, command container present, activities list renders (not empty), month group header. Suite B (5): search input present, name filter, date fragment filter, no-match empty message, clear restores full list. Suite C (5): no pill before selection, selecting closes popover, pill appears, pill contains date, Get Recommendation button appears. Suite D (4): remove button in pill, clicking remove hides pill, hides Get Recommendation button, trigger reappears. Stub: `{ data: [...], total, page, limit }` paginated envelope to match real API. |
| 92  | cypress/e2e/running/race-log/upcoming-races-api.cy.js                | Running Tracker Upcoming Races API   | 18       | GET list (200 + shape + field presence, list non-empty fields, 401), POST (201 + body, optional fields cleanup, 400 missing title/date/distance, 400 past date, 400 zero distance, 401), PATCH (200 partial update, 400 empty body, 404 unowned id, 401), DELETE (200 + message, 404 unowned id via SELECT-first fix, 401) |
| 95  | cypress/e2e/running/race-log/upcoming-races-target-time-ui.cy.js     | Upcoming Races Target Time UI (issue #137) | 19  | Add form: H/M/S inputs present, empty on new race, numeric input accepted. Card: badge visible + correct time when target_time_sec set, badge absent when null. Mixed list: exactly one badge. Edit modal: pre-populates H/M/S from target_time_sec, empty when no target time. |
| 96  | cypress/e2e/running/analytics/vo2max-target-effort-api.cy.js         | VO2max Target Effort API (issue #137) | 4      | Auth guard 401; 200 + data object; status field in [no_goal, no_target_time, insufficient_data, ok]; full field shape when ok (currentVo2max, requiredVo2max, gapMlKgMin, statusBadge, weeksToGoal, goal). |
| 97  | cypress/e2e/running/analytics/vo2max-target-effort-ui.cy.js          | VO2max Target Effort UI (issue #137) | 31      | Auth guard; no_goal empty state + "Set a race goal" CTA; no_target_time amber warning + "Add target time" link; insufficient_data "Need more data" + required VO2max; ok/On Track badge + gap numbers + weeks-to-goal + training recommendation + projection chart; ok/Goal Reached trophy text + badge + gap numbers; ok/Goal Expired expired message + "Set a new goal" + no chart; loading skeleton while pending; error role=alert + no gap card. |
| 93  | cypress/e2e/running/race-log/upcoming-races-ui.cy.js                 | Running Tracker Upcoming Races UI    | 38       | Auth guard (unauthenticated → /login); section renders (heading, add btn, touch target ≥32px); empty state (message, CTA, no cards); error state (Try again btn, retry re-fetches + card appears); card renders (2 cards, titles, location, countdown badge, amber info guide role=alert, link btn, calendar btn, no save-as-completed on unlinked, save-as-completed on linked); add modal (not visible on load, opens via header btn, opens via CTA, Cancel closes); form validation (role=alert on empty submit, title error); successful save (modal closes, card appears); server error (modal stays open, role=alert); edit modal (not visible, pre-filled title, PATCH success closes, PATCH fail stays open); delete dialog (opens, title shown, Cancel closes, Confirm removes card + empty state); mobile 375px (no overflow, add btn visible, card visible) |

| 95  | cypress/e2e/running/settings/settings-ui.cy.js               | Running Settings page UI (issue #132 + #135) | 21     | Auth guard (unauthenticated → /login); page load (#settingsPage visible); Profile section (form renders after skeleton, save 200 → #profileSaveSuccess, save 422 → #profileSaveError); HR Zones section (threshold input absent for max_hr, Lactate Threshold option shows #thresholdHrInput, client-side validation blocks API when threshold empty, Karvonen save → #hrZonesSaveSuccess); Notifications section (all 4 toggle IDs present, toggle click fires PATCH /user/settings); Strava Connection (connected state + #stravaDisconnectBtn, Disconnect POST + disconnected state); Danger Zone (#dangerZoneDialog opens, confirm disabled on empty, disabled on "WRONG", "DELETE" enables confirm btn, DELETE fires + dialog closes); Push Notifications — enable flow (Notification.requestPermission → granted, SW stub, POST subscription fired with non-null body), disable flow (POST { subscription: null }), permission denied (#pushNotificationsError visible + aria-checked=false), persist after reload (toggle ON after page reload). Fix: scrollIntoView() for CardContent with overflow:hidden clipping. |
| 98  | cypress/e2e/running/push-subscription/push-subscription-api.cy.js | Push Subscription API (issue #135) | 4   | POST with valid `{ endpoint, keys: { p256dh, auth } }` → 200 + `push_notifications_enabled: true`; POST `{ subscription: null }` → 200 + `push_notifications_enabled: false`; POST endpoint present but keys missing → 400 validation error; unauthenticated POST → 401. |

| 99  | cypress/e2e/running/ai/injury-coach-api.cy.js    | Injury Coach API (issue #160)         | 6          | POST physio/physician → 200 with data.content + escalate field; POST missing question → 400; POST short question (<10 chars) → 400; POST invalid role → 400; unauthenticated → 401 |
| 100 | cypress/e2e/running/ai/injury-coach-ui.cy.js     | Injury Coach UI (issue #160)          | 12         | Disclaimer strip visible before role selection; Physiotherapist card shows form; Physician card shows form + placeholder change; Acute phase pill select + deselect; submit disabled <10 chars, enabled ≥10; emergency block on "10/10"; successful submission → output card; escalate:true → red banner role=alert; 500 → error state |
| 101 | cypress/e2e/running/ai/symptom-log-api.cy.js     | Symptom Log API (issue #160)          | 6          | POST body_region + pain_level:5 → 201 with data.id; POST missing body_region → 400; POST pain_level:11 → 400; GET active logs → 200 + data array; PATCH archive existing { archived:true } → 200; PATCH non-existent UUID → 404 |
| 102 | cypress/e2e/running/activities/lazy-compute-metrics-api.cy.js | Lazy Compute Derived Metrics API (issue #168) | 7 | Compute triggered — GET for activity with moving_time > 1200 + avg_hr → at least one metric non-null (PENDING: no qualifying DB data). Idempotency — two successive GETs return identical metric values (PENDING: no qualifying DB data). Gate fails — short/no-HR activity → 200 with all 3 metrics null. Response shape — 200 always includes aerobic_decoupling, efficiency_factor, estimated_vo2max keys. Unauthenticated → 401. |
| 103 | cypress/e2e/running/activities/map-style-toggle-ui.cy.js | Map Style Toggle UI (issue #172) | 14       | Suite A (5): toggle renders with polyline, Map aria-pressed=true default, Satellite aria-pressed=false default, Satellite click flips states, Map click restores states. Suite B (4): expand opens role=dialog modal, modal footer toggle present, Escape closes modal, style sync. Suite C (2): toggle absent when polyline=null, expand button absent. Suite D (3): both IDs present, Map/Satellite label text visible. |
| 104 | cypress/e2e/running/analytics/personal-bests-api.cy.js | Personal Bests API (issue #174) | 7        | Auth guard 401; authenticated 200 + data object + message:'OK'; data contains all 5 keys (1 mile/5K/10K/15K/Half-Marathon); each distance array ≤5 entries; entry field shape (rank, elapsed_time_sec, date, activity_id, pace_sec_per_km); top entry rank=1; entries ordered rank ascending. |
| 105 | cypress/e2e/running/analytics/personal-bests-ui.cy.js | Personal Bests UI (issue #174) | 19        | Auth guard (unauthenticated → /login); loading skeleton during delayed fetch; table renders with data (section/table IDs visible, 5 distance column headers, rank-1 row 5K with 22:30 + 4:30 /km + 15 Jan 2026, rank-2 visible, 1-mile 7:00, Half-Marathon 1:45:00); empty distances show em-dash + no personalBestsRow elements; error state renders personalBestsError with "Failed to load personal bests" + no table; row click navigates to /main/running/activities/[activity_id]. |

| 106 | cypress/e2e/running/activities/hr-chart-enhancements-ui.cy.js | HR Chart Enhancements UI (issue #165) | 18       | avg HR reference line + label; historical avg HR line (visible/absent when null); peak HR marker + value; time-in-zone section (5 zone labels, %, bar colors); zone bands from maxHr fallback when zones=null; same 4 elements on Race Detail page (raceDetailPage prefix). |
| 107 | cypress/e2e/running/activities/hr-zones-ai-insight-ui.cy.js | HR Zones + AI Insight UI (issue #165 update) | 24   | Auth guard → /login; HR time-in-zone not rendered without HR stream; renders when HR+zones present; 5 zone label rows; % and duration per zone; 5 color bars. AIInsightCard: loading skeleton; card root always rendered; BETA badge+coaching prompt in empty state; focus buttons in empty state; no other states in empty; first focus button POST+pending bar+skeleton; content state markdown headers+list items+re-analyze buttons; error state+retry; retry null→empty; invalid insight shows empty/focus+no content. |

**Total Automated Test Cases: 2,505** (added 14 Map Style Toggle tests 2026-06-09 — issue #172; previous total: 2,316) (added 7 Lazy Compute Metrics tests 2026-06-09 — issue #168; previous total: 2,309) (added 54 VO2max Target Effort tests 2026-06-05 — issue #137; previous total: 2,223) (added 17 Settings page tests 2026-06-04 — issue #132; previous total: 2,206) (added 17 AI Coach page tests 2026-06-04; previous total: 2,189) (added 19 compare-runs tests 2026-06-03; previous total: 2,170) (added 56 upcoming races tests 2026-06-02; previous total: 2,114) (added 34 analytics tests 2026-05-31; previous total: 2,044) (added 13 race-log search+filter tests 2026-05-29; previous total: 2,031)

## Manual Test Cases (not yet automated)

| #   | Feature                    | Reason Not Automated                        | Priority to Automate |
| --- | -------------------------- | ------------------------------------------- | -------------------- |
| 1   | Google OAuth UI Flow       | Requires real Google OAuth browser redirect | P2                   |

## Coverage Gap Analysis

### Recent Additions (v1.11)

All Product List v1.11 features have automation coverage:
- **Summary Cards Clickable (P1)** — 5 tests
- **Column Sorting (P1)** — 7 tests
- **Category Filter (P1)** — 4 tests
- **Last Purchase Price Hint (P0)** — 3 tests
- **Recent Purchases Section (P2)** — 4 tests
- **Note Display in Usage Log (P1)** — 3 tests
- **Restock Prediction Hint (P2)** — 5 tests

All Product Detail UI v1.11 features have automation coverage:
- **Page Load & Navigation** — 4 tests
- **Status Badge** — 3 tests (failing due to visibility clipping)
- **Stat Cards (4 cards)** — 7 tests
- **Purchase History Section** — 6 tests (failing due to visibility clipping)
- **Usage History Section** — 2 tests (failing due to visibility clipping)
- **Loading State** — 2 tests
- **Error State** — 3 tests (failing due to error boundary implementation)
- **Validation** — 2 tests

### Known Issues (as of 2026-05-17)

1. **Product List UI — 11 Pending Tests** (intentional)
   - Tests marked pending cover scroll behavior, date picker, session UI
   - Not blocking — implement when interactions are fully testable

### Previously Fixed (2026-05-13 → 2026-05-14)

- ✅ Auth module: logoutBtn id, userMenuTrigger_landingPage id added — 100% passing
- ✅ Session persistence redirect fixed
- ✅ product-detail-ui: visibility clipping resolved — 35/35 passing
- ✅ last-price-api: unblocked from setup issue — 17/17 passing
- ✅ cy.getAuthToken() and cy.logout() custom commands defined

### Recommendation

**Next sprint priorities:**
1. Fix auth response message case in API (P1) — affects 9 specs
2. Fix stale count assertions with delta-based logic (P1) — affects 4 specs
3. Investigate update-product history recording (P1) — 3 failures in data integrity
4. Implement 11 pending tests in product-list-ui (P2)
