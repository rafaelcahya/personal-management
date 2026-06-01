import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const syncEndpoints = {
  sync_strava: RUNNING_ENDPOINTS.SYNC_STRAVA,
  sync_status: RUNNING_ENDPOINTS.SYNC_STATUS,
  strava_callback: RUNNING_ENDPOINTS.STRAVA_CALLBACK,
}

describe('Sync API — POST /api/running/v1/sync/strava (authenticated)', () => {
  // setupApiAuthCookies in beforeEach because the sb-{ref}-auth-token cookie is cleared
  // between tests by Cypress.session.clearAllSavedSessions() in e2e.ts support file
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with success=true and message when authenticated', () => {
    cy.apiRequestWithSession('POST', syncEndpoints.sync_strava, {
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('success', true)
      // Route returns 'Sync started' (lowercase s)
      expect(res.body).to.have.property('message', 'Sync started')
    })
  })

  it('response body has success as boolean and message as string', () => {
    cy.apiRequestWithSession('POST', syncEndpoints.sync_strava, {
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.success).to.be.a('boolean')
      expect(res.body.message).to.be.a('string')
    })
  })
})

describe('Sync API — GET /api/running/v1/sync/status (authenticated)', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with connected=false and last_sync_at=null when Strava not connected', () => {
    cy.apiRequestWithSession('GET', syncEndpoints.sync_status, {
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('connected', false)
      expect(res.body).to.have.property('last_sync_at', null)
    })
  })

  it('response body has connected as boolean and last_sync_at as string or null', () => {
    cy.apiRequestWithSession('GET', syncEndpoints.sync_status, {
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.connected).to.be.a('boolean')
      // last_sync_at is null when not connected, ISO string when connected
      const lastSync = res.body.last_sync_at
      expect(lastSync === null || typeof lastSync === 'string').to.be.true
    })
  })
})

describe('Sync API — GET /api/running/v1/auth/strava/callback (OAuth redirect)', () => {
  // Middleware bypasses this route (public OAuth callback) — auth only needed for token exchange
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('redirects to settings error URL when code param is missing', () => {
    cy.request({
      method: 'GET',
      url: syncEndpoints.strava_callback,
      followRedirect: false,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([302, 307])
      expect(res.headers.location).to.include('settings')
      expect(res.headers.location).to.include('error=strava_auth')
    })
  })

  it('redirects to settings error URL when code is invalid', () => {
    cy.request({
      method: 'GET',
      url: `${syncEndpoints.strava_callback}?code=invalid_code_12345`,
      followRedirect: false,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.be.oneOf([302, 307])
      expect(res.headers.location).to.include('settings')
      expect(res.headers.location).to.include('error=strava_auth')
    })
  })
})

describe('Sync API — Unauthenticated access (no session)', () => {
  beforeEach(() => {
    // Ensure no auth cookies carry over from other describe blocks
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('POST /sync/strava returns 401 with error field when no session cookie', () => {
    cy.request({
      method: 'POST',
      url: syncEndpoints.sync_strava,
      headers: { 'Content-Type': 'application/json' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })

  it('GET /sync/status returns 401 with error field when no session cookie', () => {
    cy.request({
      method: 'GET',
      url: syncEndpoints.sync_status,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error')
    })
  })
})
