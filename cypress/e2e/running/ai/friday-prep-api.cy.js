// API spec: GET /api/running/v1/ai/insights?type=friday_prep
// Issue: #247 — friday-prep card week_start UTC matching
// Covers: auth guard, type filter, response shape, data_refs.week_start field

import constants from '../../../fixtures/app-constants.json'

const INSIGHTS_EP = constants.endpoints.running_analytics_ai.insights

// ---------------------------------------------------------------------------
// A. Auth guard — unauthenticated → 401
// ---------------------------------------------------------------------------

describe('Friday Prep API — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

// ---------------------------------------------------------------------------
// B. Authenticated — type=friday_prep filter
// ---------------------------------------------------------------------------

describe('Friday Prep API — type filter (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data array for ?type=friday_prep', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('every returned insight has insight_type=friday_prep when data exists', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No friday_prep insights in test account — type filter check skipped')
        return
      }
      res.body.data.forEach((insight) => {
        expect(insight.insight_type).to.eq('friday_prep')
      })
    })
  })
})

// ---------------------------------------------------------------------------
// C. Response shape — required fields + data_refs.week_start
// ---------------------------------------------------------------------------

describe('Friday Prep API — response shape (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('each insight has required top-level fields', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No friday_prep insights — field shape check skipped')
        return
      }
      const insight = res.body.data[0]
      expect(insight).to.have.property('id')
      expect(insight).to.have.property('insight_type')
      expect(insight).to.have.property('status')
      expect(insight).to.have.property('content')
      expect(insight).to.have.property('data_refs')
      expect(insight).to.have.property('created_at')
    })
  })

  it('data_refs contains week_start field when insight exists', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length === 0) {
        cy.log('No friday_prep insights — data_refs.week_start check skipped')
        return
      }
      const insight = res.body.data[0]
      expect(insight.data_refs).to.be.an('object')
      expect(insight.data_refs).to.have.property('week_start')
      expect(insight.data_refs.week_start).to.match(/^\d{4}-\d{2}-\d{2}$/)
    })
  })

  it('insights are ordered by created_at descending', () => {
    cy.request({
      method: 'GET',
      url: `${INSIGHTS_EP}?type=friday_prep`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      if (res.body.data.length < 2) return
      const dates = res.body.data.map((i) => new Date(i.created_at).getTime())
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i]).to.be.lte(dates[i - 1])
      }
    })
  })
})
