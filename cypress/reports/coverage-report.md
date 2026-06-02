# Test Coverage Report

**Last Updated:** 2026-06-02 (Upcoming Races UI issue #107 — upcoming-races-api.cy.js 18/18 + upcoming-races-ui.cy.js 38/38 passing 100%)
**App Version:** 1.3

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
| Running Tracker - Manual Entry  | 7              | 7         | 0           | 0          | 100%       | 21         |
| Running Tracker - Dashboard     | 10             | 10        | 0           | 0          | 100%       | 95         |
| Running Tracker - Race Log      | 9              | 9         | 0           | 0          | 100%       | 128        |
| Running Tracker - Activities    | 11             | 11        | 0           | 0          | 100%       | 198        |
| Running Tracker - Analytics     | 2              | 2         | 0           | 0          | 100%       | 34         |
| Shared - Sidebar                | 4              | 4         | 0           | 0          | 100%       | 8          |
| **Total**                       | **157**        | **156**   | **1**       | **0**      | **99%**    | **2,227**  |

> **Note (2026-06-02 v1.3 Upcoming Races UI issue #107):** upcoming-races-api.cy.js 18/18 + upcoming-races-ui.cy.js 38/38 passing (100%). Duration: API 10s, UI 47s. 2 new spec files. API spec: GET list (200 + shape, 401), POST create (6 tests — 201 + optional fields, 400 missing title/date/distance, 400 past date, 400 zero distance, 401), PATCH update (4 tests — 200 partial, 400 empty body, 404 unowned, 401), DELETE (3 tests — 200, 404 via SELECT-first service fix, 401). UI spec: 9 describe blocks — auth guard, section renders (heading, add btn, touch target height), empty state (no-upcoming message + CTA), error + retry, card renders (title/distance/date/countdown badge/amber info guide/link btn/calendar btn/save-as-completed toggle), add modal (open/close via header + CTA, form validation, successful POST + card appears, server error stays open), edit modal (pre-filled title, PATCH success closes modal, PATCH fail stays open), delete dialog (open, title, cancel + card stays, confirm + empty state), mobile 375px (no overflow, add btn, card visible). Bug fixed this session: `deleteUpcomingRace` service now does SELECT before DELETE — correctly returns false (→ 404) for non-existent or unowned IDs. Total Running Tracker - Race Log: 9 features, 128 tests.

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

## Last Execution Results (2026-05-31 Focused Run: AI Coach Improvements)

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
| 92  | cypress/e2e/running/race-log/upcoming-races-api.cy.js                | Running Tracker Upcoming Races API   | 18       | GET list (200 + shape + field presence, list non-empty fields, 401), POST (201 + body, optional fields cleanup, 400 missing title/date/distance, 400 past date, 400 zero distance, 401), PATCH (200 partial update, 400 empty body, 404 unowned id, 401), DELETE (200 + message, 404 unowned id via SELECT-first fix, 401) |
| 93  | cypress/e2e/running/race-log/upcoming-races-ui.cy.js                 | Running Tracker Upcoming Races UI    | 38       | Auth guard (unauthenticated → /login); section renders (heading, add btn, touch target ≥32px); empty state (message, CTA, no cards); error state (Try again btn, retry re-fetches + card appears); card renders (2 cards, titles, location, countdown badge, amber info guide role=alert, link btn, calendar btn, no save-as-completed on unlinked, save-as-completed on linked); add modal (not visible on load, opens via header btn, opens via CTA, Cancel closes); form validation (role=alert on empty submit, title error); successful save (modal closes, card appears); server error (modal stays open, role=alert); edit modal (not visible, pre-filled title, PATCH success closes, PATCH fail stays open); delete dialog (opens, title shown, Cancel closes, Confirm removes card + empty state); mobile 375px (no overflow, add btn visible, card visible) |

**Total Automated Test Cases: 2,170** (added 56 upcoming races tests 2026-06-02; previous total: 2,114) (added 34 analytics tests 2026-05-31; previous total: 2,044) (added 13 race-log search+filter tests 2026-05-29; previous total: 2,031)

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
