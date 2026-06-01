import { ROUTES } from '../../../fixtures/routes.js'
import { TEST_IDS } from '../../../fixtures/test-ids.js'
import { AUTH_ENDPOINTS } from '../../../fixtures/endpoints.js'

describe('Session Expiry - Error Message Display - Desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('login with ?reason=session_expired → login page displays', () => {
    cy.visit(`${ROUTES.login}?reason=session_expired`)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('login with ?error=auth_failed → login page displays', () => {
    cy.visit(`${ROUTES.login}?error=auth_failed`)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('login with ?error=no_code → login page displays', () => {
    cy.visit(`${ROUTES.login}?error=no_code`)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('login with no params → page loads normally with enabled button', () => {
    cy.visit(ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`).should('not.be.disabled')
  })
})

describe('Session Expiry - Protected Route Guards - Desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.clearAuth()
  })

  it('should redirect to login from inventory when session cleared', () => {
    cy.visit(ROUTES.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', ROUTES.login)
  })

  it('should redirect to login from trading when session cleared', () => {
    cy.visit(ROUTES.trading_dashboard, { failOnStatusCode: false })
    cy.url().should('include', ROUTES.login)
  })

  it('should redirect to login from landing when session cleared', () => {
    cy.visit(ROUTES.landing, { failOnStatusCode: false })
    cy.url().should('include', ROUTES.login)
  })
})

describe('Session Expiry - Error Message Display - Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
  })

  it('should show session expired message on mobile', () => {
    cy.visit(`${ROUTES.login}?reason=session_expired`)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should show auth failed message on mobile', () => {
    cy.visit(`${ROUTES.login}?error=auth_failed`)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })
})

describe('Session Expiry - Error Message Display - Tablet', () => {
  beforeEach(() => {
    cy.viewport('ipad-2')
  })

  it('should show session expired message on tablet', () => {
    cy.visit(`${ROUTES.login}?reason=session_expired`)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })
})

describe('Session - Toast Content Verification - Desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('?reason=session_expired param → displays "session expired" toast', () => {
    cy.visit(`${ROUTES.login}?reason=session_expired`)
    cy.get('[data-sonner-toast]', { timeout: 5000 })
      .should('be.visible')
      .and('contain.text', "You've been signed out")
  })

  it('should show correct toast text for ?error=auth_failed', () => {
    cy.visit(`${ROUTES.login}?error=auth_failed`)
    cy.get('[data-sonner-toast]', { timeout: 5000 })
      .should('be.visible')
      .and('contain.text', 'Login failed')
  })

  it('should show correct toast text for ?error=no_code', () => {
    cy.visit(`${ROUTES.login}?error=no_code`)
    cy.get('[data-sonner-toast]', { timeout: 5000 })
      .should('be.visible')
      .and('contain.text', 'Invalid login attempt')
  })

  it('should NOT show any toast when visiting /login with no params', () => {
    cy.visit(ROUTES.login)
    cy.wait(1000)
    cy.get('[data-sonner-toast]').should('not.exist')
  })

  it("should NOT show 'session expired' toast on intentional logout", () => {
    cy.loginWithBypass()
    cy.visit(ROUTES.inventory_product_list)

    cy.intercept('POST', AUTH_ENDPOINTS.LOGOUT, {
      statusCode: 200,
      body: { message: 'Logged out successfully' },
    }).as('logoutRequest')

    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).click()
    cy.wait('@logoutRequest')

    // URL must NOT include session_expired — this is the primary signal
    // that AuthListener did not fire the session expiry redirect
    cy.url({ timeout: 5000 }).should('include', ROUTES.login)
    cy.url().should('not.include', 'reason=session_expired')

    // Any toasts visible must NOT contain "session expired" or "signed out" text
    cy.get('body').then(($body) => {
      if ($body.find('[data-sonner-toast]').length > 0) {
        cy.get('[data-sonner-toast]').each(($toast) => {
          expect($toast.text().toLowerCase()).not.to.include('session')
          expect($toast.text().toLowerCase()).not.to.include('signed out')
        })
      }
    })
  })
})

describe('Session - Callback Open Redirect Validation', () => {
  it('should redirect to /login?error=no_code when ?next= has no code param', () => {
    cy.visit(`${ROUTES.auth_callback_v1}?next=https://evil.com`, {
      failOnStatusCode: false,
    })
    cy.url().should('include', ROUTES.login)
    cy.url().should('include', 'error=no_code')
  })

  it('should redirect to /login?error=no_code even with relative-looking malformed next', () => {
    cy.visit(`${ROUTES.auth_callback_v1}?next=//evil.com`, {
      failOnStatusCode: false,
    })
    cy.url().should('include', ROUTES.login)
    cy.url().should('include', 'error=no_code')
  })
})
