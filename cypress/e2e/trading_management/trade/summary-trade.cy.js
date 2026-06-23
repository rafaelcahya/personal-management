import { faker } from '@faker-js/faker'

describe('Trade Summary API - GET /api/trade/v1/trade/summary', () => {
  describe('Trade Summary API vs Database Comparison', () => {
    let tradeId
    let userId

    beforeEach(() => {
      cy.clearCookies()
      cy.clearLocalStorage()
      cy.setupApiAuthCookies()

      const request = {
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
      }

      cy.AddTrade(request).then((response) => {
        expect(response.status).to.eq(201)
        tradeId = response.body.trade.id
        userId = response.body.trade.user_id
        cy.log(`Created test trade ID: ${tradeId}`)
      })
    })

    // ─── auth guard ───────────────────────────────────────────────────────

    it('returns 200 with valid session', () => {
      cy.GetTradeSummary().then((response) => {
        expect(response.status).to.eq(200)
      })
    })

    it('returns 401 when unauthenticated', () => {
      cy.clearCookies()
      cy.GetTradeSummaryNoAuth().then((response) => {
        expect(response.status).to.be.oneOf([401, 307])
        if (response.status === 401) {
          expect(response.body.error).to.eq('Unauthorized')
        }
      })
    })

    // ─── response shape ───────────────────────────────────────────────────

    it('returns correct response structure', () => {
      cy.GetTradeSummary().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body).to.have.property('message')
        expect(response.body.message).to.eq('OK')

        const { data } = response.body
        expect(data).to.have.property('totalTrades').that.is.a('number')
        expect(data).to.have.property('totalWins').that.is.a('number')
        expect(data).to.have.property('totalLosses').that.is.a('number')
        expect(data).to.have.property('stockTypeSummary').that.is.an('object')
        expect(data).to.have.property('entrySessionSummary').that.is.an('object')
        expect(data).to.have.property('entryOccasionSummary').that.is.an('object')
      })
    })

    // ─── total counts comparison ──────────────────────────────────────────

    describe('Total Counts Comparison', () => {
      it('API totalTrades should match database count', () => {
        let apiTotal, dbTotal

        cy.GetTradeSummary().then((response) => {
          expect(response.body.message).to.eq('OK')
          apiTotal = response.body.data.totalTrades
          cy.log(`API totalTrades: ${apiTotal}`)
        })

        cy.getTotalTradesFromDb(userId).then((count) => {
          dbTotal = count
          cy.log(`DB totalTrades: ${dbTotal}`)
          expect(apiTotal).to.eq(dbTotal)
        })
      })

      it('API totalWins should match database count', () => {
        let apiWins, dbWins

        cy.GetTradeSummary().then((response) => {
          apiWins = response.body.data.totalWins
          cy.log(`API totalWins: ${apiWins}`)
        })

        cy.getTotalWinsFromDb(userId).then((count) => {
          dbWins = count
          cy.log(`DB totalWins: ${dbWins}`)
          expect(apiWins).to.eq(dbWins)
        })
      })

      it('API totalLosses should match database count', () => {
        let apiLosses, dbLosses

        cy.GetTradeSummary().then((response) => {
          apiLosses = response.body.data.totalLosses
          cy.log(`API totalLosses: ${apiLosses}`)
        })

        cy.getTotalLossesFromDb(userId).then((count) => {
          dbLosses = count
          cy.log(`DB totalLosses: ${dbLosses}`)
          expect(apiLosses).to.eq(dbLosses)
        })
      })
    })

    // ─── stock type summary comparison ────────────────────────────────────

    describe('Stock Type Summary Comparison', () => {
      it('API stockTypeSummary should match database aggregation', () => {
        let apiSummary, dbSummary

        cy.GetTradeSummary().then((response) => {
          apiSummary = response.body.data.stockTypeSummary
          cy.log('API stockTypeSummary:', JSON.stringify(apiSummary))
        })

        cy.getStockTypeSummaryFromDb(userId).then((summary) => {
          dbSummary = summary
          cy.log('DB stockTypeSummary:', JSON.stringify(dbSummary))
          expect(apiSummary).to.deep.equal(dbSummary)
        })
      })

      it('each stock type count should match database individually', () => {
        cy.GetTradeSummary().then((response) => {
          const apiSummary = response.body.data.stockTypeSummary

          cy.getStockTypeSummaryFromDb(userId).then((dbSummary) => {
            const stockTypes = Object.keys(apiSummary)
            stockTypes.forEach((stockType) => {
              const apiCount = apiSummary[stockType]
              const dbCount = dbSummary[stockType]
              expect(dbCount, `Stock type: ${stockType}`).to.exist
              expect(apiCount).to.eq(dbCount)
              cy.log(`${stockType}: API=${apiCount}, DB=${dbCount}`)
            })
          })
        })
      })
    })

    // ─── entry session summary comparison ─────────────────────────────────

    describe('Entry Session Summary Comparison', () => {
      it('API entrySessionSummary should match database aggregation', () => {
        let apiSummary, dbSummary

        cy.GetTradeSummary().then((response) => {
          apiSummary = response.body.data.entrySessionSummary
          cy.log('API entrySessionSummary:', JSON.stringify(apiSummary))
        })

        cy.getEntrySessionSummaryFromDb(userId).then((summary) => {
          dbSummary = summary
          cy.log('DB entrySessionSummary:', JSON.stringify(dbSummary))
          expect(apiSummary).to.deep.equal(dbSummary)
        })
      })

      it('each entry session count should match database individually', () => {
        cy.GetTradeSummary().then((response) => {
          const apiSummary = response.body.data.entrySessionSummary

          cy.getEntrySessionSummaryFromDb(userId).then((dbSummary) => {
            const sessions = Object.keys(apiSummary)
            sessions.forEach((session) => {
              const apiCount = apiSummary[session]
              const dbCount = dbSummary[session]
              expect(dbCount, `Entry session: ${session}`).to.exist
              expect(apiCount).to.eq(dbCount)
              cy.log(`${session}: API=${apiCount}, DB=${dbCount}`)
            })
          })
        })
      })
    })

    // ─── entry occasion summary comparison ────────────────────────────────

    describe('Entry Occasion Summary Comparison', () => {
      it('API entryOccasionSummary should match database aggregation', () => {
        let apiSummary, dbSummary

        cy.GetTradeSummary().then((response) => {
          apiSummary = response.body.data.entryOccasionSummary
          cy.log('API entryOccasionSummary:', JSON.stringify(apiSummary))
        })

        cy.getEntryOccasionSummaryFromDb(userId).then((summary) => {
          dbSummary = summary
          cy.log('DB entryOccasionSummary:', JSON.stringify(dbSummary))
          expect(apiSummary).to.deep.equal(dbSummary)
        })
      })

      it('each entry occasion count should match database individually', () => {
        cy.GetTradeSummary().then((response) => {
          const apiSummary = response.body.data.entryOccasionSummary

          cy.getEntryOccasionSummaryFromDb(userId).then((dbSummary) => {
            const occasions = Object.keys(apiSummary)
            occasions.forEach((occasion) => {
              const apiCount = apiSummary[occasion]
              const dbCount = dbSummary[occasion]
              expect(dbCount, `Entry occasion: ${occasion}`).to.exist
              expect(apiCount).to.eq(dbCount)
              cy.log(`${occasion}: API=${apiCount}, DB=${dbCount}`)
            })
          })
        })
      })
    })

    // ─── complete data integrity check ────────────────────────────────────

    describe('Complete Data Integrity Check', () => {
      it('all API data should perfectly match database source', () => {
        let apiData

        cy.GetTradeSummary().then((response) => {
          expect(response.body.message).to.eq('OK')
          apiData = response.body.data
          cy.log('API Full Response:', JSON.stringify(apiData))
        })

        cy.getTotalTradesFromDb(userId).then((totalTrades) => {
          expect(apiData.totalTrades, 'Total Trades').to.eq(totalTrades)
        })

        cy.getTotalWinsFromDb(userId).then((totalWins) => {
          expect(apiData.totalWins, 'Total Wins').to.eq(totalWins)
        })

        cy.getTotalLossesFromDb(userId).then((totalLosses) => {
          expect(apiData.totalLosses, 'Total Losses').to.eq(totalLosses)
        })

        cy.getStockTypeSummaryFromDb(userId).then((stockTypeSummary) => {
          expect(apiData.stockTypeSummary, 'Stock Type Summary').to.deep.equal(stockTypeSummary)
        })

        cy.getEntrySessionSummaryFromDb(userId).then((entrySessionSummary) => {
          expect(apiData.entrySessionSummary, 'Entry Session Summary').to.deep.equal(
            entrySessionSummary
          )
        })

        cy.getEntryOccasionSummaryFromDb(userId).then((entryOccasionSummary) => {
          expect(apiData.entryOccasionSummary, 'Entry Occasion Summary').to.deep.equal(
            entryOccasionSummary
          )
        })
      })
    })
  })
})
