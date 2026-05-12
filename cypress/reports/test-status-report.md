# Test Status Report

**Last Updated:** 2026-05-12 (v1.11 Product List UI + Product Detail UI tests)
**App Version:** 1.11

> Report ini menampilkan status testing per fitur: kapan terakhir ditest, jumlah test case manual, dan jumlah test case automation.
> "Last Tested" mengacu pada tanggal test file terakhir dijalankan secara eksplisit, atau tanggal commit terakhir sebagai proxy.

> ✅ **Dashboard UI (2026-05-09 Run #3):** 88/88 passing (100%). Semua test pass setelah fix `.scrollIntoView()` dan koreksi text mismatch pada section "Average Usage Duration".
> ✅ **Product List UI (2026-05-10):** 56 new UI tests added for v1.9/v1.10 changes (sticky controls, Edit Product dialog, Record Usage, Usage Log, mobile layout, language).
> 🆕 **Product List UI v1.11 (2026-05-12):** 46 new tests added for Summary Cards clickable, Column Sorting, Category Filter, Last Purchase Price hint, Recent Purchases, Note display, Restock Prediction.
> 🆕 **Product Detail UI v1.11 (2026-05-12):** 38 new tests added for page load, status badge, 4 stat cards, purchase history, usage history, loading/error states.

---

## Summary

| Module                          | Last Tested  | Manual | Automation | Total |
| ------------------------------- | ------------ | ------ | ---------- | ----- |
| Auth                            | 2026-05-08   | 1      | 126        | 127   |
| API Auth Guard                  | 2026-05-04   | 0      | 59         | 59    |
| Landing Page                    | 2026-05-08   | 0      | 33         | 33    |
| Inventory - Dashboard           | 2026-05-09   | 0      | 161        | 161   |
| Inventory - Product (API)       | 2026-05-12   | 0      | 355        | 355   |
| Inventory - Product List UI     | 2026-05-12   | 0      | 102        | 102   |
| Inventory - Product Detail UI   | 2026-05-12   | 0      | 38         | 38    |
| Inventory - Product Brand       | 2026-04-22   | 0      | 114        | 114   |
| Inventory - Product Name        | 2026-03-20   | 0      | 114        | 114   |
| Trading - Trade                 | 2026-03-15   | 0      | 185        | 185   |
| Trading - Fee                   | 2026-03-15   | 0      | 131        | 131   |
| Trading - Event                 | 2026-03-15   | 0      | 134        | 134   |
| **Total**                       |              | **1**  | **1.548**  | **1.549** |

---

## Detail per Fitur

### Auth

| #  | Feature                               | File                          | Last Tested | Manual | Automation |
| -- | ------------------------------------- | ----------------------------- | ----------- | ------ | ---------- |
| 1  | Login - API & Authentication          | auth/login.cy.js              | 2026-05-07  | 0      | 9          |
| 2  | Login Page UI (desktop/mobile/tablet) | auth/login.cy.js              | 2026-05-07  | 0      | 9          |
| 3  | Auth Callback (desktop/mobile/tablet) | auth/login.cy.js              | 2026-05-07  | 0      | 9          |
| 4  | Session Persistence (3 viewports)     | auth/login.cy.js              | 2026-05-07  | 0      | 27         |
| 5  | App Identity & Google Branding        | auth/login.cy.js              | 2026-05-07  | 0      | 6          |
| 6  | Middleware ?next= Param Preservation  | auth/login.cy.js              | 2026-05-07  | 0      | 4          |
| 7  | Logout                                | auth/logout.cy.js             | 2026-05-08  | 0      | 35         |
| 8  | Session Validation                    | auth/session.cy.js            | 2026-05-07  | 0      | 21         |
| 9  | Google OAuth UI Flow (browser)        | —                             | —           | 1      | 0          |

---

### API Auth Guard

| #  | Feature                     | File                          | Last Tested | Manual | Automation |
| -- | --------------------------- | ----------------------------- | ----------- | ------ | ---------- |
| 1  | Auth API endpoints          | api-auth/auth-api.cy.js       | 2026-05-04  | 0      | 6          |
| 2  | Inventory API auth guard    | api-auth/inventory-api.cy.js  | 2026-05-04  | 0      | 24         |
| 3  | Trade API auth guard        | api-auth/trade-api.cy.js      | 2026-05-04  | 0      | 29         |

---

### Landing Page

| #  | Feature                               | File                                  | Last Tested | Manual | Automation |
| -- | ------------------------------------- | ------------------------------------- | ----------- | ------ | ---------- |
| 1  | User Experience (greeting, cards)     | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 3          |
| 2  | Navigation (trade & inventory buttons)| landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 2          |
| 3  | Responsive Layout (3 viewports)       | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 3          |
| 4  | Mobile Interactions                   | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 3          |
| 5  | Tablet Interactions                   | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 3          |
| 6  | Desktop Interactions                  | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 3          |
| 7  | User Menu (trigger, email, sign out)  | landing_page/landing-page.cy.js       | 2026-05-08  | 0      | 16         |

---

### Inventory - Dashboard

| #  | Feature             | File                                      | Last Tested | Manual | Automation |
| -- | ------------------- | ----------------------------------------- | ----------- | ------ | ---------- |
| 1  | Dashboard UI        | inventory_management/dashboard/dashboard-ui.cy.js  | 2026-05-09  | 0      | 88         |
| 2  | Dashboard API       | inventory_management/dashboard/dashboard-api.cy.js | 2026-05-09  | 0      | 56         |
| 3  | Summary API         | inventory_management/dashboard/summary-api.cy.js   | 2026-05-05  | 0      | 17         |

---

### Inventory - Product

| #  | Feature             | File                                                      | Last Tested | Manual | Automation |
| -- | ------------------- | --------------------------------------------------------- | ----------- | ------ | ---------- |
| 1  | List Product        | inventory_management/product/list-product.cy.js           | 2026-03-20  | 0      | 26         |
| 2  | Product Detail (API)| inventory_management/product/product-detail.cy.js         | 2026-03-20  | 0      | 25         |
| 2b | Product Detail UI   | inventory_management/product/product-detail-ui.cy.js       | 2026-05-12  | 0      | 38         |
| 2c | Last Purchase Price API | inventory_management/product/last-price-api.cy.js      | 2026-05-12  | 0      | 13         |
| 2d | Restock Predictions API | inventory_management/product/restock-predictions-api.cy.js | 2026-05-12  | 0      | 17         |
| 3  | Add Product         | inventory_management/product/add-product.cy.js            | 2026-03-20  | 0      | 100        |
| 4  | Update Product      | inventory_management/product/update-product.cy.js         | 2026-03-20  | 0      | 39         |
| 5  | Delete Product      | inventory_management/product/delete-product.cy.js         | 2026-03-20  | 0      | 23         |
| 6  | Favorite Product    | inventory_management/product/favorite-product.cy.js       | 2026-03-20  | 0      | 27         |
| 7  | Create Product Stock| inventory_management/product/create-product-stock.cy.js   | 2026-03-20  | 0      | 40         |
| 8  | Product History     | inventory_management/product/product-history.cy.js        | 2026-03-20  | 0      | 25         |
| 9  | Product Summary     | inventory_management/product/summary-product.cy.js        | 2026-03-20  | 0      | 16         |

---

### Inventory - Product Brand

| #  | Feature              | File                                                           | Last Tested | Manual | Automation |
| -- | -------------------- | -------------------------------------------------------------- | ----------- | ------ | ---------- |
| 1  | List Product Brand   | inventory_management/product_brand/list-product-brand.cy.js    | 2026-04-22  | 0      | 10         |
| 2  | Product Brand Detail | inventory_management/product_brand/product-brand-detail.cy.js  | 2026-04-22  | 0      | 20         |
| 3  | Add Product Brand    | inventory_management/product_brand/add-product-brand.cy.js     | 2026-04-22  | 0      | 32         |
| 4  | Update Product Brand | inventory_management/product_brand/update-product-brand.cy.js  | 2026-04-22  | 0      | 26         |
| 5  | Delete Product Brand | inventory_management/product_brand/delete-product-brand.cy.js  | 2026-04-22  | 0      | 13         |
| 6  | Product Brand Summary| inventory_management/product_brand/summary-product-brand.cy.js | 2026-04-22  | 0      | 13         |

---

### Inventory - Product Name

| #  | Feature              | File                                                           | Last Tested | Manual | Automation |
| -- | -------------------- | -------------------------------------------------------------- | ----------- | ------ | ---------- |
| 1  | List Product Name    | inventory_management/product_name/list-product-name.cy.js      | 2026-03-20  | 0      | 10         |
| 2  | Product Name Detail  | inventory_management/product_name/product-name-detail.cy.js    | 2026-03-20  | 0      | 20         |
| 3  | Add Product Name     | inventory_management/product_name/add-product-name.cy.js       | 2026-03-20  | 0      | 32         |
| 4  | Update Product Name  | inventory_management/product_name/update-product-name.cy.js    | 2026-03-20  | 0      | 26         |
| 5  | Delete Product Name  | inventory_management/product_name/delete-product-name.cy.js    | 2026-03-20  | 0      | 13         |
| 6  | Product Name Summary | inventory_management/product_name/summary-product-name.cy.js   | 2026-03-20  | 0      | 13         |

---

### Trading - Trade

| #  | Feature        | File                                              | Last Tested | Manual | Automation |
| -- | -------------- | ------------------------------------------------- | ----------- | ------ | ---------- |
| 1  | List Trade     | trading_management/trade/list-trade.cy.js         | 2026-03-15  | 0      | 6          |
| 2  | Trade Detail   | trading_management/trade/trade-detail.cy.js       | 2026-03-15  | 0      | 15         |
| 3  | Add Trade      | trading_management/trade/add-trade.cy.js          | 2026-03-15  | 0      | 109        |
| 4  | Update Trade   | trading_management/trade/update-trade.cy.js       | 2026-03-15  | 0      | 32         |
| 5  | Delete Trade   | trading_management/trade/delete-trade.cy.js       | 2026-03-15  | 0      | 6          |
| 6  | Trade Options  | trading_management/trade/option-trade.cy.js       | 2026-03-15  | 0      | 7          |
| 7  | Trade Summary  | trading_management/trade/summary-trade.cy.js      | 2026-03-15  | 0      | 10         |

---

### Trading - Fee

| #  | Feature      | File                                          | Last Tested | Manual | Automation |
| -- | ------------ | --------------------------------------------- | ----------- | ------ | ---------- |
| 1  | List Fee     | trading_management/fee/list-fee.cy.js         | 2026-03-15  | 0      | 6          |
| 2  | Fee Detail   | trading_management/fee/fee-detail.cy.js       | 2026-03-15  | 0      | 15         |
| 3  | Add Fee      | trading_management/fee/add-fee.cy.js          | 2026-03-15  | 0      | 62         |
| 4  | Update Fee   | trading_management/fee/update-fee.cy.js       | 2026-03-15  | 0      | 19         |
| 5  | Delete Fee   | trading_management/fee/delete-fee.cy.js       | 2026-03-15  | 0      | 6          |
| 6  | Fee Summary  | trading_management/fee/summary-fee.cy.js      | 2026-03-15  | 0      | 23         |

---

### Trading - Event

| #  | Feature        | File                                              | Last Tested | Manual | Automation |
| -- | -------------- | ------------------------------------------------- | ----------- | ------ | ---------- |
| 1  | List Event     | trading_management/event/list-event.cy.js         | 2026-03-15  | 0      | 6          |
| 2  | Event Detail   | trading_management/event/event-detail.cy.js       | 2026-03-15  | 0      | 15         |
| 3  | Add Event      | trading_management/event/add-event.cy.js          | 2026-03-15  | 0      | 59         |
| 4  | Update Event   | trading_management/event/update-event.cy.js       | 2026-03-15  | 0      | 20         |
| 5  | Delete Event   | trading_management/event/delete-event.cy.js       | 2026-03-15  | 0      | 9          |
| 6  | Event Summary  | trading_management/event/summary-event.cy.js      | 2026-03-15  | 0      | 25         |

---

## Staleness Alert

Fitur berikut belum ditest lebih dari **30 hari** (sejak 2026-04-08):

| Module                    | Last Tested | Days Since Last Test |
| ------------------------- | ----------- | -------------------- |
| Inventory - Product       | 2026-03-20  | 50 hari              |
| Inventory - Product Name  | 2026-03-20  | 50 hari              |
| Trading - Trade           | 2026-03-15  | 55 hari              |
| Trading - Fee             | 2026-03-15  | 55 hari              |
| Trading - Event           | 2026-03-15  | 55 hari              |

> **Rekomendasi:** Jalankan full regression suite untuk modul-modul ini sebelum release berikutnya.
