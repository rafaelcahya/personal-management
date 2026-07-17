// Covers research page API endpoints:
//   GET /api/trade/v1/research/overview
//   GET /api/trade/v1/research/technicals
//   GET /api/trade/v1/research/corporate-events
//   GET /api/trade/v1/research/symbol-search

describe('Research Page API', () => {
  const KNOWN_TICKER = 'AAPL'

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  // ─── research overview ────────────────────────────────────────────────────

  describe('GET /api/trade/v1/research/overview', () => {
    it('returns 200 with the expected shape for a valid ticker', () => {
      cy.getResearchOverview({ ticker: KNOWN_TICKER }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true

        const data = response.body.data
        expect(data).to.include.all.keys(['ticker', 'recommendation', 'priceTarget'])
        expect(data.ticker).to.eq(KNOWN_TICKER)

        if (data.recommendation) {
          expect(data.recommendation).to.include.all.keys([
            'period',
            'strongBuy',
            'buy',
            'hold',
            'sell',
            'strongSell',
            'total',
          ])
          expect(data.recommendation.total).to.be.a('number')
        }

        if (data.priceTarget) {
          expect(data.priceTarget).to.include.all.keys([
            'low',
            'mean',
            'high',
            'median',
            'lastUpdated',
          ])
        }
      })
    })

    it('returns 400 when ticker query param is missing', () => {
      cy.getResearchOverview().then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.exist
      })
    })

    it('returns 401 when unauthenticated', () => {
      cy.clearApiAuth()
      cy.getResearchOverviewNoAuth({ ticker: KNOWN_TICKER }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.error).to.exist
      })
    })
  })

  // ─── research technicals ──────────────────────────────────────────────────

  describe('GET /api/trade/v1/research/technicals', () => {
    it('returns 200 with the expected shape for a valid ticker', () => {
      cy.getResearchTechnicals({ ticker: KNOWN_TICKER }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true

        const data = response.body.data
        expect(data).to.include.all.keys(['ticker', 'rsi', 'macd', 'patterns'])
        expect(data.ticker).to.eq(KNOWN_TICKER)

        if (data.rsi) {
          expect(data.rsi).to.include.all.keys(['value', 'interpretation'])
          expect(data.rsi.value).to.be.a('number')
          expect(['overbought', 'oversold', 'neutral']).to.include(data.rsi.interpretation)
        }

        if (data.macd) {
          expect(data.macd).to.include.all.keys(['macd', 'signal', 'histogram', 'trend'])
          expect(['bullish', 'bearish', 'neutral']).to.include(data.macd.trend)
        }

        if (data.patterns) {
          expect(data.patterns).to.be.an('array')
        }
      })
    })

    it('returns 400 when ticker query param is missing', () => {
      cy.getResearchTechnicals().then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.exist
      })
    })

    it('returns 401 when unauthenticated', () => {
      cy.clearApiAuth()
      cy.getResearchTechnicalsNoAuth({ ticker: KNOWN_TICKER }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.error).to.exist
      })
    })
  })

  // ─── research corporate events ────────────────────────────────────────────

  describe('GET /api/trade/v1/research/corporate-events', () => {
    it('returns 200 with the expected shape for a valid ticker', () => {
      cy.getResearchCorporateEvents({ ticker: KNOWN_TICKER }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true

        const data = response.body.data
        expect(data).to.include.all.keys([
          'ticker',
          'earnings',
          'insiderTransactions',
          'upcomingDividend',
        ])
        expect(data.ticker).to.eq(KNOWN_TICKER)

        if (data.earnings) {
          expect(data.earnings).to.be.an('array')
          if (data.earnings.length > 0) {
            expect(data.earnings[0]).to.include.all.keys([
              'period',
              'quarter',
              'year',
              'epsEstimate',
              'epsActual',
              'surprise',
              'surprisePercent',
            ])
          }
        }

        if (data.insiderTransactions) {
          expect(data.insiderTransactions).to.be.an('array')
          if (data.insiderTransactions.length > 0) {
            expect(data.insiderTransactions[0]).to.include.all.keys([
              'name',
              'transactionCode',
              'change',
              'share',
              'transactionPrice',
              'filingDate',
            ])
          }
        }

        if (data.upcomingDividend) {
          expect(data.upcomingDividend).to.include.all.keys([
            'amount',
            'currency',
            'date',
            'payDate',
            'frequency',
          ])
        }
      })
    })

    it('returns 400 when ticker query param is missing', () => {
      cy.getResearchCorporateEvents().then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body.error).to.exist
      })
    })

    it('returns 401 when unauthenticated', () => {
      cy.clearApiAuth()
      cy.getResearchCorporateEventsNoAuth({ ticker: KNOWN_TICKER }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.error).to.exist
      })
    })
  })

  // ─── research symbol search ───────────────────────────────────────────────

  describe('GET /api/trade/v1/research/symbol-search', () => {
    it('returns 200 with an array of matches for a valid query', () => {
      cy.getResearchSymbolSearch({ q: 'Apple' }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data).to.be.an('array')

        if (response.body.data.length > 0) {
          expect(response.body.data[0]).to.include.all.keys([
            'value',
            'label',
            'symbol',
            'description',
            'type',
          ])
        }
      })
    })

    it('returns 200 with an empty array when q query param is missing', () => {
      cy.getResearchSymbolSearch().then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.success).to.be.true
        expect(response.body.data).to.deep.eq([])
      })
    })

    it('returns 401 when unauthenticated', () => {
      cy.clearApiAuth()
      cy.getResearchSymbolSearchNoAuth({ q: 'Apple' }).then((response) => {
        expect(response.status).to.eq(401)
        expect(response.body.error).to.exist
      })
    })
  })
})
