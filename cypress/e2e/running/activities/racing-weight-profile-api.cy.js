// API spec: GET + PATCH /api/running/v1/user/profile
// Issue: #270 — RacingWeightSection on activity detail page
// Covers: auth guard, response shape, weight_kg + height_cm fields, PATCH validation

import constants from '../../../fixtures/app-constants.json'

const PROFILE_EP = constants.endpoints.running_user_profile.get

// ---------------------------------------------------------------------------
// A. Auth guard — unauthenticated → 401
// ---------------------------------------------------------------------------

describe('User Profile API — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('GET returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'GET',
      url: PROFILE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('PATCH returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: { weight_kg: 70 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})

// ---------------------------------------------------------------------------
// B. GET — response shape
// ---------------------------------------------------------------------------

describe('User Profile API — GET response shape (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data object and message OK', () => {
    cy.request({
      method: 'GET',
      url: PROFILE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('data contains required profile fields', () => {
    cy.request({
      method: 'GET',
      url: PROFILE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      expect(data).to.have.property('id')
      expect(data).to.have.property('email')
      expect(data).to.have.property('height_cm')
      expect(data).to.have.property('weight_kg')
      expect(data).to.have.property('max_hr')
    })
  })

  it('weight_kg and height_cm are numbers when set', () => {
    cy.request({
      method: 'GET',
      url: PROFILE_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      if (data.weight_kg !== null) expect(data.weight_kg).to.be.a('number')
      if (data.height_cm !== null) expect(data.height_cm).to.be.a('number')
    })
  })
})

// ---------------------------------------------------------------------------
// C. PATCH — validation
// ---------------------------------------------------------------------------

describe('User Profile API — PATCH validation (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 400 when body is empty object', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: {},
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(400)
      expect(res.body).to.have.property('error')
    })
  })

  it('returns 422 when weight_kg is negative', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: { weight_kg: -5 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when height_cm is zero', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: { height_cm: 0 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when max_hr exceeds 250', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: { max_hr: 300 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when sex is invalid value', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      body: { sex: 'unknown' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 400 when body is invalid JSON', () => {
    cy.request({
      method: 'PATCH',
      url: PROFILE_EP,
      headers: { 'Content-Type': 'application/json' },
      body: 'not-json',
      failOnStatusCode: false,
    }).then((res) => {
      expect([400, 422]).to.include(res.status)
    })
  })

  it('returns 200 with updated data on valid PATCH', () => {
    cy.request({
      method: 'GET',
      url: PROFILE_EP,
      failOnStatusCode: false,
    }).then((getRes) => {
      const original = getRes.body.data.display_name

      cy.request({
        method: 'PATCH',
        url: PROFILE_EP,
        body: { display_name: original ?? 'Test User' },
        failOnStatusCode: false,
      }).then((res) => {
        expect(res.status).to.eq(200)
        expect(res.body).to.have.property('data')
        expect(res.body.data).to.have.property('display_name')
      })
    })
  })
})
