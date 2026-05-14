import { INVENTORY_ENDPOINTS } from '../../../fixtures/api-endpoints.js'

const DASHBOARD_API = INVENTORY_ENDPOINTS.DASHBOARD
const BUDGET_API = INVENTORY_ENDPOINTS.BUDGET

describe('GET Dashboard API - /api/inventory/v1/dashboard', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // =========================================================================
  // Authentication
  // =========================================================================
  describe('Authentication', () => {
    it('GET Dashboard API (authenticated) → returns 200 with success', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('GET Dashboard API (unauthenticated) → returns 307 redirect or 401 unauthorized', () => {
      cy.clearApiAuth()
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
        followRedirect: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([307, 401])

        if (response.status === 401) {
          // Middleware returns { error: "Unauthorized", message: "..." }
          // Route handler returns { success: false, error: "Unauthorized" }
          const body = response.body
          const isUnauth = body?.success === false || body?.error === 'Unauthorized'
          expect(isUnauth).to.be.true
        }

        if (response.status === 307) {
          const location = response.headers.location || ''
          expect(String(location)).to.include('/login')
        }
      })
    })
  })

  // =========================================================================
  // Response Structure
  // =========================================================================
  describe('Response Structure', () => {
    it('Dashboard API response → has top-level keys: success, data', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body).to.have.all.keys('success', 'data')
        expect(response.body.success).to.be.true
      })
    })

    it('Dashboard API data → contains all 11 required object keys', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const data = response.body.data
        expect(data).to.have.all.keys(
          'top5',
          'all',
          'lowStockAlerts',
          'monthlySpendByType',
          'avgUsageDuration',
          'mostRestocked',
          'spendComparison',
          'costPerUseHistory',
          'restockPrediction',
          'spendingHeatmap',
          'lifecycleScore'
        )
      })
    })

    it('Dashboard API data → array fields are properly typed as arrays', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const data = response.body.data
        expect(data.top5).to.be.an('array')
        expect(data.all).to.be.an('array')
        expect(data.lowStockAlerts).to.be.an('array')
        expect(data.monthlySpendByType).to.be.an('array')
        expect(data.avgUsageDuration).to.be.an('array')
        expect(data.mostRestocked).to.be.an('array')
        expect(data.costPerUseHistory).to.be.an('array')
        expect(data.restockPrediction).to.be.an('array')
        expect(data.spendingHeatmap).to.be.an('array')
        expect(data.lifecycleScore).to.be.an('array')
      })
    })

    it('Dashboard API data.spendComparison → has all required keys and structure', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendComparison } = response.body.data
        expect(spendComparison).to.be.an('object')
        expect(spendComparison).to.include.all.keys(
          'thisMonth',
          'lastMonth',
          'delta',
          'deltaPercent',
          'recent3',
          'trend6'
        )
        expect(spendComparison.thisMonth).to.include.all.keys('month', 'total')
        expect(spendComparison.lastMonth).to.include.all.keys('month', 'total')
        expect(spendComparison.recent3).to.be.an('array').and.have.length(3)
        expect(spendComparison.trend6).to.be.an('array').and.have.length(6)
      })
    })

    it('Dashboard API response → content-type is application/json', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.headers['content-type']).to.include('application/json')
      })
    })
  })

  // =========================================================================
  // Cost Per Use Data
  // =========================================================================
  describe('Cost Per Use Data', () => {
    it('should have required keys on top5 items', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { top5 } = response.body.data
        if (top5.length === 0) {
          cy.log('top5 is empty — skipping field key assertion')
          return
        }
        top5.forEach((item) => {
          expect(item).to.include.all.keys(
            'id',
            'product',
            'brand',
            'type',
            'quantity',
            'product_status',
            'is_favorite',
            'total_spent',
            'total_units',
            'cost_per_use'
          )
        })
      })
    })

    it('cost_per_use should be null or a positive number (null-safe)', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { top5 } = response.body.data
        top5.forEach((item) => {
          if (item.cost_per_use !== null) {
            expect(item.cost_per_use).to.be.a('number')
            expect(item.cost_per_use).to.be.gt(0)
          }
        })
      })
    })

    it('top5 should be sorted DESC by cost_per_use (nulls last)', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { top5 } = response.body.data
        if (top5.length <= 1) return

        const nonNullItems = top5.filter((i) => i.cost_per_use !== null)
        for (let i = 0; i < nonNullItems.length - 1; i++) {
          expect(nonNullItems[i].cost_per_use).to.be.gte(nonNullItems[i + 1].cost_per_use)
        }

        // Null items should appear after non-null items
        let nullStarted = false
        top5.forEach((item) => {
          if (item.cost_per_use === null) nullStarted = true
          if (nullStarted) expect(item.cost_per_use).to.be.null
        })
      })
    })

    it('top5 should have at most 5 items', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.body.data.top5.length).to.be.lte(5)
      })
    })

    it('all.length should be >= top5.length', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { top5, all } = response.body.data
        expect(all.length).to.be.gte(top5.length)
      })
    })

    it('all items should have same required keys as top5', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { all } = response.body.data
        if (all.length === 0) return
        all.forEach((item) => {
          expect(item).to.include.all.keys(
            'id',
            'product',
            'brand',
            'type',
            'quantity',
            'product_status',
            'is_favorite',
            'total_spent',
            'total_units',
            'cost_per_use'
          )
        })
      })
    })
  })

  // =========================================================================
  // Low Stock Alert Logic
  // =========================================================================
  describe('Low Stock Alert Logic', () => {
    it('all lowStockAlerts items should have quantity <= 2', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { lowStockAlerts } = response.body.data
        lowStockAlerts.forEach((item) => {
          expect(item.quantity).to.be.lte(2)
        })
      })
    })

    it('lowStockAlerts should be sorted ASC by quantity', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { lowStockAlerts } = response.body.data
        if (lowStockAlerts.length <= 1) return
        for (let i = 0; i < lowStockAlerts.length - 1; i++) {
          expect(lowStockAlerts[i].quantity).to.be.lte(lowStockAlerts[i + 1].quantity)
        }
      })
    })

    it('lowStockAlerts items should have required keys', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { lowStockAlerts } = response.body.data
        if (lowStockAlerts.length === 0) return
        lowStockAlerts.forEach((item) => {
          expect(item).to.include.all.keys(
            'id',
            'product',
            'brand',
            'type',
            'quantity',
            'product_status'
          )
        })
      })
    })
  })

  // =========================================================================
  // Monthly Spend By Type Logic
  // =========================================================================
  describe('Monthly Spend By Type Logic', () => {
    it('monthlySpendByType items should have required keys: month, product, brand, type, total_spent', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { monthlySpendByType } = response.body.data
        if (monthlySpendByType.length === 0) return
        monthlySpendByType.forEach((item) => {
          expect(item).to.include.all.keys('month', 'product', 'brand', 'type', 'total_spent')
        })
      })
    })

    it('month field should be in YYYY-MM format', () => {
      const monthRegex = /^\d{4}-\d{2}$/
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { monthlySpendByType } = response.body.data
        monthlySpendByType.forEach((item) => {
          expect(item.month).to.match(monthRegex)
        })
      })
    })

    it('total_spent should be a number >= 0', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { monthlySpendByType } = response.body.data
        monthlySpendByType.forEach((item) => {
          expect(item.total_spent).to.be.a('number')
          expect(item.total_spent).to.be.gte(0)
        })
      })
    })

    it('monthlySpendByType should only include last 6 months', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { monthlySpendByType } = response.body.data
        const sixMonthsAgo = new Date()
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
        const cutoffMonth = sixMonthsAgo.toISOString().slice(0, 7)

        monthlySpendByType.forEach((item) => {
          expect(item.month >= cutoffMonth).to.be.true
        })
      })
    })
  })

  // =========================================================================
  // Avg Usage Duration Logic
  // =========================================================================
  describe('Avg Usage Duration Logic', () => {
    it('avgUsageDuration items should have required keys', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { avgUsageDuration } = response.body.data
        if (avgUsageDuration.length === 0) return
        avgUsageDuration.forEach((item) => {
          expect(item).to.include.all.keys(
            'product_list_id',
            'product',
            'brand',
            'type',
            'avg_days'
          )
        })
      })
    })

    it('avg_days should be a positive number', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { avgUsageDuration } = response.body.data
        avgUsageDuration.forEach((item) => {
          expect(item.avg_days).to.be.a('number')
          expect(item.avg_days).to.be.gte(0)
        })
      })
    })

    it('avgUsageDuration should be sorted DESC by avg_days', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { avgUsageDuration } = response.body.data
        if (avgUsageDuration.length <= 1) return
        for (let i = 0; i < avgUsageDuration.length - 1; i++) {
          expect(avgUsageDuration[i].avg_days).to.be.gte(avgUsageDuration[i + 1].avg_days)
        }
      })
    })
  })

  // =========================================================================
  // Most Restocked Logic
  // =========================================================================
  describe('Most Restocked Logic', () => {
    it('mostRestocked items should have required keys', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { mostRestocked } = response.body.data
        if (mostRestocked.length === 0) return
        mostRestocked.forEach((item) => {
          expect(item).to.include.all.keys(
            'id',
            'product',
            'brand',
            'type',
            'restock_count',
            'last_restock_date'
          )
        })
      })
    })

    it('restock_count should be a positive integer', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { mostRestocked } = response.body.data
        mostRestocked.forEach((item) => {
          expect(item.restock_count).to.be.a('number')
          expect(item.restock_count).to.be.gte(1)
        })
      })
    })

    it('mostRestocked should be sorted DESC by restock_count', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { mostRestocked } = response.body.data
        if (mostRestocked.length <= 1) return
        for (let i = 0; i < mostRestocked.length - 1; i++) {
          expect(mostRestocked[i].restock_count).to.be.gte(mostRestocked[i + 1].restock_count)
        }
      })
    })
  })

  // =========================================================================
  // Spend Comparison Logic
  // =========================================================================
  describe('Spend Comparison Logic', () => {
    it('spendComparison month fields should be in YYYY-MM format', () => {
      const monthRegex = /^\d{4}-\d{2}$/
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendComparison } = response.body.data
        expect(spendComparison.thisMonth.month).to.match(monthRegex)
        expect(spendComparison.lastMonth.month).to.match(monthRegex)
      })
    })

    it('spendComparison totals should be numbers >= 0', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendComparison } = response.body.data
        expect(spendComparison.thisMonth.total).to.be.a('number').and.gte(0)
        expect(spendComparison.lastMonth.total).to.be.a('number').and.gte(0)
      })
    })

    it('spendComparison delta should equal thisMonth.total - lastMonth.total', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendComparison } = response.body.data
        const expected = spendComparison.thisMonth.total - spendComparison.lastMonth.total
        expect(spendComparison.delta).to.eq(expected)
      })
    })

    it('spendComparison deltaPercent should be null when lastMonth.total is 0', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendComparison } = response.body.data
        if (spendComparison.lastMonth.total === 0) {
          expect(spendComparison.deltaPercent).to.be.null
        }
      })
    })

    it('recent3 should have exactly 3 entries with month and total', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendComparison } = response.body.data
        expect(spendComparison.recent3).to.have.length(3)
        spendComparison.recent3.forEach((m) => {
          expect(m).to.include.all.keys('month', 'total')
          expect(m.total).to.be.a('number').and.gte(0)
        })
      })
    })

    it('trend6 should have exactly 6 entries ordered oldest to newest', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendComparison } = response.body.data
        expect(spendComparison.trend6).to.have.length(6)
        for (let i = 1; i < spendComparison.trend6.length; i++) {
          expect(spendComparison.trend6[i].month >= spendComparison.trend6[i - 1].month).to.be.true
        }
      })
    })
  })

  // =========================================================================
  // Cost Per Use History Logic
  // =========================================================================
  describe('Cost Per Use History Logic', () => {
    it('costPerUseHistory items should have required keys', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { costPerUseHistory } = response.body.data
        if (costPerUseHistory.length === 0) return
        costPerUseHistory.forEach((item) => {
          expect(item).to.include.all.keys(
            'product_list_id',
            'product',
            'brand',
            'type',
            'total_units',
            'history'
          )
          expect(item.history).to.be.an('array')
        })
      })
    })

    it('history entries should have required keys', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { costPerUseHistory } = response.body.data
        if (costPerUseHistory.length === 0) return
        costPerUseHistory.forEach((item) => {
          item.history.forEach((h) => {
            expect(h).to.include.all.keys(
              'date',
              'price',
              'cumulative_spent',
              'cost_per_use',
              'delta',
              'delta_percent'
            )
          })
        })
      })
    })

    it('cost_per_use should be a positive number in each history entry', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { costPerUseHistory } = response.body.data
        costPerUseHistory.forEach((item) => {
          item.history.forEach((h) => {
            expect(h.cost_per_use).to.be.a('number').and.gte(0)
          })
        })
      })
    })

    it('cumulative_spent should be monotonically increasing within each product history', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { costPerUseHistory } = response.body.data
        costPerUseHistory.forEach((item) => {
          if (item.history.length <= 1) return
          for (let i = 1; i < item.history.length; i++) {
            expect(item.history[i].cumulative_spent).to.be.gte(item.history[i - 1].cumulative_spent)
          }
        })
      })
    })

    it('first history entry delta should be null', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { costPerUseHistory } = response.body.data
        costPerUseHistory.forEach((item) => {
          if (item.history.length === 0) return
          expect(item.history[0].delta).to.be.null
        })
      })
    })
  })

  // =========================================================================
  // Restock Prediction Logic
  // =========================================================================
  describe('Restock Prediction Logic', () => {
    it('restockPrediction items should have required keys', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { restockPrediction } = response.body.data
        if (restockPrediction.length === 0) return
        restockPrediction.forEach((item) => {
          expect(item).to.include.all.keys(
            'id',
            'product',
            'brand',
            'type',
            'quantity',
            'avg_days',
            'days_until_empty',
            'predicted_date'
          )
        })
      })
    })

    it('days_until_empty should be a non-negative number', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { restockPrediction } = response.body.data
        restockPrediction.forEach((item) => {
          expect(item.days_until_empty).to.be.a('number').and.gte(0)
        })
      })
    })

    it('predicted_date should be null when quantity is 0', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { restockPrediction } = response.body.data
        restockPrediction.forEach((item) => {
          if (item.quantity === 0) {
            expect(item.predicted_date).to.be.null
            expect(item.days_until_empty).to.eq(0)
          }
        })
      })
    })

    it('restockPrediction should be sorted DESC by days_until_empty', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { restockPrediction } = response.body.data
        if (restockPrediction.length <= 1) return
        for (let i = 0; i < restockPrediction.length - 1; i++) {
          expect(restockPrediction[i].days_until_empty).to.be.gte(
            restockPrediction[i + 1].days_until_empty
          )
        }
      })
    })
  })

  // =========================================================================
  // Spending Heatmap Logic
  // =========================================================================
  describe('Spending Heatmap Logic', () => {
    it('spendingHeatmap items should have required keys: date, total', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendingHeatmap } = response.body.data
        if (spendingHeatmap.length === 0) return
        spendingHeatmap.forEach((item) => {
          expect(item).to.include.all.keys('date', 'total')
        })
      })
    })

    it('date should be in YYYY-MM-DD format', () => {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendingHeatmap } = response.body.data
        spendingHeatmap.forEach((item) => {
          expect(item.date).to.match(dateRegex)
        })
      })
    })

    it('total should be a positive number', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendingHeatmap } = response.body.data
        spendingHeatmap.forEach((item) => {
          expect(item.total).to.be.a('number').and.gt(0)
        })
      })
    })

    it('spendingHeatmap should only include last 12 months', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { spendingHeatmap } = response.body.data
        const oneYearAgo = new Date()
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
        const cutoff = oneYearAgo.toISOString().slice(0, 10)
        spendingHeatmap.forEach((item) => {
          expect(item.date >= cutoff).to.be.true
        })
      })
    })
  })

  // =========================================================================
  // Lifecycle Score Logic
  // =========================================================================
  describe('Lifecycle Score Logic', () => {
    it('lifecycleScore items should have required keys', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { lifecycleScore } = response.body.data
        if (lifecycleScore.length === 0) return
        lifecycleScore.forEach((item) => {
          expect(item).to.include.all.keys(
            'id',
            'product',
            'brand',
            'type',
            'cost_per_use',
            'avg_days',
            'score'
          )
        })
      })
    })

    it('score should be an integer between 0 and 100', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { lifecycleScore } = response.body.data
        lifecycleScore.forEach((item) => {
          expect(item.score).to.be.a('number').and.gte(0).and.lte(100)
          expect(item.score % 1).to.eq(0)
        })
      })
    })

    it('lifecycleScore should be sorted DESC by score', () => {
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        const { lifecycleScore } = response.body.data
        if (lifecycleScore.length <= 1) return
        for (let i = 0; i < lifecycleScore.length - 1; i++) {
          expect(lifecycleScore[i].score).to.be.gte(lifecycleScore[i + 1].score)
        }
      })
    })
  })

  // =========================================================================
  // Performance
  // =========================================================================
  describe('Performance', () => {
    it('should respond within 2000ms', () => {
      const start = Date.now()
      cy.request({
        method: 'GET',
        url: DASHBOARD_API,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(Date.now() - start).to.be.lte(2000)
      })
    })
  })
})

// =============================================================================
// Budget API - /api/inventory/v1/budget
// =============================================================================
describe('Budget API - /api/inventory/v1/budget', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // =========================================================================
  // GET /api/inventory/v1/budget
  // =========================================================================
  describe('GET /api/inventory/v1/budget', () => {
    it('should return 200 with success and data array for authenticated user', () => {
      cy.request({
        method: 'GET',
        url: BUDGET_API,
        failOnStatusCode: false,
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data).to.be.an('array')
      })
    })

    it('GET Dashboard API (unauthenticated) → returns 307 redirect or 401 unauthorized', () => {
      cy.clearApiAuth()
      cy.request({
        method: 'GET',
        url: BUDGET_API,
        failOnStatusCode: false,
        followRedirect: false,
      }).then((response) => {
        expect(response.status).to.be.oneOf([307, 401])
      })
    })

    it('should return items with type and monthly_budget keys', () => {
      cy.request({
        method: 'GET',
        url: BUDGET_API,
        failOnStatusCode: false,
      }).then((response) => {
        const data = response.body.data
        if (data.length === 0) return
        data.forEach((item) => {
          expect(item).to.include.all.keys('type', 'monthly_budget')
        })
      })
    })
  })

  // =========================================================================
  // POST /api/inventory/v1/budget
  // =========================================================================
  describe('POST /api/inventory/v1/budget', () => {
    it('should upsert a budget and return success', () => {
      cy.request({
        method: 'POST',
        url: BUDGET_API,
        failOnStatusCode: false,
        body: { type: '_cy_test_type', monthly_budget: 100000 },
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
      })
    })

    it('should persist the upserted budget — GET returns the saved value', () => {
      cy.request({
        method: 'POST',
        url: BUDGET_API,
        failOnStatusCode: false,
        body: { type: '_cy_test_type', monthly_budget: 250000 },
      }).then(() => {
        cy.request({
          method: 'GET',
          url: BUDGET_API,
          failOnStatusCode: false,
        }).then((res) => {
          const found = res.body.data.find((b) => b.type === '_cy_test_type')
          expect(found).to.exist
          expect(Number(found.monthly_budget)).to.eq(250000)
        })
      })
    })

    it('should return 400 when body is missing type or monthly_budget', () => {
      cy.request({
        method: 'POST',
        url: BUDGET_API,
        failOnStatusCode: false,
        body: { monthly_budget: 50000 },
      }).then((response) => {
        expect(response.status).to.eq(400)
      })
    })

    it('GET Dashboard API (unauthenticated) → returns 307 redirect or 401 unauthorized', () => {
      cy.clearApiAuth()
      cy.request({
        method: 'POST',
        url: BUDGET_API,
        failOnStatusCode: false,
        followRedirect: false,
        body: { type: '_cy_test_type', monthly_budget: 100000 },
      }).then((response) => {
        expect(response.status).to.be.oneOf([307, 401])
      })
    })
  })
})
