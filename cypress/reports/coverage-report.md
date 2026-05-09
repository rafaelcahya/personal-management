# Test Coverage Report

**Last Updated:** 2026-05-09
**App Version:** 1.6.1

## Coverage Summary

| Module                    | Total Features | Automated | Manual Only | Not Tested | Coverage % |
| ------------------------- | -------------- | --------- | ----------- | ---------- | ---------- |
| Auth                      | 9              | 8         | 1           | 0          | 89%        |
| API Auth Guard            | 3              | 3         | 0           | 0          | 100%       |
| Landing Page              | 7              | 7         | 0           | 0          | 100%       |
| Inventory - Dashboard     | 10             | 10        | 0           | 0          | 100%       |
| Inventory - Product       | 9              | 9         | 0           | 0          | 100%       |
| Inventory - Product Brand | 6              | 6         | 0           | 0          | 100%       |
| Inventory - Product Name  | 6              | 6         | 0           | 0          | 100%       |
| Trading - Trade           | 7              | 7         | 0           | 0          | 100%       |
| Trading - Fee             | 6              | 6         | 0           | 0          | 100%       |
| Trading - Event           | 6              | 6         | 0           | 0          | 100%       |
| **Total**                 | **69**         | **68**    | **1**       | **0**      | **98%**    |

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
| 19  | cypress/e2e/inventory_management/dashboard/dashboard-ui.cy.js         | Dashboard UI                         | 64         | Inventory dashboard display  |
| 20  | cypress/e2e/inventory_management/dashboard/dashboard-api.cy.js        | Dashboard API                        | 56         | Dashboard API responses      |
| 21  | cypress/e2e/inventory_management/dashboard/summary-api.cy.js          | Summary API                          | 17         | Inventory summary API        |
| 22  | cypress/e2e/inventory_management/product/list-product.cy.js           | List Product                         | 26         | Product list view            |
| 23  | cypress/e2e/inventory_management/product/product-detail.cy.js         | Product Detail                       | 25         | Product detail view          |
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

**Total Automated Test Cases: 1,354**

## Manual Test Cases (not yet automated)

| #   | Feature                    | Reason Not Automated                        | Priority to Automate |
| --- | -------------------------- | ------------------------------------------- | -------------------- |
| 1   | Google OAuth UI Flow       | Requires real Google OAuth browser redirect | P2                   |

## Coverage Gap Analysis

All features have at least partial automation coverage. The only manual-only test is Google OAuth UI Flow, which requires a real browser OAuth redirect that cannot be intercepted by Cypress without a custom OAuth mock server.

**Recommendation:** P2 — automate Google OAuth using a mock OAuth provider (e.g., `cypress-social-logins` or a custom mock server) in a future sprint.
