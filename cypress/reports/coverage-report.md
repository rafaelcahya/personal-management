# Test Coverage Report

**Last Updated:** 2026-05-16 (Focused run: Product Brand UI — 3 new spec files, 50 tests)
**App Version:** 1.13

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
| Inventory - Product Name        | 6              | 6         | 0           | 0          | 100%       | 114        |
| Trading - Trade                 | 7              | 7         | 0           | 0          | 100%       | 185        |
| Trading - Fee                   | 6              | 6         | 0           | 0          | 100%       | 131        |
| Trading - Event                 | 6              | 6         | 0           | 0          | 100%       | 134        |
| **Total**                       | **94**         | **93**    | **1**       | **0**      | **99%**    | **1,592**  |

> **Note (2026-05-16):** Product Brand UI tests added — 3 new spec files (ui-product-brand-add, ui-product-brand-list, ui-product-brand-update), 50 new tests, all 50 passing. Grand total Product Brand: 164 tests across 9 spec files. Total test cases (recounted from table): 1,592.

> **Note (2026-05-14 final):** All active tests passing — 822/822 (100% active, 98.7% incl. pending). All 21 failures from initial run resolved: backend history payload fixed, summary/list API count cap fixed (PostgREST max_rows), auth assertion case-insensitive, DB helper rewritten with exact count queries. 11 pending remain in product-list-ui (intentional placeholders).

> **Note (2026-05-13):** Full regression run completed for 4 groups: api-auth (59 tests), auth (123 tests), dashboard (161 tests), product (490 tests). Total 833 tests executed. Issues found in auth (testId missing), product module (cy.getAuthToken() undefined), and product-detail-ui (visibility clipping).

## Last Execution Results (2026-05-16 Focused Run: Product Brand UI)

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

**Total Automated Test Cases: 1,592** (added 50 new tests in v1.13 for ui-product-brand-add, ui-product-brand-list, ui-product-brand-update; total recounted from table — previous figure of 1,712 was inaccurate)

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

### Known Issues Requiring Fixes (as of 2026-05-14)

1. **Product Module — Auth Response Case Mismatch** (9 failures)
   - API returns `{ message: 'UNAUTHORIZED' }` but tests assert `'Unauthorized'`
   - Affects all product API auth tests (9 spec files, 1 test each)
   - Fix: align API response to title-case OR update 9 test assertions

2. **Product Module — Stale Count Assertions** (8 failures)
   - Tests hardcode expected counts (e.g., 1001) but API caps at 1000 items
   - DB has grown past 1000 records, causing count divergence
   - Affects: add-product, list-product, summary-product, favorite-product
   - Fix: use delta-based count assertions or add test data isolation

3. **Product Module — Update History Not Recorded** (3 failures)
   - `update-product.cy.js`: usage history table has 0 records, tests expect 2
   - Fix: verify history write logic in update API service

4. **Product List UI — 11 Pending Tests** (intentional)
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
