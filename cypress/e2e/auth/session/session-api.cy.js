import { USER_ENDPOINTS, AUTH_ENDPOINTS, INVENTORY_ENDPOINTS, TRADE_ENDPOINTS } from '../../../fixtures/endpoints.js'

describe('Session - API Security - Unauthenticated Requests', () => {
  it('should return 401 for GET /api/user when unauthenticated', () => {
    cy.request({ method: 'GET', url: USER_ENDPOINTS.USER, failOnStatusCode: false }).then(
      (res) => {
        expect(res.status).to.eq(401)
        expect(res.body).to.have.property('error', 'Unauthorized')
      }
    )
  })

  it('should return 401 for POST /api/auth/logout when unauthenticated', () => {
    cy.apiRequestNoAuth('POST', AUTH_ENDPOINTS.LOGOUT).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
    })
  })

  it('should return 401 for inventory API when unauthenticated', () => {
    cy.request({
      method: 'GET',
      url: INVENTORY_ENDPOINTS.GET_PRODUCTS,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('should return 401 for trading API when unauthenticated', () => {
    cy.request({
      method: 'GET',
      url: TRADE_ENDPOINTS.GET_TRADES,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})
