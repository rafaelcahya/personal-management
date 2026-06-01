import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const DASHBOARD_API = RUNNING_ENDPOINTS.DASHBOARD

describe('Running Dashboard API — GET /api/running/v1/dashboard', () => {
  // Use beforeEach because cookies are cleared between tests by Cypress session management
  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with valid session', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
    })
  })

  it('response data contains weekly_stats with current and prev blocks', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      const { data } = res.body
      expect(data).to.have.property('weekly_stats')
      expect(data.weekly_stats).to.have.property('current')
      expect(data.weekly_stats).to.have.property('prev')

      // current block must have the four stat fields
      const { current } = data.weekly_stats
      expect(current).to.have.property('distance_m')
      expect(current).to.have.property('duration_sec')
      expect(current).to.have.property('count')
      expect(current).to.have.property('avg_pace_sec_per_km')
    })
  })

  it('response data contains training_load with acwr, acute_load_7d, chronic_load_28d, status', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      const { training_load } = res.body.data
      expect(training_load).to.have.property('acwr')
      expect(training_load).to.have.property('acute_load_7d')
      expect(training_load).to.have.property('chronic_load_28d')
      expect(training_load).to.have.property('status')
      // status must be one of the documented values
      expect(training_load.status).to.be.oneOf(['no_data', 'low', 'optimal', 'caution', 'danger'])
    })
  })

  it('response data contains recent_activities as an array', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.property('recent_activities')
      expect(res.body.data.recent_activities).to.be.an('array')
    })
  })

  it('response data contains calendar_activities as an array', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.have.property('calendar_activities')
      expect(res.body.data.calendar_activities).to.be.an('array')
    })
  })

  it('response data contains health_today with logged boolean', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      expect(res.status).to.eq(200)
      const { health_today } = res.body.data
      expect(health_today).to.have.property('logged')
      expect(health_today.logged).to.be.a('boolean')
    })
  })

  it('weekly_stats current distance_m and duration_sec are integers', () => {
    cy.apiRequestWithSession('GET', DASHBOARD_API).then((res) => {
      const { current } = res.body.data.weekly_stats
      expect(Number.isInteger(current.distance_m)).to.eq(true)
      expect(Number.isInteger(current.duration_sec)).to.eq(true)
    })
  })
})

describe('Running Dashboard API — Unauthenticated access (no session)', () => {
  beforeEach(() => {
    // Ensure no auth cookies carry over from other describe blocks
    cy.clearCookies()
    cy.clearLocalStorage()
  })

  it('returns 401 with no session cookie', () => {
    cy.request({
      method: 'GET',
      url: DASHBOARD_API,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
    })
  })
})
