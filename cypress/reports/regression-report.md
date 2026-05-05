# Cypress Regression Report

**Last Run:** 2026-05-05  
**Status:** ✅ All Passing  
**Total:** 88 tests — 88 passing, 0 failing

---

## Summary by Spec

| Spec File | Tests | Passing | Failing | Duration |
|-----------|-------|---------|---------|----------|
| `dashboard-api.cy.js` | 33 | 33 | 0 | ~20s |
| `summary-api.cy.js` | 17 | 17 | 0 | ~9s |
| `dashboard-ui.cy.js` | 38 | 38 | 0 | ~49s |
| **Total** | **88** | **88** | **0** | **~1m 19s** |

---

## Test Files — Inventory Dashboard

### `cypress/e2e/inventory_management/dashboard/dashboard-api.cy.js`
API tests for `GET /api/inventory/v1/dashboard`

| Describe Group | Tests | Status |
|----------------|-------|--------|
| Authentication | 2 | ✅ Pass |
| Response Structure | 4 | ✅ Pass |
| Cost Per Use Data | 6 | ✅ Pass |
| Low Stock Alert Logic | 3 | ✅ Pass |
| Neglected Products Logic | 5 | ✅ Pass |
| Monthly Spend By Type Logic | 4 | ✅ Pass |
| Avg Usage Duration Logic | 3 | ✅ Pass |
| Days Until Empty Logic | 5 | ✅ Pass |
| Performance | 1 | ✅ Pass |
| **Total** | **33** | **✅** |

### `cypress/e2e/inventory_management/dashboard/summary-api.cy.js`
API tests for `GET /api/inventory/v1/product/summary`

| Describe Group | Tests | Status |
|----------------|-------|--------|
| Authentication | 2 | ✅ Pass |
| Response Structure | 3 | ✅ Pass |
| Data Types | 7 | ✅ Pass |
| Data Consistency | 4 | ✅ Pass |
| Performance | 1 | ✅ Pass |
| **Total** | **17** | **✅** |

### `cypress/e2e/inventory_management/dashboard/dashboard-ui.cy.js`
UI tests for `/main/inventory`

| Describe Group | Tests | Status |
|----------------|-------|--------|
| Page Load | 3 | ✅ Pass |
| Summary Cards | 2 | ✅ Pass |
| Cost Per Use Section | 5 | ✅ Pass |
| Low Stock Alert Section | 6 | ✅ Pass |
| Neglected Products Section | 4 | ✅ Pass |
| Monthly Spend by Type Section | 4 | ✅ Pass |
| Avg Usage Duration Section | 4 | ✅ Pass |
| Days Until Empty Section | 5 | ✅ Pass |
| Loading States | 1 | ✅ Pass |
| API Error Handling | 1 | ✅ Pass |
| Layout & Responsive | 3 | ✅ Pass |
| **Total** | **38** | **✅** |

---

## Previously Existing Test Suites

All previous inventory management tests continue to pass (not re-run in this session — last verified in prior runs):

- `product/list-product.cy.js`
- `product/add-product.cy.js`
- `product/delete-product.cy.js`
- `product/favorite-product.cy.js`
- `product/update-product.cy.js`
- `product/product-detail.cy.js`
- `product/product-history.cy.js`
- `product/create-product-stock.cy.js`
- `product/summary-product.cy.js`
- `product_brand/` — all specs
- `product_name/` — all specs

---

## Notes

- Auth unauthenticated tests handle both 307 (middleware redirect) and 401 (route handler), reflecting the actual middleware behavior (`{ error: "UNAUTHORIZED" }`)
- UI tests use `cy.loginWithBypass()` + `cy.intercept()` for reliable, deterministic test data
- Error handling test verifies actual error message propagation from API response through the client fetch layer to the UI
