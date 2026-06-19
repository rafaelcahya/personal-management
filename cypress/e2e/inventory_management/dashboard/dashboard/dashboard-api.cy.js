// ─── dashboard GET ────────────────────────────────────────────────────────────

describe('Inventory Dashboard & Budget API', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // ─── dashboard auth guard ─────────────────────────────────────────────────

  it('GET dashboard returns 200 for authenticated user', () => {
    cy.getInventoryDashboard().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.success).to.be.true
    })
  })

  it('GET dashboard returns 401 when unauthenticated', () => {
    cy.getInventoryDashboardNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  // ─── dashboard response shape ─────────────────────────────────────────────

  it('dashboard response has top-level keys: success, data', () => {
    cy.getInventoryDashboard().then((res) => {
      expect(res.body).to.have.all.keys('success', 'data')
      expect(res.body.success).to.be.true
    })
  })

  it('dashboard data contains all 12 required object keys', () => {
    cy.getInventoryDashboard().then((res) => {
      const data = res.body.data
      expect(data).to.have.all.keys(
        'summary',
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

  it('dashboard array fields are properly typed as arrays', () => {
    cy.getInventoryDashboard().then((res) => {
      const data = res.body.data
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

  it('dashboard response content-type is application/json', () => {
    cy.getInventoryDashboard().then((res) => {
      expect(res.headers['content-type']).to.include('application/json')
    })
  })

  // ─── summary data ─────────────────────────────────────────────────────────

  it('data.summary has all 6 required keys', () => {
    cy.getInventoryDashboard().then((res) => {
      const { summary } = res.body.data
      expect(summary).to.have.all.keys(
        'totalProducts',
        'activeProducts',
        'inactiveProducts',
        'totalQuantity',
        'totalUsageQuantity',
        'favoriteProducts'
      )
    })
  })

  it('all summary values are non-negative numbers', () => {
    cy.getInventoryDashboard().then((res) => {
      const { summary } = res.body.data
      Object.values(summary).forEach((val) => {
        expect(val).to.be.a('number').and.gte(0)
      })
    })
  })

  it('activeProducts + inactiveProducts <= totalProducts', () => {
    cy.getInventoryDashboard().then((res) => {
      const { summary } = res.body.data
      expect(summary.activeProducts + summary.inactiveProducts).to.be.lte(summary.totalProducts)
    })
  })

  it('favoriteProducts <= totalProducts', () => {
    cy.getInventoryDashboard().then((res) => {
      const { summary } = res.body.data
      expect(summary.favoriteProducts).to.be.lte(summary.totalProducts)
    })
  })

  // ─── cost per use data ────────────────────────────────────────────────────

  it('top5 items have all required keys', () => {
    cy.getInventoryDashboard().then((res) => {
      const { top5 } = res.body.data
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

  it('is_favorite is a boolean on all top5 items', () => {
    cy.getInventoryDashboard().then((res) => {
      const { top5 } = res.body.data
      if (top5.length === 0) return
      top5.forEach((item) => {
        expect(item.is_favorite).to.be.a('boolean')
      })
    })
  })

  it('cost_per_use is null or a positive number on top5 items', () => {
    cy.getInventoryDashboard().then((res) => {
      const { top5 } = res.body.data
      top5.forEach((item) => {
        if (item.cost_per_use !== null) {
          expect(item.cost_per_use).to.be.a('number')
          expect(item.cost_per_use).to.be.gt(0)
        }
      })
    })
  })

  it('top5 is sorted DESC by cost_per_use (nulls last)', () => {
    cy.getInventoryDashboard().then((res) => {
      const { top5 } = res.body.data
      if (top5.length <= 1) return
      const nonNullItems = top5.filter((i) => i.cost_per_use !== null)
      for (let i = 0; i < nonNullItems.length - 1; i++) {
        expect(nonNullItems[i].cost_per_use).to.be.gte(nonNullItems[i + 1].cost_per_use)
      }
      let nullStarted = false
      top5.forEach((item) => {
        if (item.cost_per_use === null) nullStarted = true
        if (nullStarted) expect(item.cost_per_use).to.be.null
      })
    })
  })

  it('top5 has at most 5 items', () => {
    cy.getInventoryDashboard().then((res) => {
      expect(res.body.data.top5.length).to.be.lte(5)
    })
  })

  it('all.length >= top5.length', () => {
    cy.getInventoryDashboard().then((res) => {
      const { top5, all } = res.body.data
      expect(all.length).to.be.gte(top5.length)
    })
  })

  it('all items have the same required keys as top5', () => {
    cy.getInventoryDashboard().then((res) => {
      const { all } = res.body.data
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

  it('quantity is a non-negative number on all items', () => {
    cy.getInventoryDashboard().then((res) => {
      const { all } = res.body.data
      if (all.length === 0) return
      all.forEach((item) => {
        expect(item.quantity).to.be.a('number').and.gte(0)
      })
    })
  })

  // ─── low stock alerts ─────────────────────────────────────────────────────

  it('all lowStockAlerts items have quantity <= 2', () => {
    cy.getInventoryDashboard().then((res) => {
      const { lowStockAlerts } = res.body.data
      lowStockAlerts.forEach((item) => {
        expect(item.quantity).to.be.lte(2)
      })
    })
  })

  it('lowStockAlerts is sorted ASC by quantity', () => {
    cy.getInventoryDashboard().then((res) => {
      const { lowStockAlerts } = res.body.data
      if (lowStockAlerts.length <= 1) return
      for (let i = 0; i < lowStockAlerts.length - 1; i++) {
        expect(lowStockAlerts[i].quantity).to.be.lte(lowStockAlerts[i + 1].quantity)
      }
    })
  })

  it('lowStockAlerts items have required keys', () => {
    cy.getInventoryDashboard().then((res) => {
      const { lowStockAlerts } = res.body.data
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

  // ─── monthly spend by type ────────────────────────────────────────────────

  it('monthlySpendByType items have required keys: month, product, brand, type, total_spent', () => {
    cy.getInventoryDashboard().then((res) => {
      const { monthlySpendByType } = res.body.data
      if (monthlySpendByType.length === 0) return
      monthlySpendByType.forEach((item) => {
        expect(item).to.include.all.keys('month', 'product', 'brand', 'type', 'total_spent')
      })
    })
  })

  it('monthlySpendByType month field is in YYYY-MM format', () => {
    const monthRegex = /^\d{4}-\d{2}$/
    cy.getInventoryDashboard().then((res) => {
      const { monthlySpendByType } = res.body.data
      monthlySpendByType.forEach((item) => {
        expect(item.month).to.match(monthRegex)
      })
    })
  })

  it('monthlySpendByType total_spent is a number >= 0', () => {
    cy.getInventoryDashboard().then((res) => {
      const { monthlySpendByType } = res.body.data
      monthlySpendByType.forEach((item) => {
        expect(item.total_spent).to.be.a('number').and.gte(0)
      })
    })
  })

  it('monthlySpendByType only includes last 6 months', () => {
    cy.getInventoryDashboard().then((res) => {
      const { monthlySpendByType } = res.body.data
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      const cutoffMonth = sixMonthsAgo.toISOString().slice(0, 7)
      monthlySpendByType.forEach((item) => {
        expect(item.month >= cutoffMonth).to.be.true
      })
    })
  })

  // ─── avg usage duration ───────────────────────────────────────────────────

  it('avgUsageDuration items have required keys', () => {
    cy.getInventoryDashboard().then((res) => {
      const { avgUsageDuration } = res.body.data
      if (avgUsageDuration.length === 0) return
      avgUsageDuration.forEach((item) => {
        expect(item).to.include.all.keys('product_list_id', 'product', 'brand', 'type', 'avg_days')
      })
    })
  })

  it('avgUsageDuration avg_days is a non-negative number', () => {
    cy.getInventoryDashboard().then((res) => {
      const { avgUsageDuration } = res.body.data
      avgUsageDuration.forEach((item) => {
        expect(item.avg_days).to.be.a('number').and.gte(0)
      })
    })
  })

  it('avgUsageDuration is sorted DESC by avg_days', () => {
    cy.getInventoryDashboard().then((res) => {
      const { avgUsageDuration } = res.body.data
      if (avgUsageDuration.length <= 1) return
      for (let i = 0; i < avgUsageDuration.length - 1; i++) {
        expect(avgUsageDuration[i].avg_days).to.be.gte(avgUsageDuration[i + 1].avg_days)
      }
    })
  })

  // ─── most restocked ───────────────────────────────────────────────────────

  it('mostRestocked items have required keys', () => {
    cy.getInventoryDashboard().then((res) => {
      const { mostRestocked } = res.body.data
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

  it('mostRestocked restock_count is a positive integer', () => {
    cy.getInventoryDashboard().then((res) => {
      const { mostRestocked } = res.body.data
      mostRestocked.forEach((item) => {
        expect(item.restock_count).to.be.a('number').and.gte(1)
      })
    })
  })

  it('mostRestocked last_restock_date is a parseable date string', () => {
    cy.getInventoryDashboard().then((res) => {
      const { mostRestocked } = res.body.data
      if (mostRestocked.length === 0) return
      mostRestocked.forEach((item) => {
        expect(new Date(item.last_restock_date).getTime()).to.not.be.NaN
      })
    })
  })

  it('mostRestocked is sorted DESC by restock_count', () => {
    cy.getInventoryDashboard().then((res) => {
      const { mostRestocked } = res.body.data
      if (mostRestocked.length <= 1) return
      for (let i = 0; i < mostRestocked.length - 1; i++) {
        expect(mostRestocked[i].restock_count).to.be.gte(mostRestocked[i + 1].restock_count)
      }
    })
  })

  // ─── spend comparison ─────────────────────────────────────────────────────

  it('spendComparison has all required keys and structure', () => {
    cy.getInventoryDashboard().then((res) => {
      const { spendComparison } = res.body.data
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

  it('spendComparison month fields are in YYYY-MM format', () => {
    const monthRegex = /^\d{4}-\d{2}$/
    cy.getInventoryDashboard().then((res) => {
      const { spendComparison } = res.body.data
      expect(spendComparison.thisMonth.month).to.match(monthRegex)
      expect(spendComparison.lastMonth.month).to.match(monthRegex)
    })
  })

  it('spendComparison totals are numbers >= 0', () => {
    cy.getInventoryDashboard().then((res) => {
      const { spendComparison } = res.body.data
      expect(spendComparison.thisMonth.total).to.be.a('number').and.gte(0)
      expect(spendComparison.lastMonth.total).to.be.a('number').and.gte(0)
    })
  })

  it('spendComparison delta equals thisMonth.total - lastMonth.total', () => {
    cy.getInventoryDashboard().then((res) => {
      const { spendComparison } = res.body.data
      const expected = spendComparison.thisMonth.total - spendComparison.lastMonth.total
      expect(spendComparison.delta).to.eq(expected)
    })
  })

  it('spendComparison deltaPercent is null when lastMonth.total is 0', () => {
    cy.getInventoryDashboard().then((res) => {
      const { spendComparison } = res.body.data
      if (spendComparison.lastMonth.total === 0) {
        expect(spendComparison.deltaPercent).to.be.null
      }
    })
  })

  it('spendComparison deltaPercent is a number when lastMonth.total > 0', () => {
    cy.getInventoryDashboard().then((res) => {
      const { spendComparison } = res.body.data
      if (spendComparison.lastMonth.total > 0) {
        expect(spendComparison.deltaPercent).to.be.a('number')
      }
    })
  })

  it('recent3 has exactly 3 entries with month and total', () => {
    cy.getInventoryDashboard().then((res) => {
      const { spendComparison } = res.body.data
      expect(spendComparison.recent3).to.have.length(3)
      spendComparison.recent3.forEach((m) => {
        expect(m).to.include.all.keys('month', 'total')
        expect(m.total).to.be.a('number').and.gte(0)
      })
    })
  })

  it('recent3 months are in YYYY-MM format', () => {
    const monthRegex = /^\d{4}-\d{2}$/
    cy.getInventoryDashboard().then((res) => {
      const { spendComparison } = res.body.data
      spendComparison.recent3.forEach((m) => {
        expect(m.month).to.match(monthRegex)
      })
    })
  })

  it('trend6 has exactly 6 entries ordered oldest to newest', () => {
    cy.getInventoryDashboard().then((res) => {
      const { spendComparison } = res.body.data
      expect(spendComparison.trend6).to.have.length(6)
      for (let i = 1; i < spendComparison.trend6.length; i++) {
        expect(spendComparison.trend6[i].month >= spendComparison.trend6[i - 1].month).to.be.true
      }
    })
  })

  // ─── cost per use history ─────────────────────────────────────────────────

  it('costPerUseHistory items have required keys', () => {
    cy.getInventoryDashboard().then((res) => {
      const { costPerUseHistory } = res.body.data
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

  it('costPerUseHistory total_units is a non-negative number on each item', () => {
    cy.getInventoryDashboard().then((res) => {
      const { costPerUseHistory } = res.body.data
      if (costPerUseHistory.length === 0) return
      costPerUseHistory.forEach((item) => {
        expect(item.total_units).to.be.a('number').and.gte(0)
      })
    })
  })

  it('costPerUseHistory history entries have required keys', () => {
    cy.getInventoryDashboard().then((res) => {
      const { costPerUseHistory } = res.body.data
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

  it('costPerUseHistory cost_per_use is a non-negative number in each history entry', () => {
    cy.getInventoryDashboard().then((res) => {
      const { costPerUseHistory } = res.body.data
      costPerUseHistory.forEach((item) => {
        item.history.forEach((h) => {
          expect(h.cost_per_use).to.be.a('number').and.gte(0)
        })
      })
    })
  })

  it('costPerUseHistory cumulative_spent is monotonically increasing within each product', () => {
    cy.getInventoryDashboard().then((res) => {
      const { costPerUseHistory } = res.body.data
      costPerUseHistory.forEach((item) => {
        if (item.history.length <= 1) return
        for (let i = 1; i < item.history.length; i++) {
          expect(item.history[i].cumulative_spent).to.be.gte(item.history[i - 1].cumulative_spent)
        }
      })
    })
  })

  it('costPerUseHistory first history entry delta is null', () => {
    cy.getInventoryDashboard().then((res) => {
      const { costPerUseHistory } = res.body.data
      costPerUseHistory.forEach((item) => {
        if (item.history.length === 0) return
        expect(item.history[0].delta).to.be.null
      })
    })
  })

  // ─── restock prediction ───────────────────────────────────────────────────

  it('restockPrediction items have required keys', () => {
    cy.getInventoryDashboard().then((res) => {
      const { restockPrediction } = res.body.data
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

  it('restockPrediction days_until_empty is a non-negative number', () => {
    cy.getInventoryDashboard().then((res) => {
      const { restockPrediction } = res.body.data
      restockPrediction.forEach((item) => {
        expect(item.days_until_empty).to.be.a('number').and.gte(0)
      })
    })
  })

  it('restockPrediction predicted_date is null when quantity is 0', () => {
    cy.getInventoryDashboard().then((res) => {
      const { restockPrediction } = res.body.data
      restockPrediction.forEach((item) => {
        if (item.quantity === 0) {
          expect(item.predicted_date).to.be.null
          expect(item.days_until_empty).to.eq(0)
        }
      })
    })
  })

  it('restockPrediction is sorted DESC by days_until_empty', () => {
    cy.getInventoryDashboard().then((res) => {
      const { restockPrediction } = res.body.data
      if (restockPrediction.length <= 1) return
      for (let i = 0; i < restockPrediction.length - 1; i++) {
        expect(restockPrediction[i].days_until_empty).to.be.gte(
          restockPrediction[i + 1].days_until_empty
        )
      }
    })
  })

  // ─── spending heatmap ─────────────────────────────────────────────────────

  it('spendingHeatmap items have required keys: date, total', () => {
    cy.getInventoryDashboard().then((res) => {
      const { spendingHeatmap } = res.body.data
      if (spendingHeatmap.length === 0) return
      spendingHeatmap.forEach((item) => {
        expect(item).to.include.all.keys('date', 'total')
      })
    })
  })

  it('spendingHeatmap date is in YYYY-MM-DD format', () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    cy.getInventoryDashboard().then((res) => {
      const { spendingHeatmap } = res.body.data
      spendingHeatmap.forEach((item) => {
        expect(item.date).to.match(dateRegex)
      })
    })
  })

  it('spendingHeatmap total is a positive number', () => {
    cy.getInventoryDashboard().then((res) => {
      const { spendingHeatmap } = res.body.data
      spendingHeatmap.forEach((item) => {
        expect(item.total).to.be.a('number').and.gt(0)
      })
    })
  })

  it('spendingHeatmap only includes last 12 months', () => {
    cy.getInventoryDashboard().then((res) => {
      const { spendingHeatmap } = res.body.data
      const oneYearAgo = new Date()
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1)
      const cutoff = oneYearAgo.toISOString().slice(0, 10)
      spendingHeatmap.forEach((item) => {
        expect(item.date >= cutoff).to.be.true
      })
    })
  })

  // ─── lifecycle score ──────────────────────────────────────────────────────

  it('lifecycleScore items have required keys', () => {
    cy.getInventoryDashboard().then((res) => {
      const { lifecycleScore } = res.body.data
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

  it('lifecycleScore cost_per_use is null or a non-negative number', () => {
    cy.getInventoryDashboard().then((res) => {
      const { lifecycleScore } = res.body.data
      if (lifecycleScore.length === 0) return
      lifecycleScore.forEach((item) => {
        if (item.cost_per_use !== null) {
          expect(item.cost_per_use).to.be.a('number').and.gte(0)
        }
      })
    })
  })

  it('lifecycleScore avg_days is null or a non-negative number', () => {
    cy.getInventoryDashboard().then((res) => {
      const { lifecycleScore } = res.body.data
      if (lifecycleScore.length === 0) return
      lifecycleScore.forEach((item) => {
        if (item.avg_days !== null) {
          expect(item.avg_days).to.be.a('number').and.gte(0)
        }
      })
    })
  })

  it('lifecycleScore score is an integer between 0 and 100', () => {
    cy.getInventoryDashboard().then((res) => {
      const { lifecycleScore } = res.body.data
      lifecycleScore.forEach((item) => {
        expect(item.score).to.be.a('number').and.gte(0).and.lte(100)
        expect(item.score % 1).to.eq(0)
      })
    })
  })

  it('lifecycleScore is sorted DESC by score', () => {
    cy.getInventoryDashboard().then((res) => {
      const { lifecycleScore } = res.body.data
      if (lifecycleScore.length <= 1) return
      for (let i = 0; i < lifecycleScore.length - 1; i++) {
        expect(lifecycleScore[i].score).to.be.gte(lifecycleScore[i + 1].score)
      }
    })
  })

  // ─── performance ─────────────────────────────────────────────────────────

  it('dashboard responds within 2000ms', () => {
    const start = Date.now()
    cy.getInventoryDashboard().then((res) => {
      expect(res.status).to.eq(200)
      expect(Date.now() - start).to.be.lte(2000)
    })
  })

  // ─── budget GET ───────────────────────────────────────────────────────────

  it('GET budget returns 200 with success and data array for authenticated user', () => {
    cy.getInventoryBudget().then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.success).to.be.true
      expect(res.body.data).to.be.an('array')
    })
  })

  it('GET budget returns 401 when unauthenticated', () => {
    cy.getInventoryBudgetNoAuth().then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('budget items have type and monthly_budget keys', () => {
    cy.getInventoryBudget().then((res) => {
      const data = res.body.data
      if (data.length === 0) return
      data.forEach((item) => {
        expect(item).to.include.all.keys('type', 'monthly_budget')
      })
    })
  })

  it('budget monthly_budget coerces to a non-negative number on each item', () => {
    cy.getInventoryBudget().then((res) => {
      const data = res.body.data
      if (data.length === 0) return
      data.forEach((item) => {
        expect(Number(item.monthly_budget)).to.be.a('number').and.gte(0)
      })
    })
  })

  // ─── budget POST ──────────────────────────────────────────────────────────

  it('POST budget upserts and returns success', () => {
    cy.postInventoryBudget({ type: '_cy_test_type', monthly_budget: 100000 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.success).to.be.true
    })
  })

  it('POST budget persists the saved value — GET returns the upserted budget', () => {
    cy.postInventoryBudget({ type: '_cy_test_type', monthly_budget: 250000 }).then(() => {
      cy.getInventoryBudget().then((res) => {
        const found = res.body.data.find((b) => b.type === '_cy_test_type')
        expect(found).to.exist
        expect(Number(found.monthly_budget)).to.eq(250000)
      })
    })
  })

  it('POST budget returns 401 when unauthenticated', () => {
    cy.postInventoryBudgetNoAuth({ type: '_cy_test_type', monthly_budget: 100000 }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('POST budget returns 400 when monthly_budget is missing', () => {
    cy.postInventoryBudget({ type: '_cy_test_type' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('POST budget returns 400 when type is missing', () => {
    cy.postInventoryBudget({ monthly_budget: 50000 }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('POST budget returns 400 when type does not exist in product list', () => {
    cy.postInventoryBudget({ type: '__nonexistent_type_xyz__', monthly_budget: 50000 }).then(
      (res) => {
        expect(res.status).to.eq(400)
      }
    )
  })
})
