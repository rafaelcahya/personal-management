import { faker } from '@faker-js/faker'
import { ROUTES } from '../../../fixtures/routes.js'

describe('Login - Session Establishment', () => {
  before(() => {
    cy.clearAllCookies()
  })

  it('get session from Supabase API → returns valid session structure', () => {
    cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
      cy.task('getSupabaseSession', {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }).should((session) => {
        expect(session).to.not.be.null
        expect(session).to.have.property('access_token').that.is.a('string')
        expect(session).to.have.property('refresh_token').that.is.a('string')
        expect(session).to.have.property('user').that.is.an('object')
      })
    })
  })

  it('session with invalid credentials → returns null', () => {
    cy.task('getSupabaseSession', {
      email: faker.internet.email(),
      password: faker.word.words(2),
    }).should((session) => {
      expect(session).to.be.null
    })
  })

  it('after cy.login() → session has required properties', () => {
    cy.login()
    cy.getSession().should((session) => {
      expect(session).to.have.property('access_token').that.is.not.empty
      expect(session).to.have.property('refresh_token').that.is.not.empty
      expect(session).to.have.property('expires_in').that.is.a('number')
      expect(session).to.have.property('expires_at').that.is.a('number')
      expect(session).to.have.property('token_type').that.equals('bearer')
      expect(session).to.have.property('user').that.is.an('object')
      expect(session.user).to.have.property('id')
      expect(session.user).to.have.property('email')
      expect(session.user).to.have.property('user_metadata')
    })
  })

  it('after cy.login() → token is not expired', () => {
    cy.login()
    cy.getSession().should((session) => {
      const now = Math.floor(Date.now() / 1000)
      expect(session.expires_at).to.be.greaterThan(now)
    })
  })

  it('after cy.login() → email matches TEST_EMAIL environment', () => {
    cy.env(['TEST_EMAIL']).then(({ TEST_EMAIL }) => {
      cy.login()
      cy.getSession().should((session) => {
        expect(session.user.email).to.equal(TEST_EMAIL)
      })
    })
  })

  it('after cy.login() → session stored in localStorage', () => {
    cy.login()
    cy.window().should((win) => {
      const session = win.localStorage.getItem('cypress-session')
      expect(session).to.not.be.null
      expect(session).to.be.a('string')
      const parsed = JSON.parse(session)
      expect(parsed).to.have.property('access_token')
    })
  })

  it('cy.clearAuth() → removes session from localStorage', () => {
    cy.login()
    cy.visit(ROUTES.root)
    cy.window().should((win) => {
      expect(win.localStorage.getItem('cypress-session')).to.not.be.null
    })

    cy.clearAuth()

    cy.window().should((win) => {
      expect(win.localStorage.getItem('cypress-session')).to.be.null
      expect(win.localStorage.getItem('cypress-access-token')).to.be.null
    })
  })

  it('cy.loginWithBypass() → sets cypress-bypass cookie', () => {
    cy.loginWithBypass()
    cy.env(['CYPRESS_AUTH_SECRET']).then(({ CYPRESS_AUTH_SECRET }) => {
      cy.getCookie('cypress-bypass').should((cookie) => {
        expect(cookie).to.not.be.null
        expect(cookie.value).to.equal(CYPRESS_AUTH_SECRET)
      })
    })
  })

  it('cy.getAuthToken() → returns non-empty bearer token', () => {
    cy.login()
    cy.getAuthToken().should((token) => {
      expect(token).to.not.be.null
      expect(token).to.be.a('string')
      expect(token.length).to.be.greaterThan(100)
    })
  })
})
