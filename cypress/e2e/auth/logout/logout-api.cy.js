import { AUTH_ENDPOINTS } from '../../../fixtures/endpoints.js'

describe('Logout - API Endpoint', () => {
  before(() => {
    cy.setupApiAuthCookies()
  })

  it('POST logout endpoint (authenticated) → returns 200 with success message', () => {
    cy.apiRequestWithSession('POST', AUTH_ENDPOINTS.LOGOUT).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Logged out successfully')
    })
  })

  it('POST logout endpoint (unauthenticated) → returns 401 unauthorized', () => {
    cy.apiRequestNoAuth('POST', AUTH_ENDPOINTS.LOGOUT).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
    })
  })

  it('GET logout endpoint (invalid method) → returns non-200 status', () => {
    cy.apiRequestNoAuth('GET', AUTH_ENDPOINTS.LOGOUT).then((res) => {
      expect(res.status).to.not.eq(200)
    })
  })
})
