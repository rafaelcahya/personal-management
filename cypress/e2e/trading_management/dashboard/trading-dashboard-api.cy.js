describe('Trading Dashboard API', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // ─── GET /api/trade/v1/dashboard/metrics ──────────────────────────────────

  describe('GET /api/trade/v1/dashboard/metrics', () => {
    describe('Authentication', () => {
      it('should return 200 for authenticated user', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.be.true
        })
      })

      it('should return 401 without authentication', () => {
        cy.clearApiAuth()
        cy.GetTradingDashboardMetricsNoAuth().then((response) => {
          expect(response.status).to.be.oneOf([307, 401])

          if (response.status === 401 && response.body?.success !== undefined) {
            expect(response.body.success).to.be.false
          }

          if (response.status === 307) {
            const location = response.headers.location ?? ''
            expect(String(location)).to.include('/login')
          }
        })
      })
    })

    describe('Response Structure', () => {
      it('should return correct top-level keys', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          expect(response.body).to.have.all.keys('success', 'data')
          expect(response.body.success).to.be.true
          expect(response.body.data).to.be.an('object')
        })
      })

      it('should return correct content-type', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          expect(response.headers['content-type']).to.include('application/json')
        })
      })

      it('should return all required metric fields', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          const data = response.body.data

          expect(data).to.include.all.keys([
            'initialMargin',
            'accountValue',
            'pnl',
            'portfolioGrowth',
            'totalTrades',
            'winCount',
            'loseCount',
            'winRate',
            'loseRate',
            'avgProfit',
            'avgLoss',
            'totalProfit',
            'totalLoss',
            'profitPerTrade',
            'lossPerTrade',
            'expectedValue',
            'profitFactor',
            'payoffRatio',
            'sharpeBI',
            'sharpePersonal',
            'stdDevRupiah',
            'bullTP',
            'baseTP',
            'bearTP',
            'bullSL',
            'baseSL',
            'bearSL',
            'pnlLastMonth',
            'winsLastMonth',
            'lossesLastMonth',
            'biSharpeRatio',
            'personalSharpeRatio',
            'marginOfError',
            'averagePnL',
            'biggestProfit',
            'lowestProfit',
            'biggestLoss',
            'lowestLoss',
            'profitFactorComment',
            'payoffComment',
            'sharpeBIComment',
            'sharpePersonalComment',
            'stdDevComment',
            'safeZoneAvgProfitWithMoe',
            'safeZoneAvgLossWithMoe',
            'timesToZeroWithoutMoe',
            'timesToZeroWithMoe',
            'avgReturn',
          ])
        })
      })
    })

    describe('Data Types', () => {
      it('should return numeric types for financial fields', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          const data = response.body.data

          expect(data.initialMargin).to.be.a('number')
          expect(data.accountValue).to.be.a('number')
          expect(data.pnl).to.be.a('number')
          expect(data.portfolioGrowth).to.be.a('number')
          expect(data.totalTrades).to.be.a('number')
          expect(data.winRate).to.be.a('number')
          expect(data.loseRate).to.be.a('number')
          expect(data.stdDevRupiah).to.be.a('number')
          expect(data.sharpeBI).to.be.a('number')
          expect(data.sharpePersonal).to.be.a('number')
        })
      })

      it('profitFactor and payoffRatio should be number or null', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          const { profitFactor, payoffRatio } = response.body.data

          if (profitFactor !== null) {
            expect(profitFactor).to.be.a('number')
          }

          if (payoffRatio !== null) {
            expect(payoffRatio).to.be.a('number')
          }
        })
      })

      it('should return string types for comment fields', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          const data = response.body.data

          expect(data.profitFactorComment).to.be.a('string')
          expect(data.payoffComment).to.be.a('string')
          expect(data.sharpeBIComment).to.be.a('string')
          expect(data.sharpePersonalComment).to.be.a('string')
          expect(data.stdDevComment).to.be.a('string')
        })
      })
    })

    describe('Business Logic', () => {
      it('winRate + loseRate should not exceed 100', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          const { winRate, loseRate } = response.body.data
          expect(winRate + loseRate).to.be.lte(100)
        })
      })

      it('winCount + loseCount should equal totalTrades or less (breakeven exists)', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          const { winCount, loseCount, totalTrades } = response.body.data
          expect(winCount + loseCount).to.be.lte(totalTrades)
        })
      })

      it('accountValue should equal initialMargin + pnl', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          const { initialMargin, pnl, accountValue } = response.body.data
          expect(accountValue).to.be.closeTo(initialMargin + pnl, 1)
        })
      })

      it('profitFactor comment should be valid enum value', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          const { profitFactorComment } = response.body.data
          expect(profitFactorComment).to.be.oneOf([
            'Perfect',
            'Excellent',
            'Good',
            'Acceptable',
            'Needs Improvement',
            'No Data',
          ])
        })
      })

      it('Sharpe comment should be valid enum value', () => {
        cy.GetTradingDashboardMetrics().then((response) => {
          const { sharpeBIComment } = response.body.data
          expect(sharpeBIComment).to.be.oneOf(['Excellent', 'Good', 'Fair', 'Poor', 'No Data'])
        })
      })
    })

    describe('Performance', () => {
      it('should respond within 2000ms', () => {
        const start = Date.now()
        cy.GetTradingDashboardMetrics().then((response) => {
          expect(response.status).to.eq(200)
          expect(Date.now() - start).to.be.lte(2000)
        })
      })
    })
  })

  // ─── GET /api/trade/v1/dashboard/quick-view ───────────────────────────────

  describe('GET /api/trade/v1/dashboard/quick-view', () => {
    describe('Authentication', () => {
      it('should return 200 for authenticated user', () => {
        cy.GetTradingDashboardQuickView().then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.be.true
        })
      })

      it('should return 401 without authentication', () => {
        cy.clearApiAuth()
        cy.GetTradingDashboardQuickViewNoAuth().then((response) => {
          expect(response.status).to.be.oneOf([307, 401])

          if (response.status === 401 && response.body?.success !== undefined) {
            expect(response.body.success).to.be.false
          }

          if (response.status === 307) {
            const location = response.headers.location ?? ''
            expect(String(location)).to.include('/login')
          }
        })
      })
    })

    describe('Response Structure', () => {
      it('should return correct top-level keys', () => {
        cy.GetTradingDashboardQuickView().then((response) => {
          expect(response.body).to.have.all.keys('success', 'data')
          expect(response.body.success).to.be.true
          expect(response.body.data).to.be.an('object')
        })
      })

      it('should return trades, events, fees arrays in data', () => {
        cy.GetTradingDashboardQuickView().then((response) => {
          const data = response.body.data
          expect(data).to.have.all.keys('trades', 'events', 'fees')
          expect(data.trades).to.be.an('array')
          expect(data.events).to.be.an('array')
          expect(data.fees).to.be.an('array')
        })
      })

      it('should return correct content-type', () => {
        cy.GetTradingDashboardQuickView().then((response) => {
          expect(response.headers['content-type']).to.include('application/json')
        })
      })
    })

    describe('Limit Parameter', () => {
      it('should default to 5 items max when no limit given', () => {
        cy.GetTradingDashboardQuickView().then((response) => {
          const { trades, events, fees } = response.body.data
          expect(trades.length).to.be.lte(5)
          expect(events.length).to.be.lte(5)
          expect(fees.length).to.be.lte(5)
        })
      })

      it('should respect limit query param', () => {
        cy.GetTradingDashboardQuickView({ limit: 3 }).then((response) => {
          expect(response.status).to.eq(200)
          const { trades, events, fees } = response.body.data
          expect(trades.length).to.be.lte(3)
          expect(events.length).to.be.lte(3)
          expect(fees.length).to.be.lte(3)
        })
      })

      it('should return 400 when limit is below 1', () => {
        cy.GetTradingDashboardQuickView({ limit: 0 }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('Limit must be between 1 and 50')
        })
      })

      it('should return 400 when limit exceeds 50', () => {
        cy.GetTradingDashboardQuickView({ limit: 51 }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.eq('Limit must be between 1 and 50')
        })
      })
    })

    describe('Data Structure — Trades', () => {
      it('each trade item should have required fields', () => {
        cy.GetTradingDashboardQuickView().then((response) => {
          const { trades } = response.body.data
          if (trades.length === 0) return

          const item = trades[0]
          expect(item).to.include.all.keys(['id', 'ticker', 'realized_gain', 'sell_date'])
        })
      })
    })

    describe('Data Structure — Events', () => {
      it('each event item should have required fields', () => {
        cy.GetTradingDashboardQuickView().then((response) => {
          const { events } = response.body.data
          if (events.length === 0) return

          const item = events[0]
          expect(item).to.include.all.keys(['id', 'event_date', 'title', 'event_description'])
        })
      })
    })

    describe('Data Structure — Fees', () => {
      it('each fee item should have required fields', () => {
        cy.GetTradingDashboardQuickView().then((response) => {
          const { fees } = response.body.data
          if (fees.length === 0) return

          const item = fees[0]
          expect(item).to.include.all.keys(['id', 'fee_date', 'fee', 'fee_name'])
        })
      })
    })

    describe('Performance', () => {
      it('should respond within 2000ms', () => {
        const start = Date.now()
        cy.GetTradingDashboardQuickView().then((response) => {
          expect(response.status).to.eq(200)
          expect(Date.now() - start).to.be.lte(2000)
        })
      })
    })
  })

  // ─── GET /api/trade/v1/trade/daily-pnl ────────────────────────────────────

  describe('GET /api/trade/v1/trade/daily-pnl', () => {
    describe('Authentication', () => {
      it('should return 200 for authenticated user', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2026, month: 8 }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.be.true
        })
      })

      it('should return 401 without authentication', () => {
        cy.clearApiAuth()
        cy.GetTradingDashboardDailyPnlNoAuth().then((response) => {
          expect(response.status).to.be.oneOf([307, 401])

          if (response.status === 401 && response.body?.success !== undefined) {
            expect(response.body.success).to.be.false
          }

          if (response.status === 307) {
            const location = response.headers.location ?? ''
            expect(String(location)).to.include('/login')
          }
        })
      })
    })

    describe('Response Structure', () => {
      it('should return correct top-level keys', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2026, month: 8 }).then((response) => {
          expect(response.body).to.have.all.keys('success', 'data')
          expect(response.body.success).to.be.true
          expect(response.body.data).to.be.an('array')
        })
      })

      it('should return correct content-type', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2026, month: 8 }).then((response) => {
          expect(response.headers['content-type']).to.include('application/json')
        })
      })

      it('each item should have required fields with correct types', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2026, month: 8 }).then((response) => {
          const { data } = response.body
          if (data.length === 0) return

          const item = data[0]
          expect(item).to.include.all.keys(['date', 'pnl', 'count'])
          expect(item.date).to.match(/^\d{4}-\d{2}-\d{2}$/)
          expect(item.pnl).to.be.a('number')
          expect(item.count).to.be.a('number')
        })
      })
    })

    describe('Query Param Validation', () => {
      it('should return 400 when year is missing', () => {
        cy.GetTradingDashboardDailyPnl({ month: 8 }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
        })
      })

      it('should return 400 when month is missing', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2026 }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
        })
      })

      it('should return 400 when month is 0', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2026, month: 0 }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
        })
      })

      it('should return 400 when month is 13', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2026, month: 13 }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
        })
      })

      it('should return 400 when year is below 2000', () => {
        cy.GetTradingDashboardDailyPnl({ year: 1999, month: 8 }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
        })
      })

      it('should return 400 when year is above 2100', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2101, month: 8 }).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
        })
      })

      it('should return 200 for valid year and month', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2026, month: 8 }).then((response) => {
          expect(response.status).to.eq(200)
        })
      })
    })

    describe('Business Logic', () => {
      it('count should be at least 1 for every item', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2026, month: 8 }).then((response) => {
          const { data } = response.body
          data.forEach((item) => {
            expect(item.count).to.be.gte(1)
          })
        })
      })

      it('date values should fall within the requested month', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2026, month: 8 }).then((response) => {
          const { data } = response.body
          data.forEach((item) => {
            expect(item.date.startsWith('2026-08')).to.be.true
          })
        })
      })

      it('should return empty array for a future month with no trades', () => {
        cy.GetTradingDashboardDailyPnl({ year: 2099, month: 12 }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.success).to.be.true
          expect(response.body.data).to.be.an('array').that.is.empty
        })
      })
    })

    describe('Performance', () => {
      it('should respond within 2000ms', () => {
        const start = Date.now()
        cy.GetTradingDashboardDailyPnl({ year: 2026, month: 8 }).then((response) => {
          expect(response.status).to.eq(200)
          expect(Date.now() - start).to.be.lte(2000)
        })
      })
    })
  })
})
