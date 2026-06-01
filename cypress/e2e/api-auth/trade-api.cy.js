/**
 * API Auth Guard Tests — Trade Module
 * Memastikan semua endpoint menolak akses tanpa session (401)
 *
 * NOTE: /api/trade/v1/options/* adalah public endpoints (lookup data)
 * — tidak perlu auth, ditest terpisah untuk memastikan tetap accessible.
 */

import { TRADE_ENDPOINTS } from '../../fixtures/api-endpoints.js'

const FAKE_ID = '00000000-0000-0000-0000-000000000000'

// ─── DASHBOARD ───────────────────────────────────────────────────────────────

describe('API Auth Guard — Trade: Dashboard', () => {
  it(`GET ${TRADE_ENDPOINTS.DASHBOARD_METRICS} (unauthenticated) → returns 401 unauthorized`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.DASHBOARD_METRICS).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET ${TRADE_ENDPOINTS.DASHBOARD_QUICK_VIEW} (unauthenticated) → returns 401 unauthorized`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.DASHBOARD_QUICK_VIEW).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── TRADE ───────────────────────────────────────────────────────────────────

describe('API Auth Guard — Trade: Trade', () => {
  it(`GET ${TRADE_ENDPOINTS.TRADE_LIST} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.TRADE_LIST).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`POST ${TRADE_ENDPOINTS.TRADE_CREATE} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('POST', TRADE_ENDPOINTS.TRADE_CREATE, {
      body: { stock: 'BBCA' },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET /api/trade/v1/trade/[id] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.TRADE_DETAIL(FAKE_ID)).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`PUT /api/trade/v1/trade/update/[id] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('PUT', TRADE_ENDPOINTS.TRADE_UPDATE(FAKE_ID), {
      body: { stock: 'BBCA' },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`DELETE /api/trade/v1/trade/delete/[id] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('DELETE', TRADE_ENDPOINTS.TRADE_DELETE(FAKE_ID)).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET ${TRADE_ENDPOINTS.TRADE_SUMMARY} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.TRADE_SUMMARY).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET /api/trade/v1/trade/options/[type] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.TRADE_OPTIONS('buy-reason')).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── EVENT ───────────────────────────────────────────────────────────────────

describe('API Auth Guard — Trade: Event', () => {
  it(`GET ${TRADE_ENDPOINTS.EVENT_LIST} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.EVENT_LIST).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`POST ${TRADE_ENDPOINTS.EVENT_CREATE} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('POST', TRADE_ENDPOINTS.EVENT_CREATE, {
      body: { name: 'test' },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET /api/trade/v1/event/[id] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.EVENT_DETAIL(FAKE_ID)).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`PUT /api/trade/v1/event/update/[id] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('PUT', TRADE_ENDPOINTS.EVENT_UPDATE(FAKE_ID), {
      body: { name: 'test' },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`DELETE /api/trade/v1/event/delete/[id] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('DELETE', TRADE_ENDPOINTS.EVENT_DELETE(FAKE_ID)).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`PATCH /api/trade/v1/event/favorite/[id] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('PATCH', TRADE_ENDPOINTS.EVENT_FAVORITE(FAKE_ID)).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET ${TRADE_ENDPOINTS.EVENT_SUMMARY} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.EVENT_SUMMARY).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── FEE ─────────────────────────────────────────────────────────────────────

describe('API Auth Guard — Trade: Fee', () => {
  it(`GET ${TRADE_ENDPOINTS.FEE_LIST} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.FEE_LIST).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`POST ${TRADE_ENDPOINTS.FEE_CREATE} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('POST', TRADE_ENDPOINTS.FEE_CREATE, {
      body: { name: 'test' },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET /api/trade/v1/fee/[id] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.FEE_DETAIL(FAKE_ID)).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`PUT /api/trade/v1/fee/update/[id] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('PUT', TRADE_ENDPOINTS.FEE_UPDATE(FAKE_ID), {
      body: { name: 'test' },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`DELETE /api/trade/v1/fee/delete/[id] (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('DELETE', TRADE_ENDPOINTS.FEE_DELETE(FAKE_ID)).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET ${TRADE_ENDPOINTS.FEE_SUMMARY} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.FEE_SUMMARY).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── SETTINGS ────────────────────────────────────────────────────────────────

describe('API Auth Guard — Trade: Settings', () => {
  it(`GET ${TRADE_ENDPOINTS.SETTINGS} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.SETTINGS).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`PUT ${TRADE_ENDPOINTS.SETTINGS_UPDATE} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('PUT', TRADE_ENDPOINTS.SETTINGS_UPDATE, {
      body: { initial_margin: 1000 },
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ─── OPTIONS (AUTH REQUIRED) ──────────────────────────────────────────────────

describe('API Auth Guard — Trade: Options', () => {
  /**
   * Options routes menggunakan createClient (SSR) yang membutuhkan session.
   * Tabel hanya ter-expose ke authenticated role di Supabase RLS.
   * Semua options routes wajib auth karena hanya dipakai di form yang sudah login.
   */

  it(`GET ${TRADE_ENDPOINTS.OPTIONS_BUY_REASON} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.OPTIONS_BUY_REASON).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET ${TRADE_ENDPOINTS.OPTIONS_SELL_REASON} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.OPTIONS_SELL_REASON).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET ${TRADE_ENDPOINTS.OPTIONS_ENTRY_SESSION} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.OPTIONS_ENTRY_SESSION).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET ${TRADE_ENDPOINTS.OPTIONS_ENTRY_OCCASION} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.OPTIONS_ENTRY_OCCASION).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it(`GET ${TRADE_ENDPOINTS.OPTIONS_STOCK_TYPE} (unauthenticated) → returns 401`, () => {
    cy.apiRequestNoAuth('GET', TRADE_ENDPOINTS.OPTIONS_STOCK_TYPE).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})
