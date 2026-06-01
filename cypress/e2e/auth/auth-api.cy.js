/**
 * API Auth Guard Tests — Auth & User & Chat Module
 * Memastikan semua endpoint menolak akses tanpa session (401)
 */

import { AUTH_ENDPOINTS, USER_ENDPOINTS, CHAT_ENDPOINTS } from '../../fixtures/endpoints.js'

describe('API Auth Guard — Auth Module', () => {
  it('logout → returns 401 Unauthorized when unauthenticated', () => {
    cy.apiRequestNoAuth('POST', AUTH_ENDPOINTS.LOGOUT).should((res) => {
      expect(res.status).to.equal(401)
      expect(res.body).to.have.property('error').that.equals('Unauthorized')
      expect(res.body).to.have.property('message')
    })
  })
})

describe('API Auth Guard — User Module', () => {
  it('get user profile → returns 401 Unauthorized when unauthenticated', () => {
    cy.apiRequestNoAuth('GET', USER_ENDPOINTS.USER).should((res) => {
      expect(res.status).to.equal(401)
      expect(res.body).to.have.property('error').that.equals('Unauthorized')
    })
  })

  it('update user profile → returns 401 Unauthorized when unauthenticated', () => {
    cy.apiRequestNoAuth('PUT', USER_ENDPOINTS.USER, {
      body: { username: 'test-user' },
    }).should((res) => {
      expect(res.status).to.equal(401)
      expect(res.body).to.have.property('error').that.equals('Unauthorized')
    })
  })

  it('upload avatar → returns 401 Unauthorized when unauthenticated', () => {
    cy.apiRequestNoAuth('POST', USER_ENDPOINTS.AVATAR).should((res) => {
      expect(res.status).to.equal(401)
      expect(res.body).to.have.property('error').that.equals('Unauthorized')
    })
  })
})

describe('API Auth Guard — Chat Module', () => {
  it('inventory chat → returns 401 Unauthorized when unauthenticated', () => {
    cy.apiRequestNoAuth('POST', CHAT_ENDPOINTS.CHAT, {
      body: { message: 'test message' },
    }).should((res) => {
      expect(res.status).to.equal(401)
      expect(res.body).to.have.property('error').that.equals('Unauthorized')
    })
  })

  it('trading chat → returns 401 Unauthorized when unauthenticated', () => {
    cy.apiRequestNoAuth('POST', CHAT_ENDPOINTS.TRADE_CHAT, {
      body: { message: 'test message' },
    }).should((res) => {
      expect(res.status).to.equal(401)
      expect(res.body).to.have.property('error').that.equals('Unauthorized')
    })
  })
})
