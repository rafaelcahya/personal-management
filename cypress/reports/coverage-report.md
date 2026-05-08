# Test Coverage Report

**Last Updated:** 2026-05-08
**App Version:** 1.4

## Coverage Summary

| Module           | Total Features | Automated | Manual Only | Not Tested | Coverage % |
| ---------------- | -------------- | --------- | ----------- | ---------- | ---------- |
| Auth             | 8              | 8         | 0           | 0          | 100%       |
| Landing Page     | 7              | 7         | 0           | 0          | 100%       |
| Inventory        | 12             | 12        | 0           | 0          | 100%       |
| Trading - Trade  | 8              | 8         | 0           | 0          | 100%       |
| Trading - Fee    | 8              | 8         | 0           | 0          | 100%       |
| Trading - Event  | 8              | 8         | 0           | 0          | 100%       |
| **Total**        | **51**         | **51**    | **0**       | **0**      | **100%**   |

## Automated Test Cases

| #   | File                                                                    | Test Suite                                          | Test Cases | Feature Covered                              |
| --- | ----------------------------------------------------------------------- | --------------------------------------------------- | ---------- | -------------------------------------------- |
| 1   | cypress/e2e/auth/login.cy.js                                            | Login - API & Authentication                        | 9          | Supabase session, bypass, token              |
| 2   | cypress/e2e/auth/login.cy.js                                            | Login Page - Desktop Interactions                   | 3          | Login page UI desktop                        |
| 3   | cypress/e2e/auth/login.cy.js                                            | Login - Auth Callback - Desktop                     | 3          | OAuth callback redirect                      |
| 4   | cypress/e2e/auth/login.cy.js                                            | Login - Session Persistence - Desktop               | 9          | Session persist, expired redirect            |
| 5   | cypress/e2e/auth/login.cy.js                                            | Login Page - Mobile Interactions                    | 3          | Login page UI mobile                         |
| 6   | cypress/e2e/auth/login.cy.js                                            | Login - Auth Callback - Mobile                      | 3          | OAuth callback redirect mobile               |
| 7   | cypress/e2e/auth/login.cy.js                                            | Login - Session Persistence - Mobile                | 9          | Session persist mobile                       |
| 8   | cypress/e2e/auth/login.cy.js                                            | Login Page - Tablet Interactions                    | 3          | Login page UI tablet                         |
| 9   | cypress/e2e/auth/login.cy.js                                            | Login - Auth Callback - Tablet                      | 3          | OAuth callback redirect tablet               |
| 10  | cypress/e2e/auth/login.cy.js                                            | Login - Session Persistence - Tablet                | 9          | Session persist tablet                       |
| 11  | cypress/e2e/auth/login.cy.js                                            | Login Page - App Identity & Google Branding Desktop | 4          | App name, Google button branding             |
| 12  | cypress/e2e/auth/login.cy.js                                            | Login Page - App Identity & Google Branding Mobile  | 2          | App name, Google button branding mobile      |
| 13  | cypress/e2e/auth/login.cy.js                                            | Login - Middleware ?next= Param Preservation        | 4          | next= param, 401 for API                     |
| 14  | cypress/e2e/auth/logout.cy.js                                           | Logout                                              | -          | Logout flow                                  |
| 15  | cypress/e2e/auth/session.cy.js                                          | Session                                             | -          | Session validation                           |
| 16  | cypress/e2e/api-auth/auth-api.cy.js                                     | Auth API                                            | -          | Auth API endpoints                           |
| 17  | cypress/e2e/api-auth/inventory-api.cy.js                                | Inventory API Auth                                  | -          | Inventory API auth guard                     |
| 18  | cypress/e2e/api-auth/trade-api.cy.js                                    | Trade API Auth                                      | -          | Trade API auth guard                         |
| 19  | cypress/e2e/landing_page/landing-page.cy.js                             | Landing Page - User Experience                      | 3          | Greeting, cards                              |
| 20  | cypress/e2e/landing_page/landing-page.cy.js                             | Landing Page - Navigation                           | 2          | Navigate to trading, inventory               |
| 21  | cypress/e2e/landing_page/landing-page.cy.js                             | Landing Page - Responsive Layout                    | 3          | Responsive: mobile, tablet, desktop          |
| 22  | cypress/e2e/landing_page/landing-page.cy.js                             | Landing Page - Mobile Interactions                  | 3          | Greeting + navigation mobile                 |
| 23  | cypress/e2e/landing_page/landing-page.cy.js                             | Landing Page - Tablet Interactions                  | 3          | Greeting + navigation tablet                 |
| 24  | cypress/e2e/landing_page/landing-page.cy.js                             | Landing Page - Desktop Interactions                 | 3          | Greeting + navigation desktop                |
| 25  | cypress/e2e/landing_page/landing-page.cy.js                             | Landing Page - User Menu                            | 4          | User menu: trigger, email, sign out          |
| 26  | cypress/e2e/landing_page/landing-page.cy.js                             | Landing Page - User Menu - Mobile Interactions      | 4          | User menu mobile                             |
| 27  | cypress/e2e/landing_page/landing-page.cy.js                             | Landing Page - User Menu - Tablet Interactions      | 4          | User menu tablet                             |
| 28  | cypress/e2e/landing_page/landing-page.cy.js                             | Landing Page - User Menu - Desktop Interactions     | 4          | User menu desktop                            |
| 29  | cypress/e2e/inventory_management/product/list-product.cy.js             | Product List                                        | -          | List products                                |
| 30  | cypress/e2e/inventory_management/product/product-detail.cy.js           | Product Detail                                      | -          | Product detail view                          |
| 31  | cypress/e2e/inventory_management/product/add-product.cy.js              | Add Product                                         | -          | Create product                               |
| 32  | cypress/e2e/inventory_management/product/update-product.cy.js           | Update Product                                      | -          | Edit product                                 |
| 33  | cypress/e2e/inventory_management/product/delete-product.cy.js           | Delete Product                                      | -          | Delete product                               |
| 34  | cypress/e2e/inventory_management/product/favorite-product.cy.js         | Favorite Product                                    | -          | Toggle favorite                              |
| 35  | cypress/e2e/inventory_management/product/create-product-stock.cy.js     | Create Product Stock                                | -          | Add stock                                    |
| 36  | cypress/e2e/inventory_management/product/product-history.cy.js          | Product History                                     | -          | Stock history                                |
| 37  | cypress/e2e/inventory_management/product/summary-product.cy.js          | Product Summary                                     | -          | Summary stats                                |
| 38  | cypress/e2e/inventory_management/product_brand/list-product-brand.cy.js | Product Brand List                                  | -          | List brands                                  |
| 39  | cypress/e2e/inventory_management/product_brand/add-product-brand.cy.js  | Add Product Brand                                   | -          | Create brand                                 |
| 40  | cypress/e2e/inventory_management/product_brand/update-product-brand.cy.js | Update Product Brand                              | -          | Edit brand                                   |
| 41  | cypress/e2e/inventory_management/product_brand/delete-product-brand.cy.js | Delete Product Brand                              | -          | Delete brand                                 |
| 42  | cypress/e2e/inventory_management/product_brand/product-brand-detail.cy.js | Product Brand Detail                              | -          | Brand detail view                            |
| 43  | cypress/e2e/inventory_management/product_brand/summary-product-brand.cy.js | Product Brand Summary                           | -          | Brand summary                                |
| 44  | cypress/e2e/inventory_management/product_name/list-product-name.cy.js   | Product Name List                                   | -          | List product names                           |
| 45  | cypress/e2e/inventory_management/product_name/add-product-name.cy.js    | Add Product Name                                    | -          | Create product name                          |
| 46  | cypress/e2e/inventory_management/product_name/update-product-name.cy.js | Update Product Name                                 | -          | Edit product name                            |
| 47  | cypress/e2e/inventory_management/product_name/delete-product-name.cy.js | Delete Product Name                                 | -          | Delete product name                          |
| 48  | cypress/e2e/inventory_management/product_name/product-name-detail.cy.js | Product Name Detail                                 | -          | Product name detail                          |
| 49  | cypress/e2e/inventory_management/product_name/summary-product-name.cy.js | Product Name Summary                               | -          | Product name summary                         |
| 50  | cypress/e2e/inventory_management/dashboard/dashboard-ui.cy.js           | Dashboard UI                                        | -          | Dashboard UI                                 |
| 51  | cypress/e2e/inventory_management/dashboard/dashboard-api.cy.js          | Dashboard API                                       | -          | Dashboard API                                |
| 52  | cypress/e2e/inventory_management/dashboard/summary-api.cy.js            | Summary API                                         | -          | Summary API                                  |
| 53  | cypress/e2e/trading_management/trade/list-trade.cy.js                   | Trade List                                          | -          | List trades                                  |
| 54  | cypress/e2e/trading_management/trade/trade-detail.cy.js                 | Trade Detail                                        | -          | Trade detail                                 |
| 55  | cypress/e2e/trading_management/trade/add-trade.cy.js                    | Add Trade                                           | -          | Create trade                                 |
| 56  | cypress/e2e/trading_management/trade/update-trade.cy.js                 | Update Trade                                        | -          | Edit trade                                   |
| 57  | cypress/e2e/trading_management/trade/delete-trade.cy.js                 | Delete Trade                                        | -          | Delete trade                                 |
| 58  | cypress/e2e/trading_management/trade/option-trade.cy.js                 | Trade Options                                       | -          | Trade option fields                          |
| 59  | cypress/e2e/trading_management/trade/summary-trade.cy.js                | Trade Summary                                       | -          | Trade summary stats                          |
| 60  | cypress/e2e/trading_management/fee/list-fee.cy.js                       | Fee List                                            | -          | List fees                                    |
| 61  | cypress/e2e/trading_management/fee/fee-detail.cy.js                     | Fee Detail                                          | -          | Fee detail                                   |
| 62  | cypress/e2e/trading_management/fee/add-fee.cy.js                        | Add Fee                                             | -          | Create fee                                   |
| 63  | cypress/e2e/trading_management/fee/update-fee.cy.js                     | Update Fee                                          | -          | Edit fee                                     |
| 64  | cypress/e2e/trading_management/fee/delete-fee.cy.js                     | Delete Fee                                          | -          | Delete fee                                   |
| 65  | cypress/e2e/trading_management/fee/summary-fee.cy.js                    | Fee Summary                                         | -          | Fee summary stats                            |
| 66  | cypress/e2e/trading_management/event/list-event.cy.js                   | Event List                                          | -          | List events                                  |
| 67  | cypress/e2e/trading_management/event/event-detail.cy.js                 | Event Detail                                        | -          | Event detail                                 |
| 68  | cypress/e2e/trading_management/event/add-event.cy.js                    | Add Event                                           | -          | Create event                                 |
| 69  | cypress/e2e/trading_management/event/update-event.cy.js                 | Update Event                                        | -          | Edit event                                   |
| 70  | cypress/e2e/trading_management/event/delete-event.cy.js                 | Delete Event                                        | -          | Delete event                                 |
| 71  | cypress/e2e/trading_management/event/summary-event.cy.js                | Event Summary                                       | -          | Event summary stats                          |

## Manual Test Cases (not yet automated)

| #   | Feature                  | Reason Not Automated                        | Priority to Automate |
| --- | ------------------------ | ------------------------------------------- | -------------------- |
| 1   | Google OAuth login (UI)  | Requires real Google OAuth flow             | P3                   |

## Coverage Gap Analysis

Semua fitur utama sudah ter-cover dengan automated test. Satu-satunya gap adalah full Google OAuth UI flow yang memerlukan real browser interaction dengan Google — tidak dapat di-automate tanpa test account khusus.

**Rekomendasi:**
- Google OAuth UI test: buat dedicated Google test account dan gunakan `cy.origin()` untuk handle OAuth redirect — prioritas rendah karena API-level auth sudah ditest.
