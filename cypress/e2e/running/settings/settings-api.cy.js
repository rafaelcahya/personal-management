// API spec: GET + PATCH /api/running/v1/user/settings
// Issue: #199 — race reminder push notifications (#171)
// Covers: auth guard, response shape, notify_race_reminder field, PATCH validation

import constants from '../../../fixtures/app-constants.json'

const SETTINGS_EP = constants.endpoints.running_user.settings

// ---------------------------------------------------------------------------
// A. Auth guard — unauthenticated → 401
// ---------------------------------------------------------------------------

describe('User Settings API — auth guard', () => {
  beforeEach(() => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
  })

  it('GET returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'GET',
      url: SETTINGS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('PATCH returns 401 when no session cookie is set', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { notify_race_reminder: true },
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

describe('User Settings API — GET response shape (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with data object and message OK', () => {
    cy.request({
      method: 'GET',
      url: SETTINGS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('message', 'OK')
    })
  })

  it('data contains all notification toggle fields', () => {
    cy.request({
      method: 'GET',
      url: SETTINGS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      expect(data).to.have.property('notify_post_activity')
      expect(data).to.have.property('notify_weekly_review')
      expect(data).to.have.property('notify_friday_prep')
      expect(data).to.have.property('notify_anomaly')
      expect(data).to.have.property('notify_race_reminder')
    })
  })

  it('notify_race_reminder is a boolean', () => {
    cy.request({
      method: 'GET',
      url: SETTINGS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.notify_race_reminder).to.be.a('boolean')
    })
  })

  it('data contains hr_zones_method field', () => {
    cy.request({
      method: 'GET',
      url: SETTINGS_EP,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.property('hr_zones_method')
      expect(['max_hr', 'karvonen', 'threshold']).to.include(res.body.data.hr_zones_method)
    })
  })
})

// ---------------------------------------------------------------------------
// C. PATCH — notify_race_reminder field
// ---------------------------------------------------------------------------

describe('User Settings API — PATCH notify_race_reminder (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 when setting notify_race_reminder to false', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { notify_race_reminder: false },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data.notify_race_reminder).to.eq(false)
    })
  })

  it('returns 200 when setting notify_race_reminder to true', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { notify_race_reminder: true },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body.data.notify_race_reminder).to.eq(true)
    })
  })

  it('returns 422 when notify_race_reminder is not a boolean', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { notify_race_reminder: 'yes' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 422 when hr_zones_method is invalid', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { hr_zones_method: 'invalid_method' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(422)
      expect(res.body).to.have.property('issues')
    })
  })

  it('returns 200 with updated message on valid PATCH', () => {
    cy.request({
      method: 'PATCH',
      url: SETTINGS_EP,
      body: { notify_race_reminder: true },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Settings updated')
    })
  })
})
