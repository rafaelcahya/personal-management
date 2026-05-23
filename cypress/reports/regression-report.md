# Regression Testing Report

**Date:** 2026-05-23
**App Version:** 1.20
**Scope:** Running Tracker Strava Sync API — focused run (1 new spec file)
**Tester:** QA Agent

## Summary (2026-05-23 Focused Run)

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

| Date       | Feature                   | Tests | Passed | Pending | Failed | Pass Rate |
| ---------- | ------------------------- | ----- | ------ | ------- | ------ | --------- |
| 2026-05-23 | Running Tracker Strava Sync API | 8 | 8      | 0       | 0      | 100%        |
| 2026-05-20 | Running Tracker Onboarding | 52   | 51     | 1       | 0      | 100% active |
| 2026-05-17 | Product History UI        | 28    | 28     | 0       | 0      | 100%      |
| 2026-05-17 | Product Name UI (bulk)    | 16    | 16     | 0       | 0      | 100%      |
| 2026-05-16 | Product Brand UI          | 50    | 50     | 0       | 0      | 100%      |
| 2026-05-14 | Full Regression (4 groups)| 833   | 822    | 11      | 0      | 100% active |
