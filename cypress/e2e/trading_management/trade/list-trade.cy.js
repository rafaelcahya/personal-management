import { faker } from '@faker-js/faker'

describe('Trade List API - GET /api/trade/v1/trade/list', () => {
  let testUserId
  let testTradeIds = []

  const makeTradeRequest = () => ({
    trade_date: faker.date.recent(),
    ticker: faker.word.noun(4).toUpperCase(),
    margin: faker.string.numeric(5),
    proceeds: faker.string.numeric(5),
    return_percent: faker.string.numeric(),
    realized_gain: faker.string.numeric(5),
    stock_type_option: faker.animal.snake(),
    entry_session_option: faker.animal.snake(),
    entry_occasion_option: faker.animal.snake(),
    buy_reason_option: faker.animal.snake(),
    sell_reason_option: faker.animal.snake(),
    notes: faker.word.words(25),
  })

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    Cypress._.times(3, () => {
      cy.AddTrade(makeTradeRequest()).then((response) => {
        expect(response.status).to.eq(201)
        const trade = response.body.trade
        testUserId = trade.user_id
        testTradeIds.push(trade.id)
      })
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // ─── auth guard ───────────────────────────────────────────────────────────

  it('returns 200 with valid session', () => {
    cy.GetListTrade().then((response) => {
      expect(response.status).to.eq(200)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.GetListTradeNoAuth().then((response) => {
      expect(response.status).to.be.oneOf([401, 307])
      if (response.status === 401) {
        expect(response.body.error).to.eq('Unauthorized')
      }
    })
  })

  // ─── response shape ───────────────────────────────────────────────────────

  it('returns correct response structure', () => {
    cy.GetListTrade().then((response) => {
      expect(response.body).to.have.property('data')
      expect(response.body).to.have.property('message')
      expect(response.body.message).to.eq('OK')

      const { data } = response.body
      expect(data).to.have.property('trades').that.is.an('array')
      expect(data).to.have.property('total').that.is.a('number')
      expect(data).to.have.property('page').that.is.a('number')
      expect(data).to.have.property('limit').that.is.a('number')
    })
  })

  it('returns all created test trades in data.trades', () => {
    cy.GetListTrade().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.trades.length).to.be.gte(testTradeIds.length)
      testTradeIds.forEach((id) => {
        expect(response.body.data.trades.some((t) => t.id === id)).to.be.true
      })
    })
  })

  it("returns only authenticated user's trades", () => {
    cy.GetListTrade({ limit: 100 }).then((response) => {
      expect(response.status).to.eq(200)
      const apiTotal = response.body.data.total

      cy.getTestUserId().then((userId) => {
        cy.getTotalTradesFromDb(userId).then((dbTotal) => {
          expect(apiTotal).to.eq(dbTotal)
        })
      })
    })
  })

  it('sorts trades by trade_date DESC', () => {
    cy.GetListTrade().then((response) => {
      const trades = response.body.data.trades
      for (let i = 0; i < trades.length - 1; i++) {
        const date1 = new Date(trades[i].trade_date)
        const date2 = new Date(trades[i + 1].trade_date)
        expect(date1.getTime()).to.gte(date2.getTime())
      }
    })
  })

  // ─── pagination ───────────────────────────────────────────────────────────

  it('respects limit param — page=1&limit=2 returns at most 2 trades', () => {
    cy.GetListTrade({ page: 1, limit: 2 }).then((response) => {
      expect(response.status).to.eq(200)
      const { data } = response.body
      expect(data.trades.length).to.be.lte(2)
      expect(data.page).to.eq(1)
      expect(data.limit).to.eq(2)
      expect(data.total).to.be.gte(data.trades.length)
    })
  })

  // ─── ticker search ────────────────────────────────────────────────────────

  it('filters trades by ticker search param', () => {
    const uniqueTicker = 'TESTXX'

    cy.AddTrade({ ...makeTradeRequest(), ticker: uniqueTicker }).then((createRes) => {
      expect(createRes.status).to.eq(201)

      cy.GetListTrade({ ticker: uniqueTicker }).then((response) => {
        expect(response.status).to.eq(200)
        const { data } = response.body
        expect(data.trades).to.be.an('array')
        expect(data.trades.length).to.be.gte(1)
        data.trades.forEach((trade) => {
          expect(trade.ticker.toUpperCase().includes(uniqueTicker.toUpperCase())).to.be.true
        })
      })
    })
  })

  it('returns all trades when ticker param is empty string', () => {
    cy.GetListTrade({ ticker: '' }).then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.data.total).to.be.gte(testTradeIds.length)
    })
  })

  // ─── db comparison ────────────────────────────────────────────────────────

  it('data.total matches total trades count in database', () => {
    let apiTotal

    cy.GetListTrade().then((response) => {
      apiTotal = response.body.data.total
      cy.log(`API total: ${apiTotal}`)
    })

    cy.getTestUserId().then((userId) => {
      cy.getTotalTradesFromDb(userId).then((dbTotal) => {
        cy.log(`DB total: ${dbTotal}`)
        expect(apiTotal).to.eq(dbTotal)
      })
    })
  })

  it('ticker search result count matches database filtered count', () => {
    const searchTicker = 'TESTXX'
    let apiCount

    cy.GetListTrade({ ticker: searchTicker, limit: 100 }).then((response) => {
      expect(response.status).to.eq(200)
      apiCount = response.body.data.trades.length
      cy.log(`API ticker search count: ${apiCount}`)
    })

    cy.getTradesFromDb().then((allTrades) => {
      const dbFiltered = allTrades.filter((t) =>
        t.ticker.toUpperCase().includes(searchTicker.toUpperCase())
      )
      cy.log(`DB filtered count: ${dbFiltered.length}`)
      expect(apiCount).to.eq(dbFiltered.length)
    })
  })

  // ─── performance ──────────────────────────────────────────────────────────

  it('responds within 1000ms', () => {
    const start = Date.now()
    cy.GetListTrade().then(() => {
      const duration = Date.now() - start
      expect(duration).to.be.lte(1000)
      cy.log(`Response time: ${duration}ms`)
    })
  })
})
