# Cypress Coverage Report

**Last Updated:** 2026-05-05  
**Coverage Method:** E2E API + UI tests via Cypress

---

## Overall Coverage Summary

| Module | API Tests | UI Tests | Coverage |
|--------|-----------|----------|----------|
| Inventory Dashboard | ✅ | ✅ | Full |
| Product Summary API | ✅ | ✅ (via UI) | Full |
| Product List | ✅ | — | API only |
| Product Detail | ✅ | — | API only |
| Product Brand | ✅ | — | API only |
| Product Name | ✅ | — | API only |
| Product Stock | ✅ | — | API only |
| Product History | ✅ | — | API only |
| Auth (Login/Logout/Callback) | ✅ | ✅ | Full |

---

## Inventory Dashboard Coverage (`/main/inventory`)

### API: `GET /api/inventory/v1/dashboard`

| Scenario | Covered | Test File |
|----------|---------|-----------|
| Authenticated request returns 200 | ✅ | `dashboard-api.cy.js` |
| Unauthenticated returns 401/307 | ✅ | `dashboard-api.cy.js` |
| Response structure — top-level keys | ✅ | `dashboard-api.cy.js` |
| Response structure — data keys | ✅ | `dashboard-api.cy.js` |
| All data values are arrays | ✅ | `dashboard-api.cy.js` |
| Content-Type is application/json | ✅ | `dashboard-api.cy.js` |
| `top5` has required keys | ✅ | `dashboard-api.cy.js` |
| `cost_per_use` null-safety | ✅ | `dashboard-api.cy.js` |
| `top5` sorted DESC by cost_per_use | ✅ | `dashboard-api.cy.js` |
| `top5.length <= 5` | ✅ | `dashboard-api.cy.js` |
| `all.length >= top5.length` | ✅ | `dashboard-api.cy.js` |
| `all` items have required keys | ✅ | `dashboard-api.cy.js` |
| `lowStockAlerts` quantity <= 2 | ✅ | `dashboard-api.cy.js` |
| `lowStockAlerts` sorted ASC by quantity | ✅ | `dashboard-api.cy.js` |
| `lowStockAlerts` required keys | ✅ | `dashboard-api.cy.js` |
| `neglectedProducts` product_status = 'active' | ✅ | `dashboard-api.cy.js` |
| `neglectedProducts` last_used null or date | ✅ | `dashboard-api.cy.js` |
| `neglectedProducts` days_since_used number or null | ✅ | `dashboard-api.cy.js` |
| `neglectedProducts` null last_used sorted first | ✅ | `dashboard-api.cy.js` |
| `neglectedProducts` required keys | ✅ | `dashboard-api.cy.js` |
| `monthlySpendByType` required keys | ✅ | `dashboard-api.cy.js` |
| `monthlySpendByType` month YYYY-MM format | ✅ | `dashboard-api.cy.js` |
| `monthlySpendByType` total_spent >= 0 | ✅ | `dashboard-api.cy.js` |
| `monthlySpendByType` within last 6 months | ✅ | `dashboard-api.cy.js` |
| `avgUsageDuration` required keys | ✅ | `dashboard-api.cy.js` |
| `avgUsageDuration` avg_days positive number | ✅ | `dashboard-api.cy.js` |
| `avgUsageDuration` sorted DESC by avg_days | ✅ | `dashboard-api.cy.js` |
| `daysUntilEmpty` required keys | ✅ | `dashboard-api.cy.js` |
| `daysUntilEmpty` quantity > 0 | ✅ | `dashboard-api.cy.js` |
| `daysUntilEmpty` days_until_empty positive | ✅ | `dashboard-api.cy.js` |
| `daysUntilEmpty` daily_consumption positive | ✅ | `dashboard-api.cy.js` |
| `daysUntilEmpty` sorted ASC (most critical first) | ✅ | `dashboard-api.cy.js` |
| Response within 2000ms | ✅ | `dashboard-api.cy.js` |

### API: `GET /api/inventory/v1/product/summary`

| Scenario | Covered | Test File |
|----------|---------|-----------|
| Authenticated returns 200 | ✅ | `summary-api.cy.js` |
| Unauthenticated returns 401/307 | ✅ | `summary-api.cy.js` |
| Top-level keys: success, data | ✅ | `summary-api.cy.js` |
| Data keys: all 6 summary fields | ✅ | `summary-api.cy.js` |
| Content-Type application/json | ✅ | `summary-api.cy.js` |
| totalProducts >= 0 | ✅ | `summary-api.cy.js` |
| activeProducts >= 0 | ✅ | `summary-api.cy.js` |
| inactiveProducts >= 0 | ✅ | `summary-api.cy.js` |
| totalQuantity >= 0 | ✅ | `summary-api.cy.js` |
| totalUsageQuantity >= 0 | ✅ | `summary-api.cy.js` |
| favoriteProducts >= 0 | ✅ | `summary-api.cy.js` |
| All values are numbers >= 0 | ✅ | `summary-api.cy.js` |
| totalProducts >= active + inactive | ✅ | `summary-api.cy.js` |
| active + inactive <= totalProducts | ✅ | `summary-api.cy.js` |
| favoriteProducts <= totalProducts | ✅ | `summary-api.cy.js` |
| Response within 2000ms | ✅ | `summary-api.cy.js` |

### UI: `/main/inventory`

| Scenario | Covered | Test File |
|----------|---------|-----------|
| Page loads without errors | ✅ | `dashboard-ui.cy.js` |
| Navigation tabs visible | ✅ | `dashboard-ui.cy.js` |
| Dashboard tab active | ✅ | `dashboard-ui.cy.js` |
| 6 summary card titles rendered | ✅ | `dashboard-ui.cy.js` |
| Summary card numeric values displayed | ✅ | `dashboard-ui.cy.js` |
| Cost Per Use section header | ✅ | `dashboard-ui.cy.js` |
| Cost Per Use empty state | ✅ | `dashboard-ui.cy.js` |
| Cost Per Use table with data | ✅ | `dashboard-ui.cy.js` |
| Cost Per Use View All button | ✅ | `dashboard-ui.cy.js` |
| Cost Per Use modal title | ✅ | `dashboard-ui.cy.js` |
| Low Stock Alert section header | ✅ | `dashboard-ui.cy.js` |
| Low Stock Alert empty state | ✅ | `dashboard-ui.cy.js` |
| Out of Stock badge (quantity = 0) | ✅ | `dashboard-ui.cy.js` |
| Low: X left badge (quantity 1-2) | ✅ | `dashboard-ui.cy.js` |
| Low Stock View All button | ✅ | `dashboard-ui.cy.js` |
| Low Stock modal title | ✅ | `dashboard-ui.cy.js` |
| Neglected Products section header | ✅ | `dashboard-ui.cy.js` |
| Neglected Products empty state | ✅ | `dashboard-ui.cy.js` |
| Never used italic label (null last_used) | ✅ | `dashboard-ui.cy.js` |
| Days badge (e.g. "65d ago") | ✅ | `dashboard-ui.cy.js` |
| Monthly Spend by Type section header | ✅ | `dashboard-ui.cy.js` |
| Monthly Spend empty state | ✅ | `dashboard-ui.cy.js` |
| Grouped by month display | ✅ | `dashboard-ui.cy.js` |
| Rupiah format (Rp) | ✅ | `dashboard-ui.cy.js` |
| Monthly Spend modal title | ✅ | `dashboard-ui.cy.js` |
| Avg Usage Duration section header | ✅ | `dashboard-ui.cy.js` |
| Avg Usage Duration empty state | ✅ | `dashboard-ui.cy.js` |
| Duration badge "X days" | ✅ | `dashboard-ui.cy.js` |
| Avg Usage Duration modal title | ✅ | `dashboard-ui.cy.js` |
| Days Until Empty section header | ✅ | `dashboard-ui.cy.js` |
| Days Until Empty empty state | ✅ | `dashboard-ui.cy.js` |
| Warning badge "Xd ⚠️" for <= 7 days | ✅ | `dashboard-ui.cy.js` |
| Normal days badge for > 7 days | ✅ | `dashboard-ui.cy.js` |
| Days Until Empty modal title | ✅ | `dashboard-ui.cy.js` |
| Skeleton loading state during API call | ✅ | `dashboard-ui.cy.js` |
| Error message on API 500 | ✅ | `dashboard-ui.cy.js` |
| 2-column analytics grid (desktop) | ✅ | `dashboard-ui.cy.js` |
| Summary cards grid exists | ✅ | `dashboard-ui.cy.js` |

---

## Business Logic Coverage

| Business Rule | Tested |
|---------------|--------|
| `cost_per_use = total_spent / total_units`, null if no spend | ✅ API + UI |
| Low Stock trigger: `quantity <= 2`, sorted ASC | ✅ API + UI |
| Neglected: `product_status = active` AND unused 30+ days | ✅ API + UI |
| Monthly Spend: last 6 months, YYYY-MM format | ✅ API + UI |
| Avg Usage Duration: positive number, sorted DESC | ✅ API |
| Days Until Empty: `quantity > 0`, sorted ASC (critical first) | ✅ API + UI |
| Warning badge `⚠️` for days_until_empty <= 7 | ✅ UI |
| Division by zero guard (cost_per_use null-safe) | ✅ API |
| Performance: all endpoints < 2000ms | ✅ API |

---

## Acceptance Criteria Coverage (PRD 3.1.0)

| AC | Status |
|----|--------|
| 6 summary cards with correct values on page load | ✅ |
| Skeleton loading state during API fetch | ✅ |
| Cost Per Use: top 5 sorted DESC, View All modal | ✅ |
| Cost Per Use: empty state "No products yet." | ✅ |
| Low Stock: badge merah Out of Stock (qty=0) | ✅ |
| Low Stock: badge orange "Low: X left" (qty 1-2) | ✅ |
| Low Stock: empty state "All good!" | ✅ |
| Low Stock: View All modal | ✅ |
| Neglected: "Never used" for null last_used | ✅ |
| Neglected: days badge per threshold | ✅ |
| Neglected: empty state | ✅ |
| Monthly Spend: grouped by month, Rupiah format | ✅ |
| Monthly Spend: empty state | ✅ |
| Monthly Spend: View All modal | ✅ |
| Avg Duration: duration badge "X days" | ✅ |
| Avg Duration: empty state | ✅ |
| Avg Duration: View All modal | ✅ |
| Days Until Empty: ⚠️ badge for <= 7 days | ✅ |
| Days Until Empty: empty state | ✅ |
| Days Until Empty: View All modal | ✅ |
| API error: error message rendered | ✅ |
| Layout: 2-column grid for analytics sections | ✅ |
| Auth: unauthenticated blocked from dashboard | ✅ |
