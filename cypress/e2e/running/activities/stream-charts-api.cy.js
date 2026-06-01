import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const STREAMS_BASE = '/api/running/v1/activities'

describe('Streams API — Authenticated', () => {
  let activityId

  before(() => {
    cy.setupApiAuthCookies()
    // Get the first available activity ID for this user
    cy.apiRequestWithSession('GET', RUNNING_ENDPOINTS.ACTIVITIES).then((res) => {
      expect(res.status).to.eq(200)
      const activities = res.body?.data ?? res.body
      if (Array.isArray(activities) && activities.length > 0) {
        activityId = activities[0].id
      }
    })
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with meta and data array for authenticated request', function () {
    if (!activityId) this.skip()
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${activityId}/streams`).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('meta')
      expect(res.body).to.have.property('data')
      expect(res.body.data).to.be.an('array')
    })
  })

  it('response meta contains required fields', function () {
    if (!activityId) this.skip()
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${activityId}/streams`).then((res) => {
      expect(res.status).to.eq(200)
      const { meta } = res.body
      expect(meta).to.have.property('has_hr')
      expect(meta).to.have.property('has_altitude')
      expect(meta).to.have.property('has_cadence')
      expect(meta).to.have.property('total_points')
      expect(meta).to.have.property('returned_points')
      expect(meta).to.have.property('resolution')
      expect(meta.resolution).to.eq('10s')
    })
  })

  it('returns 200 for resolution=raw', function () {
    if (!activityId) this.skip()
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${activityId}/streams?resolution=raw`).then(
      (res) => {
        expect(res.status).to.eq(200)
        expect(res.body.meta.resolution).to.eq('raw')
      }
    )
  })

  it('returns 200 for resolution=60s', function () {
    if (!activityId) this.skip()
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${activityId}/streams?resolution=60s`).then(
      (res) => {
        expect(res.status).to.eq(200)
        expect(res.body.meta.resolution).to.eq('60s')
      }
    )
  })
})

describe('Streams API — Unauthenticated', () => {
  it('returns 401 when no session is present', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'GET',
      url: `${STREAMS_BASE}/any-activity-id/streams`,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

describe('Streams API — Ownership check', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 404 when activity ID does not belong to authenticated user', () => {
    const nonExistentId = '00000000-0000-0000-0000-000000000000'
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${nonExistentId}/streams`).then((res) => {
      expect(res.status).to.eq(404)
    })
  })
})

describe('Streams API — Input validation', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 400 for invalid resolution parameter', () => {
    cy.apiRequestWithSession('GET', `${STREAMS_BASE}/any-id/streams?resolution=invalid`).then(
      (res) => {
        expect(res.status).to.eq(400)
      }
    )
  })
})
