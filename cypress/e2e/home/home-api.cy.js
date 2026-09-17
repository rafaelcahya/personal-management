// ─── unified home dashboard (issue #821) ────────────────────────────────────
// Each domain highlight is a separate authenticated GET so a slow/failing
// domain can't block the others. Response shape is { data }.

describe('Home API — GET /home/v1/inventory', () => {
  describe('auth guard', () => {
    beforeEach(() => {
      cy.clearCookies()
      cy.clearLocalStorage()
    })

    it('returns 401 when unauthenticated', () => {
      cy.getHomeInventoryNoAuth().then((res) => {
        expect(res.status).to.eq(401)
      })
    })
  })

  describe('response shape', () => {
    beforeEach(() => {
      cy.setupApiAuthCookies()
    })

    it('returns 200 with a data object', () => {
      cy.getHomeInventory().then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.be.an('object')
      })
    })

    it('data has all expected keys', () => {
      cy.getHomeInventory().then((res) => {
        expect(res.body.data).to.include.all.keys(
          'totalProducts',
          'activeProducts',
          'favoriteProducts',
          'lowStockCount',
          'lowStockItems'
        )
      })
    })

    it('counts are non-negative integers', () => {
      cy.getHomeInventory().then((res) => {
        const d = res.body.data
        for (const k of ['totalProducts', 'activeProducts', 'favoriteProducts', 'lowStockCount']) {
          expect(Number.isInteger(d[k]), `${k} integer`).to.eq(true)
          expect(d[k], `${k} >= 0`).to.be.gte(0)
        }
      })
    })

    it('active/favorite counts never exceed total', () => {
      cy.getHomeInventory().then((res) => {
        const d = res.body.data
        expect(d.activeProducts).to.be.lte(d.totalProducts)
        expect(d.favoriteProducts).to.be.lte(d.totalProducts)
      })
    })

    it('lowStockItems is an array capped at 3 and consistent with lowStockCount', () => {
      cy.getHomeInventory().then((res) => {
        const { lowStockItems, lowStockCount } = res.body.data
        expect(lowStockItems).to.be.an('array')
        expect(lowStockItems.length).to.be.lte(3)
        expect(lowStockItems.length).to.be.lte(lowStockCount)
      })
    })

    it('each lowStockItem has id, product, brand, quantity', () => {
      cy.getHomeInventory().then((res) => {
        const { lowStockItems } = res.body.data
        if (lowStockItems.length === 0) return cy.log('No low-stock items — skipping field check')
        lowStockItems.forEach((it) => {
          expect(it).to.include.all.keys('id', 'product', 'brand', 'quantity')
        })
      })
    })
  })
})

describe('Home API — GET /home/v1/trading', () => {
  describe('auth guard', () => {
    beforeEach(() => {
      cy.clearCookies()
      cy.clearLocalStorage()
    })

    it('returns 401 when unauthenticated', () => {
      cy.getHomeTradingNoAuth().then((res) => {
        expect(res.status).to.eq(401)
      })
    })
  })

  describe('response shape', () => {
    beforeEach(() => {
      cy.setupApiAuthCookies()
    })

    it('returns 200 with a data object', () => {
      cy.getHomeTrading().then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('data')
      })
    })

    it('data has all expected keys', () => {
      cy.getHomeTrading().then((res) => {
        expect(res.body.data).to.include.all.keys(
          'pnlLastMonth',
          'portfolioGrowth',
          'winRate',
          'tradesLastMonth',
          'totalTrades'
        )
      })
    })

    it('numeric fields are numbers', () => {
      cy.getHomeTrading().then((res) => {
        const d = res.body.data
        for (const k of [
          'pnlLastMonth',
          'portfolioGrowth',
          'winRate',
          'tradesLastMonth',
          'totalTrades',
        ]) {
          expect(typeof d[k], `${k} is number`).to.eq('number')
        }
      })
    })

    it('winRate is between 0 and 100', () => {
      cy.getHomeTrading().then((res) => {
        const { winRate } = res.body.data
        expect(winRate).to.be.gte(0)
        expect(winRate).to.be.lte(100)
      })
    })

    it('tradesLastMonth and totalTrades are non-negative and consistent', () => {
      cy.getHomeTrading().then((res) => {
        const { tradesLastMonth, totalTrades } = res.body.data
        expect(tradesLastMonth).to.be.gte(0)
        expect(totalTrades).to.be.gte(0)
        expect(tradesLastMonth).to.be.lte(totalTrades)
      })
    })
  })
})

describe('Home API — GET /home/v1/running', () => {
  describe('auth guard', () => {
    beforeEach(() => {
      cy.clearCookies()
      cy.clearLocalStorage()
    })

    it('returns 401 when unauthenticated', () => {
      cy.getHomeRunningNoAuth().then((res) => {
        expect(res.status).to.eq(401)
      })
    })
  })

  describe('response shape', () => {
    beforeEach(() => {
      cy.setupApiAuthCookies()
    })

    it('returns 200 with a data object', () => {
      cy.getHomeRunning().then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('data')
      })
    })

    it('data has streak, thisWeek, nextRace keys', () => {
      cy.getHomeRunning().then((res) => {
        expect(res.body.data).to.include.all.keys('streak', 'thisWeek', 'nextRace')
      })
    })

    it('streak has current_weeks, best_weeks and unit "week"', () => {
      cy.getHomeRunning().then((res) => {
        const { streak } = res.body.data
        expect(streak).to.include.all.keys('current_weeks', 'best_weeks', 'unit')
        expect(Number.isInteger(streak.current_weeks)).to.eq(true)
        expect(Number.isInteger(streak.best_weeks)).to.eq(true)
        expect(streak.best_weeks).to.be.gte(streak.current_weeks)
        expect(streak.unit).to.eq('week')
      })
    })

    it('thisWeek has non-negative count and distance_m', () => {
      cy.getHomeRunning().then((res) => {
        const { thisWeek } = res.body.data
        expect(Number.isInteger(thisWeek.count)).to.eq(true)
        expect(thisWeek.count).to.be.gte(0)
        expect(typeof thisWeek.distance_m).to.eq('number')
        expect(thisWeek.distance_m).to.be.gte(0)
      })
    })

    it('nextRace is null or a well-formed object with non-negative days_until', () => {
      cy.getHomeRunning().then((res) => {
        const { nextRace } = res.body.data
        if (nextRace === null) return cy.log('No upcoming race — skipping nextRace field checks')
        expect(nextRace).to.include.all.keys(
          'id',
          'distance_m',
          'target_date',
          'title',
          'days_until'
        )
        expect(nextRace.days_until).to.be.gte(0)
        expect(nextRace.target_date).to.match(/^\d{4}-\d{2}-\d{2}$/)
      })
    })

    it('?tz_offset=-420 returns 200', () => {
      cy.getHomeRunning({ tz_offset: -420 }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })

    it('out-of-range tz_offset is clamped and still returns 200', () => {
      cy.getHomeRunning({ tz_offset: 999999 }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body.data).to.have.property('streak')
      })
    })

    it('invalid tz_offset falls back gracefully (200)', () => {
      cy.getHomeRunning({ tz_offset: 'invalid' }).then((res) => {
        expect(res.status).to.eq(200)
      })
    })
  })
})
