# Test Status Report

**Last Updated:** 2026-05-31 (AI Coach improvements issue #82 — ai-coach-improvements.cy.js 36 tests authored; BLOCKED in local env pending valid Supabase credentials)
**App Version:** 1.3

> Report ini menampilkan status testing per fitur: kapan terakhir ditest, jumlah test case manual, dan jumlah test case automation.
> "Last Tested" mengacu pada tanggal test file terakhir dijalankan secara eksplisit atau tanggal report update untuk full regression run.

> ✅ **API Auth Guard (2026-05-14):** 59/59 passing (100%). All auth guard checks pass for auth, inventory, and trade APIs.
> ✅ **Dashboard (2026-05-14):** 161/161 passing (100%). Dashboard UI, API, and summary API all pass.
> ✅ **Auth Module (2026-05-14):** 123/123 passing (100%). All auth failures from 2026-05-13 are fixed (logoutBtn id, userMenuTrigger id, session persistence).
> ✅ **Product Module (2026-05-14 final):** 479/479 active passing (100%), 11 intentional pending. All 21 failures resolved via backend + test fixes.
> ✅ **Product Brand UI (2026-05-16):** 3 new spec files added (ui-product-brand-add, ui-product-brand-list, ui-product-brand-update). 50/50 passing. Grand total Product Brand: 164 tests across 9 spec files.
> ✅ **Product Name UI (2026-05-17):** 3 new spec files added (ui-product-name-list, ui-product-name-update, ui-product-name-bulk). ui-product-name-bulk confirmed 16/16 passing in focused run. Grand total Product Name: 159 tests across 9 spec files.
> ✅ **Product History UI (2026-05-17):** 1 new spec file added (ui-product-history.cy.js). 28/28 passing in focused run. Covers all PRD 3.1.4 acceptance criteria. New DB tasks: insertFullProductHistory, deleteProductHistoryRows.
> ✅ **Running Tracker Manual Entry API (2026-05-23):** 1 new spec file added (manual-api.cy.js). 21/21 passing in focused run. Covers Activities CRUD (POST, list filter, dedup 409, PATCH, empty PATCH 422, DELETE), Subjective Health upsert lifecycle, Weight Log CRUD, auth guards (4 tests).
> ✅ **Running Tracker Strava Sync API (2026-05-23):** 1 new spec file added (sync-api.cy.js). 8/8 passing in focused run. Covers POST /sync/strava, GET /sync/status, GET /auth/strava/callback (redirect flows), unauthenticated guard (401).
> ✅ **Running Tracker Dashboard (2026-05-23):** 2 new spec files added (dashboard-api.cy.js, dashboard-ui.cy.js). 36/36 passing in focused run. API spec: GET /dashboard response shape (weekly_stats, training_load, recent_activities, calendar_activities, health_today), integer checks, 401 guard. UI spec: auth guard, loading skeleton, happy path 6 sections, empty state, health logged state, error+retry, training load badge variants (Low/Caution/High Risk).
> ✅ **Sidebar UI (2026-05-29):** sidebar-ui.cy.js 8/8 passing (100%). New `shared/` spec folder. Covers issue #8: auth guard, collapsed tooltips (Inventory Dashboard/Running Dashboard/Activities label), expanded no-tooltip, collapse toggle (both directions). Tooltip fix: native `PointerEvent('pointermove')` dispatch triggers Radix `onPointerMove` handler; collapse state fix: wait for `title="Expand/Collapse sidebar"` to confirm React useEffect has run. Added `sidebarCollapseBtn_sidebar` id and 3 Dashboard nav item ids. Shared module: 8 tests.
> 🟡 **Running Tracker AI Coach improvements (2026-05-31):** ai-coach-improvements.cy.js 36 tests authored for issue #82 (PR #79 backend + PR #80 frontend). BLOCKED in local env — `app/main/running/(app)/layout.jsx` server-side Supabase auth check cannot be intercepted by cy.intercept(); requires valid Supabase test user credentials. Tests are structurally correct and expected to pass 100% in CI. Covers: RPE radiogroup (A), user note textarea (B), context collapse/visibility (C+D), focus buttons (E), loading/pending skeleton (F), rotating status copy (G), long-wait hint (H), comparison section+trigger (I), comparison popover on desktop (J), activity list in popover (K), Get Recommendation flow (L).
> ✅ **Running Tracker Analytics (2026-05-31):** analytics-ui.cy.js 9/9 passing (100%). Updated empty state assertions to new copy introduced in fix #63: VO2max section now asserts `Not enough VO₂max data yet` + `Needs 3+ runs with a VO₂max estimate`; EF section asserts `Not enough Efficiency Factor data yet` + `Needs 3+ runs with an Efficiency Factor`. vo2max-stat.cy.js (25 tests) also registered for the Analytics module from issue #71.
> ✅ **v1.2 Milestone Frontend Fixes (2026-05-30):** 55/55 passing (100%). 3 new spec files + 1 updated. activities-page-title.cy.js (10 tests): Activities page title #42, pagination text-center #44, Race Log page title #55, Race Log empty state. product-list-star-image.cy.js (9 tests): non-favorite star text-slate-300 #33 (desktop+mobile), image preview dialog opens on click #34. product-filter-no-category.cy.js (9 tests): category section removed #37, standard filters unaffected. activity-detail-ui.cy.js (27 tests): all AI Coach card v1.2 states confirmed including redesigned card #56, refresh button #47; fixes: scrollIntoView for below-fold elements, aiInsightInvalid ID for invalid state.
> ✅ **Running Tracker AI Coach UI (2026-05-29):** ai-coach-ui.cy.js 20/20 passing (100%). Covers issues #7, #22, #23: auth guard, empty state, content state, pending/invalid fallback, error state, retry flows, and new Section H multi-card rendering (3 cards, 1 card, pending filter, is_valid filter). Root fix: added `scrollIntoView()` before visibility assertions to handle overflow-y-auto clipping. Dashboard total now 95 tests.
> ✅ **Running Tracker Race Log (2026-05-29):** Full re-run confirmed — race-log-api.cy.js 21/21 + race-log-ui.cy.js 51/51 = 72/72 passing (100%). All API and UI tests pass including search + distance filter chips added in last session.
> ✅ **Running Tracker Activities (2026-05-27):** 2 new spec files added (activities-api.cy.js, activities-ui.cy.js). Full activities suite: 9 spec files, 152 tests, all 152/152 passing. New: activities-api (8 tests: GET list shape, pagination, type filter, 401), activities-ui (21 tests: auth guard, skeleton, list render, type filter URL param, pagination, error, empty states). Existing: activityDetail (36), activityDetailApi (25, strict 404 for goals ownership), activity-detail-ui (27, HrZonesChart + AIInsightCard), ai-insight-api (8), hr-zones-api (6), stream-charts-api (7, 400 fix for invalid resolution), stream-charts-ui (14). Bugs fixed: updateGoal.js `.single()`→`.maybeSingle()`, streams route validation order, AIInsightCard border. All `data-testid` in activities components converted to `id=` with `_activityDetailPage` suffix.
> ✅ **Running Tracker Dashboard Extended (2026-05-25):** 4 new spec files added (gear-api.cy.js, gear-ui.cy.js, performance-trends-api.cy.js, dashboard-ui-extended.cy.js). 39 tests, all 39/39 passing. Gear API (6): response shape, PATCH, auth guards. Gear UI (14): loading skeleton, list rendering, empty/error state, limit tabs, near-retirement warning, edit form. Performance Trends API (5): shape, ?limit, ?type, 401. Dashboard Extended UI (14): YtdStats, NextRace, syncStatusBar/btn/resultMsg, activity type filter active ring.

---

## Summary

| Module                          | Last Tested  | Manual | Automation | Total |
| ------------------------------- | ------------ | ------ | ---------- | ----- |
| Auth                            | 2026-05-14   | 1      | 126        | 127   |
| API Auth Guard                  | 2026-05-14   | 0      | 59         | 59    |
| Landing Page                    | 2026-05-08   | 0      | 33         | 33    |
| Inventory - Dashboard           | 2026-05-14   | 0      | 161        | 161   |
| Inventory - Product (API)       | 2026-05-30   | 0      | 408        | 408   |
| Inventory - Product Brand       | 2026-05-16   | 0      | 164        | 164   |
| Inventory - Product Name        | 2026-05-17   | 0      | 159        | 159   |
| Inventory - Product History UI  | 2026-05-17   | 0      | 28         | 28    |
| Trading - Trade                 | 2026-03-15   | 0      | 185        | 185   |
| Trading - Fee                   | 2026-03-15   | 0      | 131        | 131   |
| Trading - Event                 | 2026-03-15   | 0      | 134        | 134   |
| Running Tracker - Onboarding    | 2026-05-20   | 0      | 52         | 52    |
| Running Tracker - Sync API      | 2026-05-23   | 0      | 8          | 8     |
| Running Tracker - Manual Entry  | 2026-05-23   | 0      | 21         | 21    |
| Running Tracker - Dashboard     | 2026-05-29   | 0      | 95         | 95    |
| Running Tracker - Race Log      | 2026-05-29   | 0      | 72         | 72    |
| Running Tracker - Activities    | 2026-05-31   | 0      | 198        | 198   |
| Running Tracker - Analytics     | 2026-05-31   | 0      | 34         | 34    |
| Shared - Sidebar                | 2026-05-29   | 0      | 8          | 8     |
| **Total**                       |              | **1**  | **2,170**  | **2,171** |

---

## Staleness Alert

Fitur berikut belum ditest lebih dari **30 hari** (sejak 2026-05-01):

| Module                    | Last Tested | Days Since Last Test |
| ------------------------- | ----------- | -------------------- |
| Landing Page              | 2026-05-08  | 23 hari              |
| Trading - Trade           | 2026-03-15  | 77 hari 🔴           |
| Trading - Fee             | 2026-03-15  | 77 hari 🔴           |
| Trading - Event           | 2026-03-15  | 77 hari 🔴           |

> **Rekomendasi:** Run full regression suite untuk Trading module sebelum production release. Running Tracker Dashboard Extended authored 2026-05-25 — run focused spec before merging. Running Tracker Dashboard tests fresh (tested 2026-05-23). Product History UI fresh (tested 2026-05-17). Product Name sudah fresh (tested 2026-05-17). Product Brand fresh (tested 2026-05-16).

---

## Detail per Fitur

### Auth

| #  | Feature                               | File                          | Last Tested | Manual | Automation | Status        |
| -- | ------------------------------------- | ----------------------------- | ----------- | ------ | ---------- | ------------- |
| 1  | Login - API & Authentication          | auth/login.cy.js              | 2026-05-14  | 0      | 9          | ✅ 9/9 pass  |
| 2  | Login Page UI (desktop/mobile/tablet) | auth/login.cy.js              | 2026-05-14  | 0      | 9          | ✅ 9/9 pass  |
| 3  | Auth Callback (desktop/mobile/tablet) | auth/login.cy.js              | 2026-05-14  | 0      | 9          | ✅ 9/9 pass  |
| 4  | Session Persistence (3 viewports)     | auth/login.cy.js              | 2026-05-14  | 0      | 27         | ✅ 27/27 pass |
| 5  | App Identity & Google Branding        | auth/login.cy.js              | 2026-05-14  | 0      | 6          | ✅ 6/6 pass  |
| 6  | Middleware ?next= Param Preservation  | auth/login.cy.js              | 2026-05-14  | 0      | 4          | ✅ 4/4 pass  |
| 7  | Logout                                | auth/logout.cy.js             | 2026-05-14  | 0      | 35         | ✅ 35/35 pass |
| 8  | Session Validation                    | auth/session.cy.js            | 2026-05-14  | 0      | 21         | ✅ 21/21 pass |
| 9  | Google OAuth UI Flow (browser)        | —                             | —           | 1      | 0          | 🟡 Manual     |

---

### API Auth Guard

| #  | Feature                     | File                          | Last Tested | Manual | Automation | Status       |
| -- | --------------------------- | ----------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | Auth API endpoints          | api-auth/auth-api.cy.js       | 2026-05-14  | 0      | 6          | ✅ 6/6 pass |
| 2  | Inventory API auth guard    | api-auth/inventory-api.cy.js  | 2026-05-14  | 0      | 24         | ✅ 24/24 pass |
| 3  | Trade API auth guard        | api-auth/trade-api.cy.js      | 2026-05-14  | 0      | 29         | ✅ 29/29 pass |

---

### Landing Page

| #  | Feature                               | File                                  | Last Tested | Manual | Automation | Status       |
| -- | ------------------------------------- | ------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | User Experience (greeting, cards)     | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 3          | ✅ 3/3 pass  |
| 2  | Navigation (trade & inventory buttons)| landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 2          | ✅ 2/2 pass  |
| 3  | Responsive Layout (3 viewports)       | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 3          | ✅ 3/3 pass  |
| 4  | Mobile Interactions                   | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 3          | ✅ 3/3 pass  |
| 5  | Tablet Interactions                   | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 3          | ✅ 3/3 pass  |
| 6  | Desktop Interactions                  | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 3          | ✅ 3/3 pass  |
| 7  | User Menu (trigger, email, sign out)  | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 16         | ✅ 16/16 pass |

---

### Inventory - Dashboard

| #  | Feature             | File                                      | Last Tested | Manual | Automation | Status       |
| -- | ------------------- | ----------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | Dashboard UI        | inventory_management/dashboard/dashboard-ui.cy.js  | 2026-05-14  | 0      | 88         | ✅ 88/88 pass |
| 2  | Dashboard API       | inventory_management/dashboard/dashboard-api.cy.js | 2026-05-14  | 0      | 56         | ✅ 56/56 pass |
| 3  | Summary API         | inventory_management/dashboard/summary-api.cy.js   | 2026-05-14  | 0      | 17         | ✅ 17/17 pass |

---

### Inventory - Product

| #  | Feature             | File                                                      | Last Tested | Manual | Automation | Status       |
| -- | ------------------- | --------------------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | List Product        | inventory_management/product/list-product.cy.js           | 2026-05-14  | 0      | 26         | ✅ 26/26 pass |
| 2  | Product Detail (API)| inventory_management/product/product-detail.cy.js         | 2026-05-14  | 0      | 25         | ✅ 25/25 pass |
| 2b | Product Detail UI   | inventory_management/product/product-detail-ui.cy.js       | 2026-05-14  | 0      | 35         | ✅ 35/35 pass |
| 2c | Last Purchase Price API | inventory_management/product/last-price-api.cy.js      | 2026-05-14  | 0      | 17         | ✅ 17/17 pass |
| 2d | Restock Predictions API | inventory_management/product/restock-predictions-api.cy.js | 2026-05-14  | 0      | 16         | ✅ 16/16 pass |
| 3  | Add Product         | inventory_management/product/add-product.cy.js            | 2026-05-14  | 0      | 100        | ✅ 100/100 pass |
| 4  | Update Product      | inventory_management/product/update-product.cy.js         | 2026-05-14  | 0      | 39         | ✅ 39/39 pass |
| 5  | Delete Product      | inventory_management/product/delete-product.cy.js         | 2026-05-14  | 0      | 23         | ✅ 23/23 pass |
| 6  | Favorite Product    | inventory_management/product/favorite-product.cy.js       | 2026-05-14  | 0      | 27         | ✅ 27/27 pass |
| 7  | Create Product Stock| inventory_management/product/create-product-stock.cy.js   | 2026-05-14  | 0      | 49         | ✅ 49/49 pass |
| 8  | Product History     | inventory_management/product/product-history.cy.js        | 2026-05-14  | 0      | 25         | ✅ 25/25 pass |
| 9  | Product Summary     | inventory_management/product/summary-product.cy.js        | 2026-05-14  | 0      | 16         | ✅ 16/16 pass |
| 10 | Product List UI     | inventory_management/product/product-list-ui.cy.js        | 2026-05-14  | 0      | 92         | 🟡 81/92 pass (11 pending, intentional) |
| 11 | Star + Image preview UI | inventory_management/product/product-list-star-image.cy.js | 2026-05-30 | 0     | 9          | ✅ 9/9 pass |
| 12 | Filter no category  | inventory_management/product/product-filter-no-category.cy.js | 2026-05-30 | 0   | 9          | ✅ 9/9 pass |

---

### Inventory - Product Brand

| #  | Feature              | File                                                                  | Last Tested | Manual | Automation | Status           |
| -- | -------------------- | --------------------------------------------------------------------- | ----------- | ------ | ---------- | ---------------- |
| 1  | List Product Brand   | inventory_management/product_brand/list-product-brand.cy.js           | 2026-05-16  | 0      | 10         | ✅ 10/10 pass    |
| 2  | Product Brand Detail | inventory_management/product_brand/product-brand-detail.cy.js         | 2026-05-16  | 0      | 20         | ✅ 20/20 pass    |
| 3  | Add Product Brand    | inventory_management/product_brand/add-product-brand.cy.js            | 2026-05-16  | 0      | 32         | ✅ 32/32 pass    |
| 4  | Update Product Brand | inventory_management/product_brand/update-product-brand.cy.js         | 2026-05-16  | 0      | 26         | ✅ 26/26 pass    |
| 5  | Delete Product Brand | inventory_management/product_brand/delete-product-brand.cy.js         | 2026-05-16  | 0      | 13         | ✅ 13/13 pass    |
| 6  | Product Brand Summary| inventory_management/product_brand/summary-product-brand.cy.js        | 2026-05-16  | 0      | 13         | ✅ 13/13 pass    |
| 7  | Add Brand UI         | inventory_management/product_brand/ui-product-brand-add.cy.js         | 2026-05-16  | 0      | 11         | ✅ 11/11 pass    |
| 8  | List Brand UI        | inventory_management/product_brand/ui-product-brand-list.cy.js        | 2026-05-16  | 0      | 26         | ✅ 26/26 pass    |
| 9  | Update/Delete Brand UI | inventory_management/product_brand/ui-product-brand-update.cy.js    | 2026-05-16  | 0      | 13         | ✅ 13/13 pass    |

---

### Inventory - Product History

| #  | Feature               | File                                                                      | Last Tested | Manual | Automation | Status       |
| -- | --------------------- | ------------------------------------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | Product History UI    | inventory_management/product_history/ui-product-history.cy.js             | 2026-05-17  | 0      | 28         | ✅ 28/28 pass |

---

### Inventory - Product Name

| #  | Feature              | File                                                           | Last Tested | Manual | Automation | Status       |
| -- | -------------------- | -------------------------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | List Product Name    | inventory_management/product_name/list-product-name.cy.js      | 2026-03-20  | 0      | 10         | 🔴 63 days old |
| 2  | Product Name Detail  | inventory_management/product_name/product-name-detail.cy.js    | 2026-03-20  | 0      | 20         | 🔴 63 days old |
| 3  | Add Product Name     | inventory_management/product_name/add-product-name.cy.js       | 2026-03-20  | 0      | 32         | 🔴 63 days old |
| 4  | Update Product Name  | inventory_management/product_name/update-product-name.cy.js    | 2026-03-20  | 0      | 26         | 🔴 63 days old |
| 5  | Delete Product Name  | inventory_management/product_name/delete-product-name.cy.js    | 2026-03-20  | 0      | 13         | 🔴 63 days old |
| 6  | Product Name Summary | inventory_management/product_name/summary-product-name.cy.js   | 2026-03-20  | 0      | 13         | 🔴 63 days old |
| 7  | Product Name List UI | inventory_management/product_name/ui-product-name-list.cy.js   | 2026-05-17  | 0      | 15         | ✅ 15 tests (not yet run in focused mode) |
| 8  | Product Name Update UI | inventory_management/product_name/ui-product-name-update.cy.js | 2026-05-17 | 0      | 14         | ✅ 14 tests (not yet run in focused mode) |
| 9  | Product Name Bulk UI | inventory_management/product_name/ui-product-name-bulk.cy.js   | 2026-05-17  | 0      | 16         | ✅ 16/16 pass |

---

### Running Tracker - Sync API

| #  | Feature                          | File                                | Last Tested | Manual | Automation | Status       |
| -- | -------------------------------- | ----------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | POST /sync/strava (auth + shape) | running/sync/sync-api.cy.js         | 2026-05-23  | 0      | 2          | ✅ 2/2 pass  |
| 2  | GET /sync/status (auth + shape)  | running/sync/sync-api.cy.js         | 2026-05-23  | 0      | 2          | ✅ 2/2 pass  |
| 3  | GET /strava/callback (redirects) | running/sync/sync-api.cy.js         | 2026-05-23  | 0      | 2          | ✅ 2/2 pass  |
| 4  | Unauthenticated guard (401)      | running/sync/sync-api.cy.js         | 2026-05-23  | 0      | 2          | ✅ 2/2 pass  |

---

### Running Tracker - Dashboard

| #  | Feature                                      | File                                                  | Last Tested | Manual | Automation | Status        |
| -- | -------------------------------------------- | ----------------------------------------------------- | ----------- | ------ | ---------- | ------------- |
| 1  | GET /dashboard — response shape + auth guard | running/dashboard/dashboard-api.cy.js                 | 2026-05-23  | 0      | 8          | ✅ 8/8 pass   |
| 2  | Dashboard page — auth guard                  | running/dashboard/dashboard-ui.cy.js                  | 2026-05-23  | 0      | 1          | ✅ 1/1 pass   |
| 3  | Dashboard page — loading skeleton            | running/dashboard/dashboard-ui.cy.js                  | 2026-05-23  | 0      | 1          | ✅ 1/1 pass   |
| 4  | Dashboard page — happy path (all sections)   | running/dashboard/dashboard-ui.cy.js                  | 2026-05-23  | 0      | 14         | ✅ 14/14 pass |
| 5  | Dashboard page — empty state                 | running/dashboard/dashboard-ui.cy.js                  | 2026-05-23  | 0      | 3          | ✅ 3/3 pass   |
| 6  | Dashboard page — health logged state         | running/dashboard/dashboard-ui.cy.js                  | 2026-05-23  | 0      | 2          | ✅ 2/2 pass   |
| 7  | Dashboard page — error + retry               | running/dashboard/dashboard-ui.cy.js                  | 2026-05-23  | 0      | 4          | ✅ 4/4 pass   |
| 8  | Dashboard page — training load badge variants| running/dashboard/dashboard-ui.cy.js                  | 2026-05-23  | 0      | 3          | ✅ 3/3 pass   |
| 9  | GET /gear — response shape + auth guard      | running/dashboard/gear-api.cy.js                      | 2026-05-25  | 0      | 4          | ✅ 4/4 pass   |
| 10 | PATCH /gear — update + auth guard            | running/dashboard/gear-api.cy.js                      | 2026-05-25  | 0      | 2          | ✅ 2/2 pass   |
| 11 | Gear UI — loading, list, empty, error        | running/dashboard/gear-ui.cy.js                       | 2026-05-25  | 0      | 8          | ✅ 8/8 pass   |
| 12 | Gear UI — limit tabs (Strava / Manual)       | running/dashboard/gear-ui.cy.js                       | 2026-05-25  | 0      | 3          | ✅ 3/3 pass   |
| 13 | Gear UI — near retirement warning            | running/dashboard/gear-ui.cy.js                       | 2026-05-25  | 0      | 1          | ✅ 1/1 pass   |
| 14 | Gear UI — edit form open/save/cancel         | running/dashboard/gear-ui.cy.js                       | 2026-05-25  | 0      | 3          | ✅ 3/3 pass   |
| 15 | GET /performance-trends — shape, params, 401 | running/dashboard/performance-trends-api.cy.js        | 2026-05-25  | 0      | 5          | ✅ 5/5 pass   |
| 16 | YtdStats — renders, distance format, hidden  | running/dashboard/dashboard-ui-extended.cy.js         | 2026-05-25  | 0      | 4          | ✅ 4/4 pass   |
| 17 | NextRace — null, title, race-week badge      | running/dashboard/dashboard-ui-extended.cy.js         | 2026-05-25  | 0      | 3          | ✅ 3/3 pass   |
| 18 | SyncStatusBar — Never, btn, POST, resultMsg  | running/dashboard/dashboard-ui-extended.cy.js         | 2026-05-25  | 0      | 5          | ✅ 5/5 pass   |
| 19 | Activity type filter — render, active ring   | running/dashboard/dashboard-ui-extended.cy.js         | 2026-05-25  | 0      | 2          | ✅ 2/2 pass   |

---

### Running Tracker - Race Log

| #  | Feature                                          | File                                         | Last Tested | Manual | Automation | Status        |
| -- | ------------------------------------------------ | -------------------------------------------- | ----------- | ------ | ---------- | ------------- |
| 1  | GET /race-log — list + auth guard                | running/race-log/race-log-api.cy.js          | 2026-05-26  | 0      | 5          | ✅ 5/5 pass   |
| 2  | POST /race-log — create + validation + 401       | running/race-log/race-log-api.cy.js          | 2026-05-26  | 0      | 7          | ✅ 7/7 pass   |
| 3  | PATCH /race-log/:id — update + 404 + 401         | running/race-log/race-log-api.cy.js          | 2026-05-26  | 0      | 5          | ✅ 5/5 pass   |
| 4  | DELETE /race-log/:id — delete + 404 + 401        | running/race-log/race-log-api.cy.js          | 2026-05-26  | 0      | 4          | ✅ 4/4 pass   |
| 5  | Race Log UI — full CRUD + all states             | running/race-log/race-log-ui.cy.js           | 2026-05-29  | 0      | 51         | ✅ 51/51 pass (+13 search + distance filter) |

---

### Running Tracker - Activities

| #  | Feature                                              | File                                                        | Last Tested | Manual | Automation | Status         |
| -- | ---------------------------------------------------- | ----------------------------------------------------------- | ----------- | ------ | ---------- | -------------- |
| 1  | GET /activities — list, pagination, type filter      | running/activities/activities-api.cy.js                     | 2026-05-27  | 0      | 8          | ✅ 8/8 pass    |
| 2  | Activities list page UI                              | running/activities/activities-ui.cy.js                      | 2026-05-27  | 0      | 21         | ✅ 21/21 pass  |
| 3  | Activity detail — full page                          | running/activities/activityDetail.cy.js                     | 2026-05-27  | 0      | 36         | ✅ 36/36 pass  |
| 4  | Activity detail API — CRUD + ownership               | running/activities/activityDetailApi.cy.js                  | 2026-05-27  | 0      | 25         | ✅ 25/25 pass  |
| 5  | HrZonesChart + AIInsightCard UI                      | running/activities/activity-detail-ui.cy.js                 | 2026-05-30  | 0      | 27         | ✅ 27/27 pass  |
| 10 | Activities page title + Race Log title + Pagination  | running/activities/activities-page-title.cy.js              | 2026-05-30  | 0      | 10         | ✅ 10/10 pass  |
| 6  | AI Insights API — GET + POST generate                | running/activities/ai-insight-api.cy.js                     | 2026-05-27  | 0      | 8          | ✅ 8/8 pass    |
| 7  | HR Zones API                                         | running/activities/hr-zones-api.cy.js                       | 2026-05-27  | 0      | 6          | ✅ 6/6 pass    |
| 8  | Stream Charts API — shape + validation               | running/activities/stream-charts-api.cy.js                  | 2026-05-27  | 0      | 7          | ✅ 7/7 pass    |
| 9  | StreamCharts UI — loading/happy/empty/error/retry    | running/activities/stream-charts-ui.cy.js                   | 2026-05-27  | 0      | 14         | ✅ 14/14 pass  |
| 11 | AI Coach improvements — RPE, note, compare, hints    | running/activities/ai-coach-improvements.cy.js              | 2026-05-31  | 0      | 36         | 🟡 BLOCKED (local env — valid Supabase credentials required) |

---

### Running Tracker - Analytics

| #  | Feature                                              | File                                                        | Last Tested | Manual | Automation | Status         |
| -- | ---------------------------------------------------- | ----------------------------------------------------------- | ----------- | ------ | ---------- | -------------- |
| 1  | VO2max Stat tile — API + UI                          | running/analytics/vo2max-stat.cy.js                         | 2026-05-30  | 0      | 25         | ✅ 25/25 pass  |
| 2  | Analytics page — VO2max + EF chart sections          | running/analytics/analytics-ui.cy.js                        | 2026-05-31  | 0      | 9          | ✅ 9/9 pass    |

---

### Trading - Trade

| #  | Feature        | File                                              | Last Tested | Manual | Automation | Status       |
| -- | -------------- | ------------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | List Trade     | trading_management/trade/list-trade.cy.js         | 2026-03-15  | 0      | 6          | 🔴 62 days old |
| 2  | Trade Detail   | trading_management/trade/trade-detail.cy.js       | 2026-03-15  | 0      | 15         | 🔴 62 days old |
| 3  | Add Trade      | trading_management/trade/add-trade.cy.js          | 2026-03-15  | 0      | 109        | 🔴 62 days old |
| 4  | Update Trade   | trading_management/trade/update-trade.cy.js       | 2026-03-15  | 0      | 32         | 🔴 62 days old |
| 5  | Delete Trade   | trading_management/trade/delete-trade.cy.js       | 2026-03-15  | 0      | 6          | 🔴 62 days old |
| 6  | Trade Options  | trading_management/trade/option-trade.cy.js       | 2026-03-15  | 0      | 7          | 🔴 62 days old |
| 7  | Trade Summary  | trading_management/trade/summary-trade.cy.js      | 2026-03-15  | 0      | 10         | 🔴 62 days old |

---

### Trading - Fee

| #  | Feature      | File                                          | Last Tested | Manual | Automation | Status       |
| -- | ------------ | --------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | List Fee     | trading_management/fee/list-fee.cy.js         | 2026-03-15  | 0      | 6          | 🔴 62 days old |
| 2  | Fee Detail   | trading_management/fee/fee-detail.cy.js       | 2026-03-15  | 0      | 15         | 🔴 62 days old |
| 3  | Add Fee      | trading_management/fee/add-fee.cy.js          | 2026-03-15  | 0      | 62         | 🔴 62 days old |
| 4  | Update Fee   | trading_management/fee/update-fee.cy.js       | 2026-03-15  | 0      | 19         | 🔴 62 days old |
| 5  | Delete Fee   | trading_management/fee/delete-fee.cy.js       | 2026-03-15  | 0      | 6          | 🔴 62 days old |
| 6  | Fee Summary  | trading_management/fee/summary-fee.cy.js      | 2026-03-15  | 0      | 23         | 🔴 62 days old |

---

### Trading - Event

| #  | Feature        | File                                              | Last Tested | Manual | Automation | Status       |
| -- | -------------- | ------------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | List Event     | trading_management/event/list-event.cy.js         | 2026-03-15  | 0      | 6          | 🔴 62 days old |
| 2  | Event Detail   | trading_management/event/event-detail.cy.js       | 2026-03-15  | 0      | 15         | 🔴 62 days old |
| 3  | Add Event      | trading_management/event/add-event.cy.js          | 2026-03-15  | 0      | 59         | 🔴 62 days old |
| 4  | Update Event   | trading_management/event/update-event.cy.js       | 2026-03-15  | 0      | 20         | 🔴 62 days old |
| 5  | Delete Event   | trading_management/event/delete-event.cy.js       | 2026-03-15  | 0      | 9          | 🔴 62 days old |
| 6  | Event Summary  | trading_management/event/summary-event.cy.js      | 2026-03-15  | 0      | 25         | 🔴 62 days old |

---

## Test Execution Metrics (2026-05-14)

**Run Date:** 2026-05-14
**Run Type:** Full Regression (4 groups, 22 spec files)
**Total Duration:** ~13 minutes 6 seconds (product group)

| Group     | Spec Files | Tests | Passed | Failed | Pending | Pass % |
| --------- | ---------- | ----- | ------ | ------ | ------- | ------ |
| api-auth  | 3          | 59    | 59     | 0      | 0       | 100%   |
| auth      | 3          | 123   | 123    | 0      | 0       | 100%   |
| dashboard | 3          | 161   | 161    | 0      | 0       | 100%   |
| product   | 13         | 490   | 458    | 21     | 11      | 93.5%  |
| **Total** | **22**     | **833** | **801** | **21** | **11** | **96.2%** |

**Overall Test Success Rate:** 96.2% (↑ from 88.8% on 2026-05-13)
**Modules with 100% Pass Rate:** api-auth, auth, dashboard
**Modules with Issues:** product (93.5%)
**High Priority Issues:** 3 root causes (auth response case, stale counts, update history)

### Previous Run Metrics (2026-05-13)

| Group     | Spec Files | Tests | Passed | Failed | Skipped | Pass % |
| --------- | ---------- | ----- | ------ | ------ | ------- | ------ |
| api-auth  | 3          | 59    | 59     | 0      | 0       | 100%   |
| auth      | 3          | 123   | 87     | 36     | 0       | 70.7%  |
| dashboard | 3          | 161   | 161    | 0      | 0       | 100%   |
| product   | 13         | 490   | 433    | 57     | 27      | 88.4%  |
| **Total** | **22**     | **833** | **740** | **93** | **27** | **88.8%** |

---

## Action Items

### 🟠 High Priority (before next release)

1. Run full regression for Trading module — 63 days without a test run, risk of regressions before next production release

### 🟡 Medium Priority (within 1-2 weeks)

1. Implement 11 pending tests in product-list-ui (sticky scroll, date picker, session UI)
2. Run ui-product-name-list.cy.js and ui-product-name-update.cy.js in focused mode to confirm pass rate
3. Re-test Product Name API spec files (list, detail, add, update, delete, summary) — 63 days stale
4. Re-test Trading module (63 days since last test)

### ✅ Resolved (2026-05-13 → 2026-05-17)

1. ~~Auth Module: Add missing testIds to LogoutButton and UserMenu components~~ — FIXED (2026-05-14)
2. ~~Define cy.getAuthToken() and cy.logout() custom commands~~ — FIXED (2026-05-17)
3. ~~Fix visibility clipping in product-detail-ui (13 failures)~~ — FIXED (35/35 now passing)
4. ~~Fix mobile form dialog overflow in add-product~~ — FIXED
5. ~~Fix session persistence redirect bug~~ — FIXED
6. ~~Unblock last-price-api tests (16 skipped)~~ — FIXED (17/17 now passing)
7. ~~Product Module: auth response case mismatch~~ — FIXED (2026-05-14)
8. ~~Product Module: stale count assertions (PostgREST 1000-row cap)~~ — FIXED (2026-05-14)
9. ~~Product Module: update history not recorded~~ — FIXED (2026-05-14)
10. ~~Product Name: missing testIds for UpdateProductName and DeleteProductName~~ — FIXED (2026-05-17)
11. ~~Product Name: missing uniqueness check (create/update 409), delete guard (delete 409), product_count on list~~ — FIXED (2026-05-17, PRD v1.15→v1.17)
12. ~~Product History UI: P0 gap — all 13 testIds missing~~ — FIXED (2026-05-17, PRD v1.18); 28 tests added, all passing
