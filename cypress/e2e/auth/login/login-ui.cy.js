import { ROUTES } from '../../../fixtures/routes.js'
import { TEST_IDS } from '../../../fixtures/test-ids.js'
import { USER_ENDPOINTS } from '../../../fixtures/endpoints.js'

describe('Login Page - Desktop Interactions', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit(ROUTES.login)
  })

  it('page load → login page visible with main container', () => {
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('page load → Google sign-in button visible and enabled', () => {
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`).should('be.visible').and('not.be.disabled')
  })

  it('page load → Google button contains SVG icon', () => {
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`).find('svg').should('exist').and('be.visible')
  })
})

describe('Login - Auth Callback - Desktop Interactions', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('callback with invalid code → redirects to /login?error=auth_failed', () => {
    cy.visit(`${ROUTES.auth_callback_v1}?code=mock-oauth-code-12345`, {
      failOnStatusCode: false,
    })

    cy.url({ timeout: 10000 }).should('include', ROUTES.login).and('include', 'error=auth_failed')
  })

  it('callback with no code param → redirects to /login?error=no_code', () => {
    cy.visit(ROUTES.auth_callback_v1, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login).and('include', 'error=no_code')
  })

  it('callback with malformed code → redirects to /login?error=auth_failed', () => {
    cy.visit(`${ROUTES.auth_callback_v1}?code=invalid-code`, {
      failOnStatusCode: false,
    })

    cy.url().should('include', ROUTES.login).and('include', 'error=auth_failed')
  })
})

describe('Login - Session Persistence - Desktop Interactions', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('session → persists across page reload', () => {
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)
    cy.url().should('include', ROUTES.inventory)

    cy.reload()

    cy.url().should('include', ROUTES.inventory)
    cy.get('body').should('be.visible')
  })

  it('unauthenticated access to landing → redirects to login', () => {
    cy.clearAuth()
    cy.visit(ROUTES.landing, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('unauthenticated access to product list → redirects to login', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product brand page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_brand, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product name page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_name, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product history page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_history, {
      failOnStatusCode: false,
    })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trading dashboard page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_dashboard, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trade page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_trade, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access event page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_event, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access fee page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_fee, {
      failOnStatusCode: false,
    })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })
})

describe('Login Page - Mobile Interactions', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.visit(ROUTES.login)
  })

  it('page load → login page container visible on mobile', () => {
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('page load → Google button visible and accessible on mobile', () => {
    cy.contains('Sign in with Google').should('be.visible')
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`).should('be.visible').and('not.be.disabled')
  })

  it('page load → Google SVG icon present on mobile', () => {
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`).find('svg').should('exist').and('be.visible')
  })
})

describe('Login - Auth Callback - Mobile Interactions', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
  })

  it('should redirect to login when callback code cannot be exchanged', () => {
    cy.visit(`${ROUTES.auth_callback_v1}?code=mock-oauth-code-12345`, {
      failOnStatusCode: false,
    })

    cy.url({ timeout: 10000 }).should('include', ROUTES.login)
    cy.url().should('include', 'error=auth_failed')
  })

  it('should redirect to login with error=no_code when callback receives no code', () => {
    cy.visit(ROUTES.auth_callback_v1, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.url().should('include', 'error=no_code')
  })

  it('should redirect to login with error param on invalid code', () => {
    cy.visit(`${ROUTES.auth_callback_v1}?code=invalid-code`, {
      failOnStatusCode: false,
    })

    cy.url().should('include', ROUTES.login)
    cy.url().should('include', 'error=auth_failed')
  })
})

describe('Login - Session Persistence - Mobile Interactions', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
  })

  it('should persist session across page reloads', () => {
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)

    cy.url().should('include', ROUTES.inventory)

    cy.reload()

    cy.url().should('include', ROUTES.inventory)
    cy.get('body').should('be.visible')
  })

  it('should redirect to login when session expired after access landing page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.landing, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('unauthenticated access to product list → redirects to login', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product brand page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_brand, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product name page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_name, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product history page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_history, {
      failOnStatusCode: false,
    })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trading dashboard page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_dashboard, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trade page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_trade, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access event page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_event, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access fee page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_fee, {
      failOnStatusCode: false,
    })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })
})

describe('Login Page - Tablet Interactions', () => {
  beforeEach(() => {
    cy.viewport('ipad-2')
    cy.visit(ROUTES.login)
  })

  it('should display login page with correct elements', () => {
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should display Google login button', () => {
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`).should('be.visible')
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`).should('not.be.disabled')
  })

  it('should show Google icon in login button', () => {
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`).find('svg').should('be.visible')
  })
})

describe('Login - Auth Callback - Tablet Interactions', () => {
  beforeEach(() => {
    cy.viewport('ipad-2')
  })

  it('should redirect to login when callback code cannot be exchanged', () => {
    cy.visit(`${ROUTES.auth_callback_v1}?code=mock-oauth-code-12345`, {
      failOnStatusCode: false,
    })

    cy.url({ timeout: 10000 }).should('include', ROUTES.login)
    cy.url().should('include', 'error=auth_failed')
  })

  it('should redirect to login with error=no_code when callback receives no code', () => {
    cy.visit(ROUTES.auth_callback_v1, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.url().should('include', 'error=no_code')
  })

  it('should redirect to login with error param on invalid code', () => {
    cy.visit(`${ROUTES.auth_callback_v1}?code=invalid-code`, {
      failOnStatusCode: false,
    })

    cy.url().should('include', ROUTES.login)
    cy.url().should('include', 'error=auth_failed')
  })
})

describe('Login - Session Persistence - Tablet Interactions', () => {
  beforeEach(() => {
    cy.viewport('ipad-2')
  })

  it('should persist session across page reloads', () => {
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)

    cy.url().should('include', ROUTES.inventory)

    cy.reload()

    cy.url().should('include', ROUTES.inventory)
    cy.get('body').should('be.visible')
  })

  it('should redirect to login when session expired after access landing page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.landing, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('unauthenticated access to product list → redirects to login', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product brand page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_brand, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product name page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_name, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product history page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.inventory_product_history, {
      failOnStatusCode: false,
    })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trading dashboard page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_dashboard, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trade page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_trade, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access event page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_event, { failOnStatusCode: false })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access fee page', () => {
    cy.clearAuth()
    cy.visit(ROUTES.trading_fee, {
      failOnStatusCode: false,
    })

    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })
})

describe('Login Page - App Identity & Google Branding - Desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.visit(ROUTES.login)
  })

  it('page displays → "Personal Management" app identity text visible', () => {
    cy.contains('Personal Management').should('be.visible')
  })

  it('Google button → label displays "Sign in with Google"', () => {
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`)
      .should('be.visible')
      .and('contain.text', 'Sign in with Google')
  })

  it('Google button → has proper accessibility aria-label', () => {
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`).should(
      'have.attr',
      'aria-label',
      'Sign in with Google'
    )
  })

  it('Google button → contains multicolor SVG icon (Google branding)', () => {
    cy.get(`#${TEST_IDS.auth.google_signin_btn} svg path`).should('have.length.gte', 4)
  })
})

describe('Login Page - App Identity & Google Branding - Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.visit(ROUTES.login)
  })

  it('page displays → "Personal Management" app identity visible on mobile', () => {
    cy.contains('Personal Management').should('be.visible')
  })

  it('Google button → label displays correctly on mobile', () => {
    cy.get(`#${TEST_IDS.auth.google_signin_btn}`).should('contain.text', 'Sign in with Google')
  })
})

describe('Login - Middleware ?next= Param Preservation - Desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.clearAllCookies()
  })

  it('inventory page redirect → preserves ?next= param on login', () => {
    cy.visit(ROUTES.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', ROUTES.login).and('include', 'next=').and('include', 'inventory')
  })

  it('trading page redirect → preserves ?next= param on login', () => {
    cy.visit(ROUTES.trading_dashboard, { failOnStatusCode: false })
    cy.url().should('include', ROUTES.login).and('include', 'next=').and('include', 'trading')
  })

  it('landing page redirect → preserves ?next= param on login', () => {
    cy.visit(ROUTES.landing, { failOnStatusCode: false })
    cy.url().should('include', ROUTES.login).and('include', 'next=')
  })

  it('unauthenticated API call → returns 401 JSON (no redirect)', () => {
    cy.request({
      method: 'GET',
      url: USER_ENDPOINTS.USER,
      failOnStatusCode: false,
    }).should((res) => {
      expect(res.status).to.equal(401)
      expect(res.body).to.have.property('error').that.equals('Unauthorized')
    })
  })
})
