import { RUNNING_ENDPOINTS } from '../../../fixtures/endpoints.js'

const ACTIVITIES_ENDPOINT = RUNNING_ENDPOINTS.ACTIVITIES

describe('Activities API — GET /api/running/v1/activities (authenticated)', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  beforeEach(() => {
    cy.setupApiAuthCookies()
  })

  it('returns 200 with a valid session', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_ENDPOINT,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
    })
  })

  it('response body has paginated shape: data, total, page, limit', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_ENDPOINT,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      expect(res.body).to.have.property('total')
      expect(res.body).to.have.property('page')
      expect(res.body).to.have.property('limit')
    })
  })

  it('data is an array', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_ENDPOINT,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data).to.be.an('array')
    })
  })

  it('total, page, and limit are numbers', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_ENDPOINT,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.total).to.be.a('number')
      expect(res.body.page).to.be.a('number')
      expect(res.body.limit).to.be.a('number')
    })
  })

  it('each activity item in data has required fields (id, activity_type, started_at)', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_ENDPOINT,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      // Only validate shape when there is at least one result
      if (res.body.data.length > 0) {
        const first = res.body.data[0]
        expect(first).to.have.property('id')
        expect(first).to.have.property('activity_type')
        expect(first).to.have.property('started_at')
        expect(first).to.have.property('distance_m')
      }
    })
  })

  it('accepts ?type=Run filter without erroring', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_ENDPOINT,
      qs: { type: 'Run' },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('data')
      // When type filter is active, every returned item must match
      res.body.data.forEach((item) => {
        expect(item.activity_type).to.eq('Run')
      })
    })
  })

  it('accepts ?page=1&limit=5 and returns at most 5 items', () => {
    cy.request({
      method: 'GET',
      url: ACTIVITIES_ENDPOINT,
      qs: { page: 1, limit: 5 },
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body.data.length).to.be.at.most(5)
      expect(res.body.page).to.eq(1)
      expect(res.body.limit).to.eq(5)
    })
  })
})

describe('Activities API — GET /api/running/v1/activities (unauthenticated)', () => {
  it('returns 401 when no session cookie is present', () => {
    cy.clearAllCookies()
    cy.request({
      method: 'GET',
      url: ACTIVITIES_ENDPOINT,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})
