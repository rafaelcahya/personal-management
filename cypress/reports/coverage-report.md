# Test Coverage Report

**Last Updated:** 2026-05-25 (Focused run: Running Tracker Dashboard Extended — 4 new spec files, 39 new tests, all 39/39 passing)
**App Version:** 1.21

## Coverage Summary

| Module                          | Total Features | Automated | Manual Only | Not Tested | Coverage % | Test Cases |
| ------------------------------- | -------------- | --------- | ----------- | ---------- | ---------- | ---------- |
| Auth                            | 9              | 8         | 1           | 0          | 89%        | 120        |
| API Auth Guard                  | 3              | 3         | 0           | 0          | 100%       | 59         |
| Landing Page                    | 7              | 7         | 0           | 0          | 100%       | 33         |
| Inventory - Dashboard           | 10             | 10        | 0           | 0          | 100%       | 161        |
| Inventory - Product (API)       | 11             | 11        | 0           | 0          | 100%       | 354        |
| Inventory - Product List UI     | 12             | 12        | 0           | 0          | 100%       | 102        |
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
| Running Tracker - Dashboard     | 9              | 9         | 0           | 0          | 100%       | 75         |
| **Total**                       | **129**        | **128**   | **1**       | **0**      | **99%**    | **1,821**  |

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

## Last Execution Results (2026-05-25 Focused Run: Running Tracker Dashboard Extended)

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

**Total Automated Test Cases: 1,821** (added 39 confirmed passing tests for gear API, gear UI, performance-trends API, dashboard extended UI; previous total: 1,782)

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
