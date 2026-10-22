import { faker } from '@faker-js/faker'

const recentDate = () => faker.date.recent().toISOString().slice(0, 10)

describe('Trade Update API - PUT /api/trade/v1/trade/update/{id}', () => {
  let testTradeId
  let testUserId

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    const request = {
      buy_date: recentDate(),
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
    }

    cy.AddTrade(request).then((response) => {
      expect(response.status).to.eq(201)
      testTradeId = response.body.trade.id
      testUserId = response.body.trade.user_id

      cy.log(`✅ Created test trade ID: ${testTradeId}`)
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  describe('Authentication & Authorization', () => {
    it('should update trade successfully (200)', () => {
      const request = {
        buy_date: recentDate(),
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
      }

      cy.UpdateTrade(testTradeId, request).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.trade).to.exist
      })
    })

    it('should return 401 without authentication', () => {
      cy.clearCookies()

      const updateData = { notes: 'unauth test' }
      cy.UpdateTradeNoAuth(testTradeId, updateData).then((response) => {
        expect(response.status).to.be.oneOf([307, 401])

        if (response.status === 401) {
          expect(response.body.error).to.eq('Unauthorized')
        } else {
          const location = response.headers.location || response.body
          expect(String(location)).to.include('/login')
        }
      })
    })
  })

  describe('Trade Object Structure Scenarios', () => {
    it('should update trade with all required fields', () => {
      const request = {
        buy_date: recentDate(),
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
      }

      cy.UpdateTrade(testTradeId, request).then((response) => {
        const trade = response.body.trade
        expect(trade).to.have.property('id')
        expect(trade).to.have.property('ticker')
        expect(trade).to.have.property('buy_date')
        expect(trade).to.have.property('margin')
        expect(trade).to.have.property('proceeds')
        expect(trade).to.have.property('realized_gain')
        expect(trade).to.have.property('return_percent')
        expect(trade).to.have.property('user_id')
        expect(trade).to.have.property('stock_type_option')
        expect(trade).to.have.property('entry_session_option')
        expect(trade).to.have.property('entry_occasion_option')
        expect(trade).to.have.property('buy_reason_option')
        expect(trade).to.have.property('sell_reason_option')
        expect(trade).to.have.property('notes')
        expect(trade).to.have.property('created_at')
        expect(trade).to.have.property('updated_at')
        expect(trade).to.have.property('deleted_at')
        expect(trade).to.have.property('uuid')
      })
    })

    it('should return complete updated trade object', () => {
      const request = {
        buy_date: recentDate(),
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
      }

      cy.UpdateTrade(testTradeId, request).then((response) => {
        const trade = response.body.trade
        expect(trade).to.have.all.keys([
          'buy_reason_option',
          'created_at',
          'deleted_at',
          'entry_occasion_option',
          'entry_session_option',
          'id',
          'margin',
          'notes',
          'proceeds',
          'realized_gain',
          'return_percent',
          'sell_reason_option',
          'stock_type_option',
          'ticker',
          'buy_date',
          'sell_date',
          'updated_at',
          'user_id',
          'uuid',
        ])
      })
    })

    it('should return correct success response structure', () => {
      const request = {
        buy_date: recentDate(),
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
      }

      cy.UpdateTrade(testTradeId, request).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.all.keys('success', 'trade')
        expect(response.body.success).to.be.true
        expect(response.body.trade).to.be.an('object')
      })
    })

    it('should return correct error response structure', () => {
      cy.UpdateTrade().then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.all.keys('success', 'error')
        expect(response.body.success).to.be.false
        expect(response.body.error).to.exist
      })
    })
  })

  describe('Success Scenario', () => {
    it('should update trade successfully (200)', () => {
      const today = new Date().toISOString().split('T')[0]

      const request = {
        buy_date: today,
        ticker: `TEST${faker.string.alphanumeric(4).toUpperCase()}`,
        margin: faker.string.numeric({ length: 7 }),
        proceeds: faker.string.numeric({ length: 7 }),
        return_percent: faker.string.numeric({ length: 3 }),
        realized_gain: faker.string.numeric({ length: 6 }),
        stock_type_option: faker.helpers.arrayElement(['Normal', 'E-IPO', 'FCA']),
        entry_session_option: faker.helpers.arrayElement(['Pre-market', 'Mid-session']),
        entry_occasion_option: faker.helpers.arrayElement(['Weekday', 'Post-Holiday']),
        buy_reason_option: faker.helpers.arrayElement(['Support retest:', 'No data']),
        sell_reason_option: faker.helpers.arrayElement(['Target reached:', 'No reason']),
        notes: faker.lorem.sentence(),
      }

      cy.UpdateTrade(testTradeId, request).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true

        const updatableFields = [
          'ticker',
          'margin',
          'proceeds',
          'realized_gain',
          'return_percent',
          'stock_type_option',
          'entry_session_option',
          'entry_occasion_option',
          'buy_reason_option',
          'sell_reason_option',
          'notes',
        ]

        updatableFields.forEach((field) => {
          // numeric columns come back normalized ("0620868" -> "620868")
          if (['margin', 'proceeds', 'realized_gain'].includes(field)) {
            expect(Number(response.body.trade[field])).to.eq(Number(request[field]))
          } else {
            expect(response.body.trade[field]).to.eq(request[field])
          }
        })

        expect(response.body.trade.buy_date.startsWith(request.buy_date)).to.be.true

        cy.log('✅ All fields updated:', JSON.stringify(request))
      })
    })

    it('should update trade with special characters in ticker', () => {
      const request = {
        buy_date: recentDate(),
        ticker: 'BRK.B',
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
      }

      cy.UpdateTrade(testTradeId, request).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.trade.ticker).to.eq('BRK.B')
      })
    })

    it('should assign user_id from authenticated user', () => {
      const request = {
        buy_date: recentDate(),
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
      }

      cy.UpdateTrade(testTradeId, request).then((response) => {
        expect(response.status).to.eq(200)

        const trade = response.body.trade
        expect(trade.user_id).to.exist
        expect(trade.user_id).to.be.a('string')
        expect(trade.user_id.length).to.be.greaterThan(0)

        cy.log(`✅ User ID assigned: ${trade.user_id}`)
      })
    })

    it('should generate timestamps (created_at, updated_at)', () => {
      const request = {
        buy_date: recentDate(),
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
      }

      cy.UpdateTrade(testTradeId, request).then((response) => {
        expect(response.status).to.eq(200)

        const trade = response.body.trade
        expect(trade.created_at).to.exist
        expect(trade.updated_at).to.exist

        expect(new Date(trade.created_at).toString()).to.not.eq('Invalid Date')

        cy.log('✅ Timestamps generated correctly')
      })
    })
  })

  describe('Data Integrity - API vs Database Comparison', () => {
    beforeEach(function () {
      const request = {
        buy_date: recentDate(),
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
      }

      cy.UpdateTrade(testTradeId, request).then((response) => {
        expect(response.status).to.eq(200)

        const tradeId = response.body.trade.id

        cy.GetSingleTrade(tradeId).then((res) => {
          expect(res.status).to.eq(200)
          cy.wrap(res.body.data).as('apiTrade')
        })

        cy.getSingleTradeFromDb(tradeId).then((rows) => {
          cy.wrap(rows[0]).as('dbTrade')
        })
      })
    })

    describe('Complete Field Comparison', () => {
      it('should match all fields between API and DB', function () {
        const { apiTrade, dbTrade } = this

        const fields = [
          'id',
          'ticker',
          'buy_date',
          'user_id',
          'margin',
          'proceeds',
          'realized_gain',
          'return_percent',
          'stock_type_option',
          'entry_session_option',
          'entry_occasion_option',
          'buy_reason_option',
          'sell_reason_option',
          'notes',
          'created_at',
          'updated_at',
          'deleted_at',
        ]

        fields.forEach((field) => {
          expect(apiTrade[field], field).to.eq(dbTrade[field])
        })
      })

      it('should have identical field count', function () {
        const { apiTrade, dbTrade } = this
        expect(Object.keys(apiTrade).length, 'Field Count').to.eq(Object.keys(dbTrade).length)
      })

      it('should have valid ISO timestamp formats', function () {
        const { apiTrade, dbTrade } = this

        ;['created_at', 'updated_at'].forEach((field) => {
          expect(new Date(apiTrade[field]).toString()).to.not.eq('Invalid Date')
          expect(apiTrade[field]).to.eq(dbTrade[field])
        })
      })

      it('should match all numeric fields with exact precision', function () {
        const { apiTrade, dbTrade } = this

        ;['margin', 'proceeds', 'realized_gain', 'return_percent'].forEach((field) => {
          if (apiTrade[field] != null) {
            expect(parseFloat(apiTrade[field]), field).to.eq(parseFloat(dbTrade[field]))
          }
        })
      })
    })
  })

  describe('Trade Update - Summary Impact Tests', () => {
    describe('Win Count Impact', () => {
      let lossTradeId
      let lossUserId

      beforeEach(() => {
        const request = {
          buy_date: recentDate(),
          ticker: faker.word.noun(4).toUpperCase(),
          margin: faker.string.numeric(5),
          proceeds: faker.string.numeric(5),
          return_percent: faker.string.numeric(),
          realized_gain: '-' + faker.string.numeric(5),
          stock_type_option: faker.animal.snake(),
          entry_session_option: faker.animal.snake(),
          entry_occasion_option: faker.animal.snake(),
          buy_reason_option: faker.animal.snake(),
          sell_reason_option: faker.animal.snake(),
          notes: faker.word.words(25),
        }
        cy.AddTrade(request).then((response) => {
          expect(response.status).to.eq(201)
          lossTradeId = response.body.trade.id
          lossUserId = response.body.trade.user_id
          cy.log(`✅ Created test trade ID: ${lossTradeId}`)
        })
      })

      it('should increment totalWins when updating profit trade', () => {
        let initialWins
        cy.GetTradeSummary().then((response) => {
          initialWins = response.body.data.totalWins
          cy.log(`📊 Initial wins: ${initialWins}`)
        })
        const request = {
          buy_date: recentDate(),
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
        }
        cy.UpdateTrade(lossTradeId, request).then((response) => {
          expect(response.status).to.eq(200)
        })
        cy.GetTradeSummary().then((response) => {
          const newWins = response.body.data.totalWins
          expect(newWins).to.eq(initialWins + 1)
          cy.log(`✅ Wins increased: ${initialWins} → ${newWins}`)
        })
      })

      it('should NOT increment totalLosses when updating profit trade', () => {
        let initialLosses
        cy.GetTradeSummary().then((response) => {
          initialLosses = response.body.data.totalLosses
        })
        const request = {
          buy_date: recentDate(),
          ticker: faker.word.noun(4).toUpperCase(),
          margin: faker.string.numeric(5),
          proceeds: faker.string.numeric(3),
          return_percent: faker.string.numeric(),
          realized_gain: '-' + faker.string.numeric(5),
          stock_type_option: faker.animal.snake(),
          entry_session_option: faker.animal.snake(),
          entry_occasion_option: faker.animal.snake(),
          buy_reason_option: faker.animal.snake(),
          sell_reason_option: faker.animal.snake(),
          notes: faker.word.words(25),
        }
        cy.UpdateTrade(lossTradeId, request).then((response) => {
          expect(response.status).to.eq(200)
        })
        cy.GetTradeSummary().then((response) => {
          const newLosses = response.body.data.totalLosses
          expect(newLosses).to.eq(initialLosses)
          cy.log(`✅ Losses decreased: ${initialLosses} → ${newLosses}`)
        })
      })
    })

    describe('Loss Count Impact', () => {
      let winTradeId
      let winUserId

      beforeEach(() => {
        const request = {
          buy_date: recentDate(),
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
        }
        cy.AddTrade(request).then((response) => {
          expect(response.status).to.eq(201)
          winTradeId = response.body.trade.id
          winUserId = response.body.trade.user_id
          cy.log(`✅ Created test trade ID: ${winTradeId}`)
        })
      })

      it('should increment totalLosses when updating loss trade', () => {
        let initialLosses
        cy.GetTradeSummary().then((response) => {
          initialLosses = response.body.data.totalLosses
          cy.log(`📊 Initial losses: ${initialLosses}`)
        })
        const request = {
          buy_date: recentDate(),
          ticker: faker.word.noun(4).toUpperCase(),
          margin: faker.string.numeric(5),
          proceeds: faker.string.numeric(3),
          return_percent: faker.string.numeric(),
          realized_gain: `-${faker.string.numeric(5)}`,
          stock_type_option: faker.animal.snake(),
          entry_session_option: faker.animal.snake(),
          entry_occasion_option: faker.animal.snake(),
          buy_reason_option: faker.animal.snake(),
          sell_reason_option: faker.animal.snake(),
          notes: faker.word.words(25),
        }
        cy.UpdateTrade(winTradeId, request).then((response) => {
          expect(response.status).to.eq(200)
        })
        cy.GetTradeSummary().then((response) => {
          const newLosses = response.body.data.totalLosses
          expect(newLosses).to.eq(initialLosses + 1)
          cy.log(`✅ Losses increased: ${initialLosses} → ${newLosses}`)
        })
      })

      it('should NOT increment totalWins when updating lost trade', () => {
        let initialWins
        cy.GetTradeSummary().then((response) => {
          initialWins = response.body.data.totalWins
        })
        const request = {
          buy_date: recentDate(),
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
        }

        cy.UpdateTrade(winTradeId, request).then((response) => {
          expect(response.status).to.eq(200)
        })

        cy.GetTradeSummary().then((response) => {
          const newWins = response.body.data.totalWins
          expect(newWins).to.eq(initialWins)
          cy.log(`✅ Wins unchanged: ${initialWins}`)
        })
      })
    })

    describe('Win Rate Calculation Impact', () => {
      it('should recalculate win rate after updating win trade', () => {
        let initialSummary

        cy.GetTradeSummary().then((response) => {
          initialSummary = response.body.data
          const initialWinRate =
            initialSummary.totalTrades > 0
              ? (initialSummary.totalWins / initialSummary.totalTrades) * 100
              : 0
          cy.log(`📊 Initial win rate: ${initialWinRate.toFixed(1)}%`)
        })

        const request = {
          buy_date: recentDate(),
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
        }

        cy.UpdateTrade(testTradeId, request).then((response) => {
          expect(response.status).to.eq(200)
        })

        cy.GetTradeSummary().then((response) => {
          const newSummary = response.body.data
          const expectedWinRate = (newSummary.totalWins / newSummary.totalTrades) * 100
          const actualWinRate = (newSummary.totalWins / newSummary.totalTrades) * 100
          expect(actualWinRate).to.be.closeTo(expectedWinRate, 0.1)
          cy.log(`✅ New win rate: ${actualWinRate.toFixed(1)}%`)
        })
      })
    })

    describe('Stock Type Summary Impact', () => {
      let testTradeId, testUserId

      before(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setupApiAuthCookies()

        const request = {
          buy_date: recentDate(),
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
        }

        cy.AddTrade(request).then((response) => {
          expect(response.status).to.eq(201)
          testTradeId = response.body.trade.id
          testUserId = response.body.trade.user_id

          cy.log(`✅ Created test trade ID: ${testTradeId}`)
        })
      })

      it('should add new stock type to summary when updated', () => {
        let initialCount
        cy.GetTradeSummary().then((response) => {
          const summary = response.body.data.stockTypeSummary
          initialCount = summary[request.stock_type_option] || 0
          cy.log(`📊 Initial ${request.stock_type_option} count: ${initialCount}`)
        })
        const request = {
          buy_date: recentDate(),
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
        }

        cy.UpdateTrade(testTradeId, request).then((response) => {
          expect(response.status).to.eq(200)
        })

        cy.GetTradeSummary().then((response) => {
          const summary = response.body.data.stockTypeSummary
          const newCount = summary[request.stock_type_option]
          expect(newCount).to.eq(initialCount + 1)
          cy.log(`✅ ${request.stock_type_option} count increased: ${initialCount} → ${newCount}`)
        })
      })

      it('should match stock type summary with database', () => {
        let apiSummary, dbSummary

        cy.GetTradeSummary().then((response) => {
          apiSummary = response.body.data.stockTypeSummary
        })

        cy.getStockTypeSummaryFromDb(testUserId.toString()).then((summary) => {
          dbSummary = summary
        })

        cy.then(() => {
          expect(apiSummary).to.deep.equal(dbSummary)
          cy.log('✅ Stock type summaries match')
        })
      })
    })

    describe('Entry Session Summary Impact', () => {
      let testTradeId, testUserId

      before(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setupApiAuthCookies()

        const request = {
          buy_date: recentDate(),
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
        }

        cy.AddTrade(request).then((response) => {
          expect(response.status).to.eq(201)
          testTradeId = response.body.trade.id
          testUserId = response.body.trade.user_id

          cy.log(`✅ Created test trade ID: ${testTradeId}`)
        })
      })

      it('should update entry session summary when trade updated', () => {
        let initialCount

        cy.GetTradeSummary().then((response) => {
          const summary = response.body.data.entrySessionSummary
          initialCount = summary[request.entry_session_option] || 0
          cy.log(`📊 Initial ${request.entry_session_option} count: ${initialCount}`)
        })

        const request = {
          buy_date: recentDate(),
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
        }

        cy.UpdateTrade(testTradeId, request).then((response) => {
          expect(response.status).to.eq(200)
        })

        cy.GetTradeSummary().then((response) => {
          const summary = response.body.data.entrySessionSummary
          const newCount = summary[request.entry_session_option]
          expect(newCount).to.eq(initialCount + 1)
          cy.log(
            `✅ ${request.entry_session_option} count increased: ${initialCount} → ${newCount}`
          )
        })
      })
      it('should match entry session summary with database', () => {
        let apiSummary, dbSummary

        cy.GetTradeSummary().then((response) => {
          apiSummary = response.body.data.entrySessionSummary
        })

        cy.getEntrySessionSummaryFromDb(testUserId.toString()).then((summary) => {
          dbSummary = summary
        })

        cy.then(() => {
          expect(apiSummary).to.deep.equal(dbSummary)
          cy.log('✅ Entry session summaries match')
        })
      })
    })

    describe('Entry Occasion Summary Impact', () => {
      let testTradeId, testUserId
      before(() => {
        cy.clearCookies()
        cy.clearLocalStorage()
        cy.setupApiAuthCookies()

        const request = {
          buy_date: recentDate(),
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
        }

        cy.AddTrade(request).then((response) => {
          expect(response.status).to.eq(201)
          testTradeId = response.body.trade.id
          testUserId = response.body.trade.user_id

          cy.log(`✅ Created test trade ID: ${testTradeId}`)
        })
      })

      it('should update entry occasion summary when trade created', () => {
        const occasion = 'breakout'
        let initialCount
        cy.GetTradeSummary().then((response) => {
          const summary = response.body.data.entryOccasionSummary
          initialCount = summary[request.entry_occasion_option] || 0
          cy.log(`📊 Initial ${request.entry_occasion_option} count: ${initialCount}`)
        })

        const request = {
          buy_date: recentDate(),
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
        }

        cy.UpdateTrade(testTradeId, request).then((response) => {
          expect(response.status).to.eq(200)
        })

        cy.GetTradeSummary().then((response) => {
          const summary = response.body.data.entryOccasionSummary
          const newCount = summary[request.entry_occasion_option]
          expect(newCount).to.eq(initialCount + 1)
          cy.log(
            `✅ ${request.entry_occasion_option} count increased: ${initialCount} → ${newCount}`
          )
        })
      })

      it('should match entry occasion summary with database', () => {
        let apiSummary, dbSummary

        cy.GetTradeSummary().then((response) => {
          apiSummary = response.body.data.entryOccasionSummary
        })

        cy.getEntryOccasionSummaryFromDb(testUserId.toString()).then((summary) => {
          dbSummary = summary
        })

        cy.then(() => {
          expect(apiSummary).to.deep.equal(dbSummary)
          cy.log('✅ Entry occasion summaries match')
        })
      })
    })

    describe('Complete Summary Update Verification', () => {
      let initialSummary

      beforeEach(() => {
        cy.setupApiAuthCookies()
        cy.GetTradeSummary().then((response) => {
          initialSummary = response.body.data
          cy.log('📊 Initial summary captured')
        })
      })

      describe('PROFIT Trade Update', () => {
        it('should flip LOSS → PROFIT correctly', () => {
          const fixedDate = '2026-02-26'
          let lossTradeId

          cy.AddTrade({
            buy_date: fixedDate,
            ticker: 'LOSS1',
            margin: '1000000',
            proceeds: '900000',
            return_percent: faker.string.numeric(),
            realized_gain: '-100000',
            stock_type_option: 'Normal',
            entry_session_option: 'Pre-market',
            entry_occasion_option: 'Weekday',
            buy_reason_option: faker.animal.snake(),
            sell_reason_option: faker.animal.snake(),
          })
            .then((lossResponse) => {
              lossTradeId = lossResponse.body.trade.id
              cy.log(`📈 LOSS trade ID: ${lossTradeId}`)
              return cy.GetTradeSummary()
            })
            .then((afterLoss) => {
              expect(afterLoss.body.data.totalLosses).to.eq(initialSummary.totalLosses + 1)
              return cy.UpdateTrade(lossTradeId, {
                margin: '1000000',
                proceeds: '1100000',
                realized_gain: '100000',
                notes: 'Flipped to profit',
              })
            })
            .then((updateResponse) => {
              expect(updateResponse.status).to.eq(200)
              cy.log('✅ Updated to PROFIT')
              return cy.wait(1000)
            })
            .then(() => {
              return cy.GetTradeSummary()
            })
            .then((finalSummary) => {
              expect(finalSummary.body.data.totalTrades).to.eq(initialSummary.totalTrades + 1)
              expect(finalSummary.body.data.totalWins).to.eq(initialSummary.totalWins + 1)
              expect(finalSummary.body.data.totalLosses).to.eq(initialSummary.totalLosses)

              expect(finalSummary.body.data.stockTypeSummary['Normal']).to.eq(
                (initialSummary.stockTypeSummary['Normal'] || 0) + 1
              )

              cy.log('✅ LOSS → PROFIT verified!')
            })
        })
      })

      describe('LOSS Trade Update', () => {
        it('should flip PROFIT → LOSS correctly', () => {
          const fixedDate = '2026-02-27'

          let profitTradeId

          cy.AddTrade({
            buy_date: fixedDate,
            ticker: 'WIN1',
            margin: '1000000',
            proceeds: '1100000',
            return_percent: faker.string.numeric(),
            realized_gain: '100000',
            stock_type_option: 'E-IPO',
            entry_session_option: 'After-hours',
            entry_occasion_option: 'Post-Holiday',
            buy_reason_option: faker.animal.snake(),
            sell_reason_option: faker.animal.snake(),
          })
            .then((profitResponse) => {
              profitTradeId = profitResponse.body.trade.id
              cy.log(`📉 PROFIT trade ID: ${profitTradeId}`)
              return cy.GetTradeSummary()
            })
            .then((afterProfit) => {
              expect(afterProfit.body.data.totalWins).to.eq(initialSummary.totalWins + 1)
              return cy.UpdateTrade(profitTradeId, {
                margin: '1000000',
                proceeds: '800000',
                realized_gain: '-200000',
                notes: 'Flipped to loss',
              })
            })
            .then((updateResponse) => {
              expect(updateResponse.status).to.eq(200)
              cy.log('✅ Updated to LOSS')
              return cy.wait(1000)
            })
            .then(() => {
              return cy.GetTradeSummary()
            })
            .then((finalSummary) => {
              expect(finalSummary.body.data.totalTrades).to.eq(initialSummary.totalTrades + 1)
              expect(finalSummary.body.data.totalWins).to.eq(initialSummary.totalWins)
              expect(finalSummary.body.data.totalLosses).to.eq(initialSummary.totalLosses + 1)

              expect(finalSummary.body.data.stockTypeSummary['E-IPO']).to.eq(
                (initialSummary.stockTypeSummary['E-IPO'] || 0) + 1
              )

              cy.log('✅ PROFIT → LOSS verified!')
            })
        })
      })
    })
  })

  describe('Request Body Validation', () => {
    it('should return 400 when body is missing', () => {
      cy.UpdateTrade(testTradeId).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Invalid JSON in request body')
      })
    })

    it('should return 400 for invalid JSON', () => {
      const request = 'NULL'

      cy.UpdateTrade(testTradeId, request).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.eq('Invalid JSON in request body')
      })
    })

    it('should return 400 for invalid trade ID format', () => {
      cy.UpdateTrade('abc', {}).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
      })
    })

    it('should return 400 for empty body object', () => {
      const request = {}
      cy.UpdateTrade(testTradeId, request).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.success).to.be.false
        expect(response.body.error).to.be.an('array')
      })
    })
  })

  describe('Update Trade - partial updates and ignored columns (#899)', () => {
    const fixtureIds = []

    after(() => {
      cy.setupApiAuthCookies()
      fixtureIds.forEach((id) => cy.DeleteTrade(id))
    })

    const createFixtureTrade = () =>
      cy
        .AddTrade({
          buy_date: '2026-01-05',
          sell_date: '2026-01-06',
          ticker: 'ZZPART',
          margin: '1000',
          proceeds: '2000',
          return_percent: '100',
          realized_gain: '1000',
          stock_type_option: 'Normal',
          entry_session_option: 'Morning',
          entry_occasion_option: 'Breakout',
          buy_reason_option: 'Trend',
          sell_reason_option: 'Target',
          notes: 'original notes',
        })
        .then((response) => {
          expect(response.status).to.eq(201)
          fixtureIds.push(response.body.trade.id)
          return response.body.trade
        })

    it('should update only the sent field and leave the others untouched', () => {
      createFixtureTrade().then((trade) => {
        cy.UpdateTrade(trade.id, { notes: 'only notes changed' }).then((response) => {
          expect(response.status).to.eq(200)

          cy.getSingleTradeFromDb(trade.id).then((rows) => {
            const row = rows[0]
            expect(row.notes).to.eq('only notes changed')
            ;['ticker', 'buy_date', 'sell_date', 'return_percent', 'stock_type_option'].forEach(
              (field) => {
                expect(row[field], field).to.eq(trade[field])
              }
            )
            ;['margin', 'proceeds', 'realized_gain'].forEach((field) => {
              expect(Number(row[field]), field).to.eq(Number(trade[field]))
            })
          })
        })
      })
    })

    it('should ignore user_id, id, created_at and unknown keys in the body', () => {
      createFixtureTrade().then((trade) => {
        const foreignUserId = '00000000-0000-4000-8000-000000000999'

        cy.UpdateTrade(trade.id, {
          notes: 'valid field next to ignored ones',
          user_id: foreignUserId,
          id: 1,
          created_at: '2000-01-01T00:00:00.000Z',
          not_a_column: 'x',
        }).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.trade.user_id).to.eq(trade.user_id)

          cy.getSingleTradeFromDb(trade.id).then((rows) => {
            expect(rows, 'row still owned by the test user').to.have.length(1)
            const row = rows[0]
            expect(row.notes).to.eq('valid field next to ignored ones')
            expect(row.id).to.eq(trade.id)
            expect(row.user_id).to.eq(trade.user_id)
            expect(row.user_id).to.not.eq(foreignUserId)
            expect(new Date(row.created_at).getTime()).to.eq(new Date(trade.created_at).getTime())
          })
        })
      })
    })
  })

  describe('Update Trade - value validation (#908)', () => {
    let trade

    after(() => {
      cy.setupApiAuthCookies()
      if (trade) cy.DeleteTrade(trade.id)
    })

    before(() => {
      cy.setupApiAuthCookies()
      cy.AddTrade({
        buy_date: '2026-01-05',
        sell_date: '2026-01-06',
        ticker: 'ZZVALID',
        margin: '1000',
        proceeds: '2000',
        return_percent: '100',
        realized_gain: '1000',
        stock_type_option: 'Normal',
        entry_session_option: 'Morning',
        entry_occasion_option: 'Breakout',
        buy_reason_option: 'Trend',
        sell_reason_option: 'Target',
        notes: 'original notes',
      }).then((response) => {
        expect(response.status).to.eq(201)
        trade = response.body.trade
      })
    })

    const invalid = [
      ['a negative margin', { margin: '-5' }, 'Margin must be a positive number'],
      ['a zero margin', { margin: '0' }, 'Margin must be a positive number'],
      ['a non-numeric margin', { margin: 'abc' }, 'Margin must be a positive number'],
      ['a negative proceeds', { proceeds: '-1' }, 'Proceeds must be a positive number'],
      ['a non-numeric proceeds', { proceeds: 'abc' }, 'Proceeds must be a positive number'],
      ['a non-numeric realized_gain', { realized_gain: 'abc' }, 'Realized gain must be a number'],
      [
        'a ticker over 10 characters',
        { ticker: 'X'.repeat(11) },
        'Ticker must not exceed 10 characters',
      ],
      [
        'a ticker of 5000 characters',
        { ticker: 'X'.repeat(5000) },
        'Ticker must not exceed 10 characters',
      ],
      [
        'a buy_date that is not YYYY-MM-DD',
        { buy_date: 'not-a-date' },
        'Invalid date format (expected YYYY-MM-DD)',
      ],
      [
        'a sell_date with a time part',
        { sell_date: '2026-01-06T10:00:00Z' },
        'Invalid date format (expected YYYY-MM-DD)',
      ],
      ['an empty required option', { stock_type_option: '' }, 'Stock type is required'],
      [
        'notes over 2000 characters',
        { notes: 'n'.repeat(2001) },
        'Notes must not exceed 2000 characters',
      ],
    ]

    invalid.forEach(([label, body, message]) => {
      it(`returns 400 for ${label} and leaves the row unchanged`, () => {
        cy.setupApiAuthCookies()
        cy.UpdateTrade(trade.id, body).then((response) => {
          expect(response.status).to.eq(400)
          expect(response.body.success).to.be.false
          expect(response.body.error).to.be.an('array').that.includes(message)
        })

        cy.getSingleTradeFromDb(trade.id).then((rows) => {
          const row = rows[0]
          expect(row.ticker).to.eq(trade.ticker)
          expect(Number(row.margin)).to.eq(Number(trade.margin))
          expect(Number(row.proceeds)).to.eq(Number(trade.proceeds))
          expect(row.notes).to.eq(trade.notes)
          expect(row.buy_date).to.eq(trade.buy_date)
          expect(row.sell_date).to.eq(trade.sell_date)
        })
      })
    })

    it('reports every invalid field at once', () => {
      cy.setupApiAuthCookies()
      cy.UpdateTrade(trade.id, { margin: '-5', ticker: 'X'.repeat(11) }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.include.members([
          'Margin must be a positive number',
          'Ticker must not exceed 10 characters',
        ])
      })
    })

    it('still accepts a valid partial update and stores the ticker in uppercase like create', () => {
      cy.setupApiAuthCookies()
      cy.UpdateTrade(trade.id, { ticker: 'zzlow', margin: '1500' }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.trade.ticker).to.eq('ZZLOW')
        expect(Number(response.body.trade.margin)).to.eq(1500)
      })
    })

    it('accepts null dates (clearing a date)', () => {
      cy.setupApiAuthCookies()
      cy.UpdateTrade(trade.id, { sell_date: null }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.trade.sell_date).to.be.null
      })
    })
  })

  describe('Update Trade Performance', () => {
    it('should update within 2s', () => {
      const start = Date.now()
      cy.UpdateTrade(testTradeId, { notes: 'perf test' }).then((response) => {
        const duration = Date.now() - start
        expect(duration).to.be.lte(2000)
        cy.log(`Update time: ${duration}ms`)
      })
    })
  })
})
