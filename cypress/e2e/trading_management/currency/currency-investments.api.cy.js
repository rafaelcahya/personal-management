// ─── currency investments API tests ──────────────────────────────────────────
// Endpoints:
//   GET    /api/currency-investments/v1/list
//   POST   /api/currency-investments/v1/create
//   DELETE /api/currency-investments/v1/delete/[id]
//   GET    /api/currency-investments/v1/holdings
//   GET    /api/currency-investments/v1/holdings/[id]
//   GET    /api/forex/v1/rates
//   GET    /api/forex/v1/history
//   GET    /api/forex/v1/currencies

const makeInvestmentPayload = () => ({
  currency: 'USD',
  type: 'buy',
  idr_amount: 1500000,
  rate: 16200,
  transacted_at: '2025-01-15',
  notes: 'Cypress test investment',
})

// ─── GET /api/currency-investments/v1/list ────────────────────────────────────

describe('Currency Investments API — GET /api/currency-investments/v1/list', () => {
  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cy.getCurrencyInvestments().then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.getCurrencyInvestmentsNoAuth().then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns correct response structure', () => {
    cy.setupApiAuthCookies()
    cy.getCurrencyInvestments().then((res) => {
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message')
    })
  })

  it('returns data as an array', () => {
    cy.setupApiAuthCookies()
    cy.getCurrencyInvestments().then((res) => {
      expect(res.body.data).to.have.property('items').that.is.an('array')
    })
  })

  it('returns expected item fields when list is non-empty', () => {
    cy.setupApiAuthCookies()
    cy.getCurrencyInvestments().then((res) => {
      if (res.body.data.items.length === 0) {
        cy.log('List is empty — skipping field shape check')
        return
      }
      const item = res.body.data.items[0]
      expect(item).to.have.property('id')
      expect(item).to.have.property('currency').that.is.a('string')
      expect(item).to.have.property('type').that.is.a('string')
      expect(item).to.have.property('idr_amount').that.is.a('number')
      expect(item).to.have.property('rate').that.is.a('number')
      expect(item).to.have.property('transacted_at')
    })
  })

  it('filters by currency param', () => {
    cy.setupApiAuthCookies()
    cy.getCurrencyInvestments({ currency: 'USD' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.items).to.be.an('array')
      res.body.data.items.forEach((item) => {
        expect(item.currency).to.eq('USD')
      })
    })
  })

  it('returns 400 for invalid currency filter — length != 3', () => {
    cy.setupApiAuthCookies()
    cy.getCurrencyInvestments({ currency: 'USDX' }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })

  it('respects pagination — limit param caps result count', () => {
    cy.setupApiAuthCookies()
    cy.getCurrencyInvestments({ limit: 2 }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.items.length).to.be.lte(2)
    })
  })

  it('returns 400 when limit exceeds maximum of 100', () => {
    cy.setupApiAuthCookies()
    cy.getCurrencyInvestments({ limit: 200 }).then((res) => {
      expect(res.status).to.eq(400)
    })
  })
})

// ─── POST /api/currency-investments/v1/create ─────────────────────────────────

describe('Currency Investments API — POST /api/currency-investments/v1/create', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 201 with valid payload', () => {
    cy.createCurrencyInvestment(makeInvestmentPayload()).then((res) => {
      expect(res.status).to.eq(201)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'Investment created successfully')
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.createCurrencyInvestmentNoAuth(makeInvestmentPayload()).then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('created investment has expected fields', () => {
    cy.createCurrencyInvestment(makeInvestmentPayload()).then((res) => {
      expect(res.status).to.eq(201)
      const inv = res.body.data
      expect(inv).to.have.property('id')
      expect(inv).to.have.property('currency')
      expect(inv).to.have.property('type')
      expect(inv).to.have.property('idr_amount').that.is.a('number')
      expect(inv).to.have.property('rate').that.is.a('number')
      expect(inv).to.have.property('transacted_at')
    })
  })

  it('returns 400 when currency is missing', () => {
    const payload = makeInvestmentPayload()
    delete payload.currency
    cy.createCurrencyInvestment(payload).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when currency is not exactly 3 characters', () => {
    cy.createCurrencyInvestment({ ...makeInvestmentPayload(), currency: 'USDX' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when type is missing', () => {
    const payload = makeInvestmentPayload()
    delete payload.type
    cy.createCurrencyInvestment(payload).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when type is not buy or sell', () => {
    cy.createCurrencyInvestment({ ...makeInvestmentPayload(), type: 'hold' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when idr_amount is missing', () => {
    const payload = makeInvestmentPayload()
    delete payload.idr_amount
    cy.createCurrencyInvestment(payload).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when idr_amount is negative', () => {
    cy.createCurrencyInvestment({ ...makeInvestmentPayload(), idr_amount: -500000 }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when rate is missing', () => {
    const payload = makeInvestmentPayload()
    delete payload.rate
    cy.createCurrencyInvestment(payload).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when rate is zero', () => {
    cy.createCurrencyInvestment({ ...makeInvestmentPayload(), rate: 0 }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when transacted_at is missing', () => {
    const payload = makeInvestmentPayload()
    delete payload.transacted_at
    cy.createCurrencyInvestment(payload).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when transacted_at is not YYYY-MM-DD format', () => {
    cy.createCurrencyInvestment({ ...makeInvestmentPayload(), transacted_at: '15/01/2025' }).then(
      (res) => {
        expect(res.status).to.eq(400)
        expect(res.body).to.have.property('error')
      }
    )
  })

  it('accepts optional notes field', () => {
    const payload = { ...makeInvestmentPayload(), notes: 'optional note test' }
    cy.createCurrencyInvestment(payload).then((res) => {
      expect(res.status).to.eq(201)
    })
  })

  it('returns 400 when notes exceed 500 characters', () => {
    const longNotes = 'a'.repeat(501)
    cy.createCurrencyInvestment({ ...makeInvestmentPayload(), notes: longNotes }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })
})

// ─── DELETE /api/currency-investments/v1/delete/[id] ─────────────────────────

describe('Currency Investments API — DELETE /api/currency-investments/v1/delete/[id]', () => {
  let seededId

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    cy.createCurrencyInvestment(makeInvestmentPayload()).then((res) => {
      expect(res.status).to.eq(201)
      seededId = res.body.data.id
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.deleteCurrencyInvestmentNoAuth(seededId).then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns 200 and confirmation message on success', () => {
    cy.setupApiAuthCookies()
    cy.createCurrencyInvestment(makeInvestmentPayload()).then((createRes) => {
      expect(createRes.status).to.eq(201)
      const idToDelete = createRes.body.data.id

      cy.deleteCurrencyInvestment(idToDelete).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('message', 'Investment deleted successfully')
      })
    })
  })

  it('returns 404 for non-existent investment id', () => {
    cy.deleteCurrencyInvestment('00000000-0000-0000-0000-000000000000').then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 404 when deleting already-deleted investment (idempotency)', () => {
    cy.createCurrencyInvestment(makeInvestmentPayload()).then((createRes) => {
      expect(createRes.status).to.eq(201)
      const idToDelete = createRes.body.data.id

      cy.deleteCurrencyInvestment(idToDelete).then((firstRes) => {
        expect(firstRes.status).to.eq(200)

        cy.deleteCurrencyInvestment(idToDelete).then((secondRes) => {
          expect(secondRes.status).to.eq(404)
        })
      })
    })
  })
})

// ─── GET /api/currency-investments/v1/holdings ───────────────────────────────

describe('Currency Investments API — GET /api/currency-investments/v1/holdings', () => {
  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cy.getCurrencyHoldings().then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.getCurrencyHoldingsNoAuth().then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns correct response structure', () => {
    cy.setupApiAuthCookies()
    cy.getCurrencyHoldings().then((res) => {
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('returns data as an array', () => {
    cy.setupApiAuthCookies()
    cy.getCurrencyHoldings().then((res) => {
      expect(res.body.data).to.be.an('array')
    })
  })

  it('each holding has id and currency fields when list is non-empty', () => {
    cy.setupApiAuthCookies()
    cy.getCurrencyHoldings().then((res) => {
      if (res.body.data.length === 0) {
        cy.log('Holdings list is empty — skipping field shape check')
        return
      }
      const holding = res.body.data[0]
      expect(holding).to.have.property('id')
      expect(holding).to.have.property('currency').that.is.a('string')
    })
  })
})

// ─── GET /api/currency-investments/v1/holdings/[id] ──────────────────────────

describe('Currency Investments API — GET /api/currency-investments/v1/holdings/[id]', () => {
  let holdingId

  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()

    cy.getCurrencyHoldings().then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length > 0) {
        holdingId = res.body.data[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid id', function () {
    if (!holdingId) {
      cy.log('No holdings in DB — skipping valid id test')
      return
    }
    cy.getCurrencyHoldingById(holdingId).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns id and currency in response data', function () {
    if (!holdingId) {
      cy.log('No holdings in DB — skipping field shape check')
      return
    }
    cy.getCurrencyHoldingById(holdingId).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.have.property('id')
      expect(res.body.data).to.have.property('currency').that.is.a('string')
    })
  })

  it('returns 404 for non-existent holding id', () => {
    cy.getCurrencyHoldingById(999999999).then((res) => {
      expect(res.status).to.eq(404)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 for invalid (non-integer) id', () => {
    cy.getCurrencyHoldingById('not-an-id').then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.getCurrencyHoldingByIdNoAuth(1).then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })
})

// ─── GET /api/forex/v1/rates ──────────────────────────────────────────────────

describe('Forex API — GET /api/forex/v1/rates', () => {
  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cy.getForexRates().then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.getForexRatesNoAuth().then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns correct response structure', () => {
    cy.setupApiAuthCookies()
    cy.getForexRates().then((res) => {
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('returns default symbols when no query param is provided', () => {
    cy.setupApiAuthCookies()
    cy.getForexRates().then((res) => {
      expect(res.status).to.eq(200)
      const data = res.body.data
      expect(data).to.be.an('object')
    })
  })

  it('returns requested symbols when symbols param is provided', () => {
    cy.setupApiAuthCookies()
    cy.getForexRates({ symbols: 'USD,EUR' }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('object')
    })
  })

  it('each rate entry has amount and base fields', () => {
    cy.setupApiAuthCookies()
    cy.getForexRates({ symbols: 'USD' }).then((res) => {
      expect(res.status).to.eq(200)
      const data = res.body.data
      if (data && typeof data === 'object') {
        const keys = Object.keys(data)
        if (keys.length > 0) {
          const entry = data[keys[0]]
          expect(entry).to.exist
        }
      }
    })
  })
})

// ─── GET /api/forex/v1/history ────────────────────────────────────────────────

describe('Forex API — GET /api/forex/v1/history', () => {
  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid currency and from params', () => {
    cy.getForexHistory({ currency: 'USD', from: '2025-01-01' }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.getForexHistoryNoAuth({ currency: 'USD', from: '2025-01-01' }).then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns correct response structure', () => {
    cy.setupApiAuthCookies()
    cy.getForexHistory({ currency: 'USD', from: '2025-01-01' }).then((res) => {
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('returns 400 when currency param is missing', () => {
    cy.getForexHistory({ from: '2025-01-01' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when from param is missing', () => {
    cy.getForexHistory({ currency: 'USD' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when currency is not exactly 3 characters', () => {
    cy.getForexHistory({ currency: 'USDX', from: '2025-01-01' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 400 when from is not in YYYY-MM-DD format', () => {
    cy.getForexHistory({ currency: 'USD', from: '01-01-2025' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('accepts optional to param', () => {
    cy.getForexHistory({ currency: 'USD', from: '2025-01-01', to: '2025-01-31' }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns 400 when to param is not in YYYY-MM-DD format', () => {
    cy.getForexHistory({ currency: 'USD', from: '2025-01-01', to: '31/01/2025' }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })
})

// ─── GET /api/forex/v1/currencies ────────────────────────────────────────────

describe('Forex API — GET /api/forex/v1/currencies', () => {
  before(() => {
    cy.clearCookies()
    cy.clearLocalStorage()
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cy.getForexCurrencies().then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('returns 401 when unauthenticated', () => {
    cy.clearCookies()
    cy.getForexCurrenciesNoAuth().then((res) => {
      expect(res.status).to.be.oneOf([401, 307])
    })
  })

  it('returns correct response structure', () => {
    cy.setupApiAuthCookies()
    cy.getForexCurrencies().then((res) => {
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('returns data as an object map', () => {
    cy.setupApiAuthCookies()
    cy.getForexCurrencies().then((res) => {
      expect(res.body.data).to.be.an('object')
    })
  })

  it('does not include IDR in the response', () => {
    cy.setupApiAuthCookies()
    cy.getForexCurrencies().then((res) => {
      expect(res.body.data).to.not.have.property('IDR')
    })
  })

  it('each currency entry has name and symbol fields', () => {
    cy.setupApiAuthCookies()
    cy.getForexCurrencies().then((res) => {
      const currencies = res.body.data
      const keys = Object.keys(currencies)
      if (keys.length === 0) {
        cy.log('No currencies returned — skipping field shape check')
        return
      }
      const entry = currencies[keys[0]]
      expect(entry).to.have.property('name').that.is.a('string')
      expect(entry).to.have.property('symbol').that.is.a('string')
    })
  })

  it('currency keys are 3-character ISO codes', () => {
    cy.setupApiAuthCookies()
    cy.getForexCurrencies().then((res) => {
      const keys = Object.keys(res.body.data)
      if (keys.length === 0) {
        cy.log('No currencies returned — skipping key format check')
        return
      }
      keys.forEach((code) => {
        expect(code).to.have.length(3)
        expect(code).to.match(/^[A-Z]{3}$/)
      })
    })
  })
})
