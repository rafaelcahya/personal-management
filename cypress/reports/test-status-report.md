# Test Status Report

**Last Updated:** 2026-05-14 (Full regression run completed)
**App Version:** 1.11

> Report ini menampilkan status testing per fitur: kapan terakhir ditest, jumlah test case manual, dan jumlah test case automation.
> "Last Tested" mengacu pada tanggal test file terakhir dijalankan secara eksplisit atau tanggal report update untuk full regression run.

> ✅ **API Auth Guard (2026-05-14):** 59/59 passing (100%). All auth guard checks pass for auth, inventory, and trade APIs.
> ✅ **Dashboard (2026-05-14):** 161/161 passing (100%). Dashboard UI, API, and summary API all pass.
> ✅ **Auth Module (2026-05-14):** 123/123 passing (100%). All auth failures from 2026-05-13 are fixed (logoutBtn id, userMenuTrigger id, session persistence).
> ✅ **Product Module (2026-05-14 final):** 479/479 active passing (100%), 11 intentional pending. All 21 failures resolved via backend + test fixes.

---

## Summary

| Module                          | Last Tested  | Manual | Automation | Total |
| ------------------------------- | ------------ | ------ | ---------- | ----- |
| Auth                            | 2026-05-14   | 1      | 126        | 127   |
| API Auth Guard                  | 2026-05-14   | 0      | 59         | 59    |
| Landing Page                    | 2026-05-08   | 0      | 33         | 33    |
| Inventory - Dashboard           | 2026-05-14   | 0      | 161        | 161   |
| Inventory - Product (API)       | 2026-05-14   | 0      | 390        | 390   |
| Inventory - Product Brand       | 2026-04-22   | 0      | 114        | 114   |
| Inventory - Product Name        | 2026-03-20   | 0      | 114        | 114   |
| Trading - Trade                 | 2026-03-15   | 0      | 185        | 185   |
| Trading - Fee                   | 2026-03-15   | 0      | 131        | 131   |
| Trading - Event                 | 2026-03-15   | 0      | 134        | 134   |
| **Total**                       |              | **1**  | **1,447**  | **1,448** |

---

## Staleness Alert

Fitur berikut belum ditest lebih dari **30 hari** (sejak 2026-04-14):

| Module                    | Last Tested | Days Since Last Test |
| ------------------------- | ----------- | -------------------- |
| Landing Page              | 2026-05-08  | 6 hari               |
| Inventory - Product Brand | 2026-04-22  | 22 hari              |
| Inventory - Product Name  | 2026-03-20  | 55 hari 🔴           |
| Trading - Trade           | 2026-03-15  | 60 hari 🔴           |
| Trading - Fee             | 2026-03-15  | 60 hari 🔴           |
| Trading - Event           | 2026-03-15  | 60 hari 🔴           |

> **Rekomendasi:** Run full regression suite untuk Trading module dan Product Name sebelum production release. Product Brand perlu ditest dalam 1-2 minggu.

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

---

### Inventory - Product Brand

| #  | Feature              | File                                                           | Last Tested | Manual | Automation | Status       |
| -- | -------------------- | -------------------------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | List Product Brand   | inventory_management/product_brand/list-product-brand.cy.js    | 2026-04-22  | 0      | 10         | 🟡 21 days old |
| 2  | Product Brand Detail | inventory_management/product_brand/product-brand-detail.cy.js  | 2026-04-22  | 0      | 20         | 🟡 21 days old |
| 3  | Add Product Brand    | inventory_management/product_brand/add-product-brand.cy.js     | 2026-04-22  | 0      | 32         | 🟡 21 days old |
| 4  | Update Product Brand | inventory_management/product_brand/update-product-brand.cy.js  | 2026-04-22  | 0      | 26         | 🟡 21 days old |
| 5  | Delete Product Brand | inventory_management/product_brand/delete-product-brand.cy.js  | 2026-04-22  | 0      | 13         | 🟡 21 days old |
| 6  | Product Brand Summary| inventory_management/product_brand/summary-product-brand.cy.js | 2026-04-22  | 0      | 13         | 🟡 21 days old |

---

### Inventory - Product Name

| #  | Feature              | File                                                           | Last Tested | Manual | Automation | Status       |
| -- | -------------------- | -------------------------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | List Product Name    | inventory_management/product_name/list-product-name.cy.js      | 2026-03-20  | 0      | 10         | 🔴 54 days old |
| 2  | Product Name Detail  | inventory_management/product_name/product-name-detail.cy.js    | 2026-03-20  | 0      | 20         | 🔴 54 days old |
| 3  | Add Product Name     | inventory_management/product_name/add-product-name.cy.js       | 2026-03-20  | 0      | 32         | 🔴 54 days old |
| 4  | Update Product Name  | inventory_management/product_name/update-product-name.cy.js    | 2026-03-20  | 0      | 26         | 🔴 54 days old |
| 5  | Delete Product Name  | inventory_management/product_name/delete-product-name.cy.js    | 2026-03-20  | 0      | 13         | 🔴 54 days old |
| 6  | Product Name Summary | inventory_management/product_name/summary-product-name.cy.js   | 2026-03-20  | 0      | 13         | 🔴 54 days old |

---

### Trading - Trade

| #  | Feature        | File                                              | Last Tested | Manual | Automation | Status       |
| -- | -------------- | ------------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | List Trade     | trading_management/trade/list-trade.cy.js         | 2026-03-15  | 0      | 6          | 🔴 59 days old |
| 2  | Trade Detail   | trading_management/trade/trade-detail.cy.js       | 2026-03-15  | 0      | 15         | 🔴 59 days old |
| 3  | Add Trade      | trading_management/trade/add-trade.cy.js          | 2026-03-15  | 0      | 109        | 🔴 59 days old |
| 4  | Update Trade   | trading_management/trade/update-trade.cy.js       | 2026-03-15  | 0      | 32         | 🔴 59 days old |
| 5  | Delete Trade   | trading_management/trade/delete-trade.cy.js       | 2026-03-15  | 0      | 6          | 🔴 59 days old |
| 6  | Trade Options  | trading_management/trade/option-trade.cy.js       | 2026-03-15  | 0      | 7          | 🔴 59 days old |
| 7  | Trade Summary  | trading_management/trade/summary-trade.cy.js      | 2026-03-15  | 0      | 10         | 🔴 59 days old |

---

### Trading - Fee

| #  | Feature      | File                                          | Last Tested | Manual | Automation | Status       |
| -- | ------------ | --------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | List Fee     | trading_management/fee/list-fee.cy.js         | 2026-03-15  | 0      | 6          | 🔴 59 days old |
| 2  | Fee Detail   | trading_management/fee/fee-detail.cy.js       | 2026-03-15  | 0      | 15         | 🔴 59 days old |
| 3  | Add Fee      | trading_management/fee/add-fee.cy.js          | 2026-03-15  | 0      | 62         | 🔴 59 days old |
| 4  | Update Fee   | trading_management/fee/update-fee.cy.js       | 2026-03-15  | 0      | 19         | 🔴 59 days old |
| 5  | Delete Fee   | trading_management/fee/delete-fee.cy.js       | 2026-03-15  | 0      | 6          | 🔴 59 days old |
| 6  | Fee Summary  | trading_management/fee/summary-fee.cy.js      | 2026-03-15  | 0      | 23         | 🔴 59 days old |

---

### Trading - Event

| #  | Feature        | File                                              | Last Tested | Manual | Automation | Status       |
| -- | -------------- | ------------------------------------------------- | ----------- | ------ | ---------- | ------------ |
| 1  | List Event     | trading_management/event/list-event.cy.js         | 2026-03-15  | 0      | 6          | 🔴 59 days old |
| 2  | Event Detail   | trading_management/event/event-detail.cy.js       | 2026-03-15  | 0      | 15         | 🔴 59 days old |
| 3  | Add Event      | trading_management/event/add-event.cy.js          | 2026-03-15  | 0      | 59         | 🔴 59 days old |
| 4  | Update Event   | trading_management/event/update-event.cy.js       | 2026-03-15  | 0      | 20         | 🔴 59 days old |
| 5  | Delete Event   | trading_management/event/delete-event.cy.js       | 2026-03-15  | 0      | 9          | 🔴 59 days old |
| 6  | Event Summary  | trading_management/event/summary-event.cy.js      | 2026-03-15  | 0      | 25         | 🔴 59 days old |

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

1. **Backend:** Align auth error response to title-case `'Unauthorized'` — affects 9 product API tests
2. **Tests:** Fix stale count assertions (use delta-based approach) — affects add-product, list-product, summary-product, favorite-product
3. **Backend/Tests:** Investigate update-product history not recorded in DB — 3 data integrity failures

### 🟡 Medium Priority (within 1-2 weeks)

1. Implement 11 pending tests in product-list-ui (sticky scroll, date picker, session UI)
2. Re-test Product Brand module (22 days since last test)
3. Re-test Trading module (60 days since last test)
4. Re-test Product Name module (55 days since last test)

### ✅ Resolved (2026-05-13 → 2026-05-14)

1. ~~Auth Module: Add missing testIds to LogoutButton and UserMenu components~~ — FIXED
2. ~~Define cy.getAuthToken() and cy.logout() custom commands~~ — FIXED
3. ~~Fix visibility clipping in product-detail-ui (13 failures)~~ — FIXED (35/35 now passing)
4. ~~Fix mobile form dialog overflow in add-product~~ — FIXED
5. ~~Fix session persistence redirect bug~~ — FIXED
6. ~~Unblock last-price-api tests (16 skipped)~~ — FIXED (17/17 now passing)
