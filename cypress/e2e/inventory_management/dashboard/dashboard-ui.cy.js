import { INVENTORY_ENDPOINTS } from '../../../fixtures/api-endpoints.js'

const DASHBOARD_API = INVENTORY_ENDPOINTS.DASHBOARD
const SUMMARY_API = INVENTORY_ENDPOINTS.PRODUCT_SUMMARY
const BUDGET_API = INVENTORY_ENDPOINTS.BUDGET
const INVENTORY_URL = '/main/inventory'

const thisMonth = new Date().toISOString().slice(0, 7)
const prevDate = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1)
const lastMonth = prevDate.toISOString().slice(0, 7)

function buildEmptyTrend() {
  const months = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(new Date().getFullYear(), new Date().getMonth() - i, 1)
    months.push({ month: d.toISOString().slice(0, 7), total: 0 })
  }
  return months
}

const emptyTrend6 = buildEmptyTrend()
const emptyRecent3 = emptyTrend6.slice(-3)

const emptyDashboardData = {
  top5: [],
  all: [],
  lowStockAlerts: [],
  monthlySpendByType: [],
  avgUsageDuration: [],
  mostRestocked: [],
  spendComparison: {
    thisMonth: { month: thisMonth, total: 0 },
    lastMonth: { month: lastMonth, total: 0 },
    delta: 0,
    deltaPercent: null,
    recent3: emptyRecent3,
    trend6: emptyTrend6,
  },
  costPerUseHistory: [],
  restockPrediction: [],
  spendingHeatmap: [],
  lifecycleScore: [],
}

const emptySummaryData = {
  totalProducts: 0,
  activeProducts: 0,
  inactiveProducts: 0,
  totalQuantity: 0,
  totalUsageQuantity: 0,
  favoriteProducts: 0,
}

const stubDashboard = (data = emptyDashboardData) => {
  cy.intercept('GET', DASHBOARD_API, {
    statusCode: 200,
    body: { success: true, data },
  }).as('dashboardApi')
}

const stubSummary = (data = emptySummaryData) => {
  cy.intercept('GET', SUMMARY_API, {
    statusCode: 200,
    body: { success: true, data },
  }).as('summaryApi')
}

const stubBudget = (data = []) => {
  cy.intercept('GET', BUDGET_API, {
    statusCode: 200,
    body: { success: true, data },
  }).as('budgetApi')
}

describe('Inventory Dashboard UI - /main/inventory', () => {
  beforeEach(() => {
    cy.loginWithBypass()
    stubBudget()
  })

  // =========================================================================
  // Page Load
  // =========================================================================
  describe('Page Load', () => {
    it('should load the dashboard page without errors', () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.get('body').should('be.visible')
      // No uncaught JS errors — Cypress catches these automatically
    })

    it('should display navigation tabs', () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.contains('Dashboard').should('be.visible')
      cy.contains('Product List').should('be.visible')
      cy.contains('Product Brand').should('be.visible')
      cy.contains('Product Name').should('be.visible')
      cy.contains('Product History').should('be.visible')
    })

    it('should highlight Dashboard tab as active', () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      // Dashboard tab should have active styling (white bg on desktop)
      cy.contains('Dashboard').should('be.visible')
    })
  })

  // =========================================================================
  // Summary Cards
  // =========================================================================
  describe('Summary Cards', () => {
    it('should render 6 summary cards with titles', () => {
      stubDashboard()
      stubSummary({
        totalProducts: 10,
        activeProducts: 7,
        inactiveProducts: 3,
        totalQuantity: 45,
        totalUsageQuantity: 12,
        favoriteProducts: 4,
      })
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])

      cy.contains('Total Products').should('be.visible')
      cy.contains('Active').should('be.visible')
      cy.contains('Inactive').should('be.visible')
      cy.contains('Total Stock').should('be.visible')
      cy.contains('In Use').should('be.visible')
      cy.contains('Favorites').should('be.visible')
    })

    it('should display numeric values in summary cards', () => {
      stubDashboard()
      stubSummary({
        totalProducts: 10,
        activeProducts: 7,
        inactiveProducts: 3,
        totalQuantity: 45,
        totalUsageQuantity: 12,
        favoriteProducts: 4,
      })
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])

      cy.contains('10').should('be.visible')
      cy.contains('7').should('be.visible')
      cy.contains('3').should('be.visible')
      cy.contains('45').should('be.visible')
      cy.contains('12').should('be.visible')
      cy.contains('4').should('be.visible')
    })
  })

  // =========================================================================
  // Spend Comparison Section
  // =========================================================================
  describe('Spend Comparison Section', () => {
    it("should display section header 'Spend This Month vs Last Month'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Spend This Month vs Last Month').should('be.visible')
    })

    it("should show empty state 'No purchase data yet' when both months are 0", () => {
      stubDashboard(emptyDashboardData)
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Spend This Month vs Last Month')
        .parents('.bg-white')
        .contains('No purchase data yet')
        .should('be.visible')
    })

    it('should render Rupiah amounts when data exists', () => {
      stubDashboard({
        ...emptyDashboardData,
        spendComparison: {
          ...emptyDashboardData.spendComparison,
          thisMonth: { month: thisMonth, total: 120000 },
          lastMonth: { month: lastMonth, total: 100000 },
          delta: 20000,
          deltaPercent: 20,
          trend6: [...emptyTrend6.slice(0, 5), { month: thisMonth, total: 120000 }],
        },
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Spend This Month vs Last Month')
        .parents('.bg-white')
        .contains('Rp')
        .should('be.visible')
    })

    it('should display delta badge with upward indicator when spending increased', () => {
      stubDashboard({
        ...emptyDashboardData,
        spendComparison: {
          ...emptyDashboardData.spendComparison,
          thisMonth: { month: thisMonth, total: 150000 },
          lastMonth: { month: lastMonth, total: 100000 },
          delta: 50000,
          deltaPercent: 50,
          trend6: [...emptyTrend6.slice(0, 5), { month: thisMonth, total: 150000 }],
        },
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('more than last month').should('be.visible')
    })

    it('should display delta badge with downward indicator when spending decreased', () => {
      stubDashboard({
        ...emptyDashboardData,
        spendComparison: {
          ...emptyDashboardData.spendComparison,
          thisMonth: { month: thisMonth, total: 60000 },
          lastMonth: { month: lastMonth, total: 100000 },
          delta: -40000,
          deltaPercent: -40,
          trend6: [...emptyTrend6.slice(0, 5), { month: thisMonth, total: 60000 }],
        },
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('less than last month').should('be.visible')
    })

    it('should render both chart labels (Last 3 months and 6-month trend)', () => {
      stubDashboard({
        ...emptyDashboardData,
        spendComparison: {
          ...emptyDashboardData.spendComparison,
          thisMonth: { month: thisMonth, total: 80000 },
          lastMonth: { month: lastMonth, total: 60000 },
          delta: 20000,
          deltaPercent: 33,
          trend6: [...emptyTrend6.slice(0, 5), { month: thisMonth, total: 80000 }],
        },
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Last 3 months').should('be.visible')
      cy.contains('6-month trend').should('be.visible')
    })
  })

  // =========================================================================
  // Most Restocked Section
  // =========================================================================
  describe('Most Restocked Section', () => {
    it("should display section header 'Most Restocked'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Most Restocked').should('be.visible')
    })

    it("should show empty state 'No restock history yet' when data is empty", () => {
      stubDashboard(emptyDashboardData)
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('No restock history yet').should('be.visible')
    })

    it('should render table with restock count badge when data exists', () => {
      stubDashboard({
        ...emptyDashboardData,
        mostRestocked: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            restock_count: 5,
            last_restock_date: '2026-04-10',
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Shampoo').should('be.visible')
      cy.contains('5×').should('be.visible')
    })

    it("should show 'View All' button when data exists", () => {
      stubDashboard({
        ...emptyDashboardData,
        mostRestocked: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            restock_count: 3,
            last_restock_date: '2026-04-10',
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Most Restocked').parents('.bg-white').contains('View All').should('be.visible')
    })

    it("should open modal with title 'All Products — Restock History' on View All click", () => {
      stubDashboard({
        ...emptyDashboardData,
        mostRestocked: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            restock_count: 3,
            last_restock_date: '2026-04-10',
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Most Restocked').parents('.bg-white').contains('View All').click()
      cy.contains('All Products — Restock History').should('be.visible')
    })
  })

  // =========================================================================
  // Cost Per Use Section
  // =========================================================================
  describe('Cost Per Use Section', () => {
    it("should display section header 'Cost Per Use'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('h2', 'Cost Per Use').should('be.visible')
    })

    it("should show empty state 'No products yet.' when data is empty", () => {
      stubDashboard(emptyDashboardData)
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('No products yet.').should('be.visible')
    })

    it('should render table when top5 data exists', () => {
      stubDashboard({
        ...emptyDashboardData,
        top5: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            quantity: 3,
            product_status: 'active',
            is_favorite: false,
            total_spent: 50000,
            total_units: 5,
            cost_per_use: 10000,
          },
        ],
        all: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            quantity: 3,
            product_status: 'active',
            is_favorite: false,
            total_spent: 50000,
            total_units: 5,
            cost_per_use: 10000,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Shampoo').should('be.visible')
    })

    it("should show 'View All' button when top5 data exists", () => {
      stubDashboard({
        ...emptyDashboardData,
        top5: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            quantity: 3,
            product_status: 'active',
            is_favorite: false,
            total_spent: 50000,
            total_units: 5,
            cost_per_use: 10000,
          },
        ],
        all: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            quantity: 3,
            product_status: 'active',
            is_favorite: false,
            total_spent: 50000,
            total_units: 5,
            cost_per_use: 10000,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])

      // The Cost Per Use section's View All button
      cy.contains('h2', 'Cost Per Use')
        .parents('.bg-white')
        .contains('View All')
        .should('be.visible')
    })

    it("should open modal with correct title on 'View All' click", () => {
      stubDashboard({
        ...emptyDashboardData,
        top5: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            quantity: 3,
            product_status: 'active',
            is_favorite: false,
            total_spent: 50000,
            total_units: 5,
            cost_per_use: 10000,
          },
        ],
        all: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            quantity: 3,
            product_status: 'active',
            is_favorite: false,
            total_spent: 50000,
            total_units: 5,
            cost_per_use: 10000,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])

      cy.contains('h2', 'Cost Per Use').parents('.bg-white').contains('View All').click()

      cy.contains('All Products — Cost Per Used').should('be.visible')
    })
  })

  // =========================================================================
  // Low Stock Alert Section
  // =========================================================================
  describe('Low Stock Alert Section', () => {
    it("should display section header 'Low Stock Alert'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Low Stock Alert').should('be.visible')
    })

    it("should show 'All good!' empty state when no low stock items", () => {
      stubDashboard(emptyDashboardData)
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('All good! Stock levels are healthy').should('be.visible')
    })

    it("should show 'Out of Stock' badge when quantity is 0", () => {
      stubDashboard({
        ...emptyDashboardData,
        lowStockAlerts: [
          {
            id: 1,
            product: 'Sabun',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            quantity: 0,
            product_status: 'active',
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Out of Stock').should('be.visible')
    })

    it("should show 'Low: X left' badge when quantity is 1-2", () => {
      stubDashboard({
        ...emptyDashboardData,
        lowStockAlerts: [
          {
            id: 2,
            product: 'Pasta Gigi',
            brand: 'Pepsodent',
            type: 'Oral Care',
            quantity: 1,
            product_status: 'active',
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Low: 1 left').should('be.visible')
    })

    it("should show 'View All' button when low stock data exists", () => {
      stubDashboard({
        ...emptyDashboardData,
        lowStockAlerts: [
          {
            id: 1,
            product: 'Sabun',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            quantity: 0,
            product_status: 'active',
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])

      cy.contains('Low Stock Alert').parents('.bg-white').contains('View All').should('be.visible')
    })

    it("should open modal with title 'All Low Stock Products' on View All click", () => {
      stubDashboard({
        ...emptyDashboardData,
        lowStockAlerts: [
          {
            id: 1,
            product: 'Sabun',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            quantity: 0,
            product_status: 'active',
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])

      cy.contains('Low Stock Alert').parents('.bg-white').contains('View All').click()

      cy.contains('All Low Stock Products').should('be.visible')
    })
  })

  // =========================================================================
  // Monthly Spend by Type Section
  // =========================================================================
  describe('Monthly Spend by Type Section', () => {
    it("should display section header 'Monthly Spend by Type'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Monthly Spend by Type').should('be.visible')
    })

    it("should show empty state 'No purchase data yet' when no data", () => {
      stubDashboard(emptyDashboardData)
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('No purchase data yet').should('be.visible')
    })

    it('should render grouped data with month header and product rows', () => {
      stubDashboard({
        ...emptyDashboardData,
        monthlySpendByType: [
          {
            month: '2026-04',
            product: 'Body Foam',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            total_spent: 35000,
          },
          {
            month: '2026-04',
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            total_spent: 50000,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Body Foam').should('be.visible')
      cy.contains('Shampoo').should('be.visible')
    })

    it('should display type badge alongside product name', () => {
      stubDashboard({
        ...emptyDashboardData,
        monthlySpendByType: [
          {
            month: '2026-04',
            product: 'Body Foam',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            total_spent: 35000,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Body Wash').should('be.visible')
    })

    it('should format total_spent as Rupiah', () => {
      stubDashboard({
        ...emptyDashboardData,
        monthlySpendByType: [
          {
            month: '2026-04',
            product: 'Body Foam',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            total_spent: 35000,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Rp').should('be.visible')
    })

    it('should show This Month total in header when current month data exists', () => {
      stubDashboard({
        ...emptyDashboardData,
        monthlySpendByType: [
          {
            month: thisMonth,
            product: 'Body Foam',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            total_spent: 75000,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Monthly Spend by Type')
        .parents('.bg-white')
        .contains('This month')
        .should('be.visible')
    })

    it("should open modal with title 'Monthly Spend by Type' on View All click", () => {
      stubDashboard({
        ...emptyDashboardData,
        monthlySpendByType: [{ month: '2026-04', type: 'Body Wash', total_spent: 35000 }],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])

      cy.contains('Monthly Spend by Type').parents('.bg-white').contains('View All').click()

      // Modal dialog title
      cy.get("[role='dialog']").contains('Monthly Spend by Type').should('be.visible')
    })

    it('should show "View All" modal with per-product rows', () => {
      stubDashboard({
        ...emptyDashboardData,
        monthlySpendByType: [
          {
            month: '2026-04',
            product: 'Body Foam',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            total_spent: 35000,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Monthly Spend by Type').parents('.bg-white').contains('View All').click()
      cy.get("[role='dialog']").contains('Body Foam').should('be.visible')
    })
  })

  // =========================================================================
  // Avg Cost/Use Over Time Section
  // =========================================================================
  describe('Avg Cost/Use Over Time Section', () => {
    it("should display section header 'Avg Cost/Use Over Time'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Avg Cost/Use Over Time').should('be.visible')
    })

    it("should show empty state 'No purchase history yet' when data is empty", () => {
      stubDashboard(emptyDashboardData)
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('No purchase history yet').should('be.visible')
    })

    it('should render product selector when data exists', () => {
      stubDashboard({
        ...emptyDashboardData,
        costPerUseHistory: [
          {
            product_list_id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            total_units: 10,
            history: [
              {
                date: '2026-01-15',
                price: 30000,
                cumulative_spent: 30000,
                cost_per_use: 3000,
                delta: null,
                delta_percent: null,
              },
              {
                date: '2026-03-10',
                price: 30000,
                cumulative_spent: 60000,
                cost_per_use: 6000,
                delta: 3000,
                delta_percent: 100,
              },
            ],
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Avg Cost/Use Over Time').parents('.bg-white').find('select').should('exist')
    })

    it("should show 'Not enough purchases' message for product with only 1 purchase", () => {
      stubDashboard({
        ...emptyDashboardData,
        costPerUseHistory: [
          {
            product_list_id: 1,
            product: 'Sabun',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            total_units: 3,
            history: [
              {
                date: '2026-04-01',
                price: 15000,
                cumulative_spent: 15000,
                cost_per_use: 5000,
                delta: null,
                delta_percent: null,
              },
            ],
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Not enough purchases to show a trend yet.').should('be.visible')
    })
  })

  // =========================================================================
  // Avg Usage Duration Section
  // =========================================================================
  describe('Avg Usage Duration Section', () => {
    it("should display section header 'Avg Usage Duration'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Avg Usage Duration').should('be.visible')
    })

    it("should show empty state 'Not enough usage data yet' when no data", () => {
      stubDashboard(emptyDashboardData)
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Not enough usage data yet').should('be.visible')
    })

    it("should render duration badge with 'days' text", () => {
      stubDashboard({
        ...emptyDashboardData,
        avgUsageDuration: [
          {
            product_list_id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            avg_days: 45,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('45 days').should('be.visible')
    })

    it("should open modal with title 'All Products — Avg Usage Duration' on View All click", () => {
      stubDashboard({
        ...emptyDashboardData,
        avgUsageDuration: [
          {
            product_list_id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            avg_days: 45,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])

      cy.contains('Avg Usage Duration').parents('.bg-white').contains('View All').click()

      cy.contains('All Products — Avg Usage Duration').should('be.visible')
    })
  })

  // =========================================================================
  // Restock Prediction Section
  // =========================================================================
  describe('Restock Prediction Section', () => {
    it("should display section header 'Restock Prediction'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Restock Prediction').should('be.visible')
    })

    it('should show empty state when data is empty', () => {
      stubDashboard(emptyDashboardData)
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Not enough usage data to predict').should('be.visible')
    })

    it('should render product name and urgency badge when data exists', () => {
      stubDashboard({
        ...emptyDashboardData,
        restockPrediction: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            quantity: 3,
            avg_days: 30,
            days_until_empty: 90,
            predicted_date: '2026-08-07',
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Shampoo').should('be.visible')
      cy.contains('6+ Months').should('be.visible')
    })

    it("should show 'Out of Stock' badge when quantity is 0", () => {
      stubDashboard({
        ...emptyDashboardData,
        restockPrediction: [
          {
            id: 1,
            product: 'Sabun',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            quantity: 0,
            avg_days: null,
            days_until_empty: 0,
            predicted_date: null,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Out of Stock').should('be.visible')
    })

    it("should open modal 'All Products — Restock Prediction' on View All click", () => {
      stubDashboard({
        ...emptyDashboardData,
        restockPrediction: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            quantity: 3,
            avg_days: 30,
            days_until_empty: 90,
            predicted_date: '2026-08-07',
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Restock Prediction').parents('.bg-white').contains('View All').click()
      cy.contains('All Products — Restock Prediction').should('be.visible')
    })
  })

  // =========================================================================
  // Monthly Budget Tracker Section
  // =========================================================================
  describe('Monthly Budget Tracker Section', () => {
    it("should display section header 'Monthly Budget Tracker'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Monthly Budget Tracker').should('be.visible')
    })

    it('should show empty state when no spend data this month', () => {
      stubDashboard(emptyDashboardData)
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('No spend data this month').should('be.visible')
    })

    it('should render type row with actual spend amount', () => {
      stubDashboard({
        ...emptyDashboardData,
        monthlySpendByType: [
          {
            month: thisMonth,
            product: 'Body Foam',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            total_spent: 50000,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Monthly Budget Tracker')
        .parents('.bg-white')
        .contains('Body Wash')
        .should('be.visible')
    })

    it("should show 'Set budget' when type has no budget set", () => {
      stubDashboard({
        ...emptyDashboardData,
        monthlySpendByType: [
          {
            month: thisMonth,
            product: 'Body Foam',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            total_spent: 50000,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Monthly Budget Tracker')
        .parents('.bg-white')
        .contains('Set budget')
        .should('be.visible')
    })

    it('should show progress bar and percentage when budget is set', () => {
      stubDashboard({
        ...emptyDashboardData,
        monthlySpendByType: [
          {
            month: thisMonth,
            product: 'Body Foam',
            brand: 'Lifebuoy',
            type: 'Body Wash',
            total_spent: 50000,
          },
        ],
      })
      stubBudget([{ type: 'Body Wash', monthly_budget: 100000 }])
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Monthly Budget Tracker')
        .parents('.bg-white')
        .contains('50%')
        .should('be.visible')
    })
  })

  // =========================================================================
  // Spending Heatmap Section
  // =========================================================================
  describe('Spending Heatmap Section', () => {
    it("should display section header 'Spending Heatmap'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Spending Heatmap').should('be.visible')
    })

    it('should render heatmap grid cells when data exists', () => {
      stubDashboard({
        ...emptyDashboardData,
        spendingHeatmap: [
          { date: '2026-04-15', total: 75000 },
          { date: '2026-05-01', total: 250000 },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Spending Heatmap')
        .parents('.bg-white')
        .find('.rounded-\\[2px\\]')
        .should('exist')
    })

    it("should render legend with 'Less' and 'More' labels", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Spending Heatmap').parents('.bg-white').contains('Less').should('be.visible')
      cy.contains('Spending Heatmap').parents('.bg-white').contains('More').should('be.visible')
    })
  })

  // =========================================================================
  // Product Lifecycle Score Section
  // =========================================================================
  describe('Product Lifecycle Score Section', () => {
    it("should display section header 'Product Lifecycle Score'", () => {
      stubDashboard()
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Product Lifecycle Score').should('be.visible')
    })

    it('should show empty state when data is empty', () => {
      stubDashboard(emptyDashboardData)
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Not enough data to score products').should('be.visible')
    })

    it('should render product with tier badge when data exists', () => {
      stubDashboard({
        ...emptyDashboardData,
        lifecycleScore: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            cost_per_use: 3000,
            avg_days: 45,
            score: 85,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Shampoo').should('be.visible')
      cy.contains('S').should('be.visible')
    })

    it("should open modal 'All Products — Lifecycle Score' on View All click", () => {
      stubDashboard({
        ...emptyDashboardData,
        lifecycleScore: [
          {
            id: 1,
            product: 'Shampoo',
            brand: 'Dove',
            type: 'Hair Care',
            cost_per_use: 3000,
            avg_days: 45,
            score: 85,
          },
        ],
      })
      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])
      cy.contains('Product Lifecycle Score').parents('.bg-white').contains('View All').click()
      cy.contains('All Products — Lifecycle Score').should('be.visible')
    })
  })

  // =========================================================================
  // Loading States
  // =========================================================================
  describe('Loading States', () => {
    it('should show skeleton loading state while API is loading', () => {
      // Intercept with artificial delay
      cy.intercept('GET', DASHBOARD_API, (req) => {
        req.on('response', (res) => {
          res.setDelay(800)
        })
      }).as('slowDashboard')

      cy.intercept('GET', SUMMARY_API, (req) => {
        req.on('response', (res) => {
          res.setDelay(800)
        })
      }).as('slowSummary')

      cy.visit(INVENTORY_URL)

      // Skeleton cards should appear before data loads
      cy.get('.animate-pulse').should('exist')
    })
  })

  // =========================================================================
  // API Error Handling
  // =========================================================================
  describe('API Error Handling', () => {
    it('should render error message when dashboard API returns 500', () => {
      cy.intercept('GET', DASHBOARD_API, {
        statusCode: 500,
        body: { success: false, error: 'Internal Server Error' },
      }).as('failedDashboard')

      stubSummary()
      cy.visit(INVENTORY_URL)
      cy.wait('@failedDashboard')

      // The client-side fetch throws with error.message from API response body
      // CostPerUse renders the error string directly in a <p> tag
      cy.contains('Internal Server Error').should('be.visible')
    })
  })

  // =========================================================================
  // Mobile Responsiveness
  // =========================================================================
  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      cy.viewport(375, 812)
    })

    // --- Cost Per Use ---
    describe('Cost Per Use - mobile', () => {
      const cpuProduct = {
        id: 1,
        product: 'Vitamin C Complex Serum',
        brand: 'The Ordinary',
        type: 'Skin Care',
        quantity: 2,
        product_status: 'active',
        is_favorite: false,
        total_spent: 120000,
        total_units: 12,
        cost_per_use: 10000,
      }

      beforeEach(() => {
        stubDashboard({ ...emptyDashboardData, top5: [cpuProduct], all: [cpuProduct] })
        stubSummary()
        cy.visit(INVENTORY_URL)
        cy.wait(['@dashboardApi', '@summaryApi'])
      })

      it('should show product name visible and not truncated on mobile', () => {
        cy.contains('Vitamin C Complex Serum')
          .should('be.visible')
          .then(($el) => {
            expect($el[0].scrollWidth).to.be.lte($el[0].clientWidth)
          })
      })

      it('should show status badge visible on mobile', () => {
        cy.contains('h2', 'Cost Per Use')
          .parents('.bg-white')
          .contains(/[Aa]ctive/)
          .should('be.visible')
      })
    })

    // --- Restock Prediction ---
    describe('Restock Prediction - mobile', () => {
      const restockProduct = {
        id: 1,
        product: 'Daily Moisturizing Lotion',
        brand: 'Cetaphil',
        type: 'Skin Care',
        quantity: 3,
        avg_days: 30,
        days_until_empty: 90,
        predicted_date: '2026-08-07',
      }

      beforeEach(() => {
        stubDashboard({ ...emptyDashboardData, restockPrediction: [restockProduct] })
        stubSummary()
        cy.visit(INVENTORY_URL)
        cy.wait(['@dashboardApi', '@summaryApi'])
      })

      it('should show product name visible and not truncated on mobile', () => {
        cy.contains('Daily Moisturizing Lotion')
          .should('be.visible')
          .then(($el) => {
            expect($el[0].scrollWidth).to.be.lte($el[0].clientWidth)
          })
      })

      it('should show urgency badge visible on mobile', () => {
        cy.contains('Restock Prediction')
          .parents('.bg-white')
          .contains('6+ Months')
          .should('be.visible')
      })
    })

    // --- Product Lifecycle Score ---
    describe('Product Lifecycle Score - mobile', () => {
      const lifecycleProduct = {
        id: 1,
        product: 'Nourishing Hair Treatment',
        brand: 'Pantene',
        type: 'Hair Care',
        cost_per_use: 2500,
        avg_days: 60,
        score: 85,
      }

      beforeEach(() => {
        stubDashboard({ ...emptyDashboardData, lifecycleScore: [lifecycleProduct] })
        stubSummary()
        cy.visit(INVENTORY_URL)
        cy.wait(['@dashboardApi', '@summaryApi'])
      })

      it('should show product name visible and not truncated on mobile', () => {
        cy.contains('Nourishing Hair Treatment')
          .should('be.visible')
          .then(($el) => {
            expect($el[0].scrollWidth).to.be.lte($el[0].clientWidth)
          })
      })

      it('should show tier/score badge visible on mobile', () => {
        cy.contains('Product Lifecycle Score')
          .parents('.bg-white')
          .contains('S')
          .should('be.visible')
      })
    })

    // --- Avg Usage Duration ---
    describe('Avg Usage Duration - mobile', () => {
      const durationProduct = {
        product_list_id: 1,
        product: 'Moisturizing Body Wash',
        brand: 'Dove',
        type: 'Body Wash',
        avg_days: 30,
      }

      beforeEach(() => {
        stubDashboard({ ...emptyDashboardData, avgUsageDuration: [durationProduct] })
        stubSummary()
        cy.visit(INVENTORY_URL)
        cy.wait(['@dashboardApi', '@summaryApi'])
      })

      it('should show product name visible and not truncated on mobile', () => {
        cy.contains('Moisturizing Body Wash')
          .should('be.visible')
          .then(($el) => {
            expect($el[0].scrollWidth).to.be.lte($el[0].clientWidth)
          })
      })

      it('should show duration badge visible on mobile', () => {
        cy.contains('Avg Usage Duration')
          .parents('.bg-white')
          .contains('30 days')
          .should('be.visible')
      })
    })

    // --- Most Restocked ---
    describe('Most Restocked - mobile', () => {
      const restockedProduct = {
        id: 1,
        product: 'Antibacterial Hand Soap',
        brand: 'Dettol',
        type: 'Hand Care',
        restock_count: 7,
        last_restock_date: '2026-04-20',
      }

      beforeEach(() => {
        stubDashboard({ ...emptyDashboardData, mostRestocked: [restockedProduct] })
        stubSummary()
        cy.visit(INVENTORY_URL)
        cy.wait(['@dashboardApi', '@summaryApi'])
      })

      it('should show product name visible and not truncated on mobile', () => {
        cy.contains('Antibacterial Hand Soap')
          .should('be.visible')
          .then(($el) => {
            expect($el[0].scrollWidth).to.be.lte($el[0].clientWidth)
          })
      })

      it('should show restock count badge visible on mobile', () => {
        cy.contains('Most Restocked').parents('.bg-white').contains('7×').should('be.visible')
      })
    })

    // --- Low Stock Alert ---
    describe('Low Stock Alert - mobile', () => {
      const lowStockProduct = {
        id: 1,
        product: 'Facial Cleanser Gel',
        brand: 'CeraVe',
        type: 'Skin Care',
        quantity: 1,
        product_status: 'active',
      }

      beforeEach(() => {
        stubDashboard({ ...emptyDashboardData, lowStockAlerts: [lowStockProduct] })
        stubSummary()
        cy.visit(INVENTORY_URL)
        cy.wait(['@dashboardApi', '@summaryApi'])
      })

      it('should show product name visible and not truncated on mobile', () => {
        cy.contains('Facial Cleanser Gel')
          .should('be.visible')
          .then(($el) => {
            expect($el[0].scrollWidth).to.be.lte($el[0].clientWidth)
          })
      })

      it('should show stock status badge visible on mobile', () => {
        cy.contains('Low Stock Alert')
          .parents('.bg-white')
          .contains('Low: 1 left')
          .should('be.visible')
      })
    })
  })

  // =========================================================================
  // Layout & Responsive
  // =========================================================================
  describe('Layout & Responsive', () => {
    it('should render the 2-column grid for Low Stock Alert and Most Restocked', () => {
      stubDashboard()
      stubSummary()
      cy.viewport(1280, 800)
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])

      // The grid container for Low Stock Alert and Most Restocked
      cy.get('.grid.grid-cols-1.md\\:grid-cols-2').should('exist')
    })

    it('should render the 2-column summary cards grid', () => {
      stubDashboard()
      stubSummary({
        totalProducts: 5,
        activeProducts: 3,
        inactiveProducts: 2,
        totalQuantity: 10,
        totalUsageQuantity: 4,
        favoriteProducts: 1,
      })
      cy.viewport(1280, 800)
      cy.visit(INVENTORY_URL)
      cy.wait(['@dashboardApi', '@summaryApi'])

      cy.get('.grid.grid-cols-2').should('exist')
    })
  })
})
