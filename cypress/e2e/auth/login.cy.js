import { faker } from '@faker-js/faker'

describe('Login - Session Establishment', () => {
  let C
  before(() => {
    cy.clearAllCookies()
    cy.fixture('app-constants').then((data) => {
      C = data
    })
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
    cy.visit(C.routes.root)
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

// Updated by Cypress Author — 2026-05-13
describe('Login Page - Desktop Interactions', () => {
  let C
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.fixture('app-constants').then((data) => {
      C = data
      cy.visit(C.routes.login)
    })
  })

  it('page load → login page visible with main container', () => {
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('page load → Google sign-in button visible and enabled', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).should('be.visible').and('not.be.disabled')
  })

  it('page load → Google button contains SVG icon', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).find('svg').should('exist').and('be.visible')
  })
})

// Updated by Cypress Author — 2026-05-13
describe('Login - Auth Callback - Desktop Interactions', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('callback with invalid code → redirects to /login?error=auth_failed', () => {
    cy.visit(`${C.routes.auth_callback_v1}?code=mock-oauth-code-12345`, {
      failOnStatusCode: false,
    })

    cy.url({ timeout: 10000 }).should('include', C.routes.login).and('include', 'error=auth_failed')
  })

  it('callback with no code param → redirects to /login?error=no_code', () => {
    cy.visit(C.routes.auth_callback_v1, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login).and('include', 'error=no_code')
  })

  it('callback with malformed code → redirects to /login?error=auth_failed', () => {
    cy.visit(`${C.routes.auth_callback_v1}?code=invalid-code`, {
      failOnStatusCode: false,
    })

    cy.url().should('include', C.routes.login).and('include', 'error=auth_failed')
  })
})

// Updated by Cypress Author — 2026-05-13
describe('Login - Session Persistence - Desktop Interactions', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('session → persists across page reload', () => {
    cy.loginWithBypass()
    cy.visit(C.routes.landing)
    cy.url().should('include', C.routes.inventory)

    cy.reload()

    cy.url().should('include', C.routes.inventory)
    cy.get('body').should('be.visible')
  })

  it('unauthenticated access to landing → redirects to login', () => {
    cy.clearAuth()
    cy.visit(C.routes.landing, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('unauthenticated access to product list → redirects to login', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product brand page', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_brand, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product name page', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_name, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product history page', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_history, {
      failOnStatusCode: false,
    })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trading dashboard page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_dashboard, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trade page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_trade, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access event page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_event, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access fee page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_fee, {
      failOnStatusCode: false,
    })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })
})

// Updated by Cypress Author — 2026-05-13
describe('Login Page - Mobile Interactions', () => {
  let C
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.fixture('app-constants').then((data) => {
      C = data
      cy.visit(C.routes.login)
    })
  })

  it('page load → login page container visible on mobile', () => {
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('page load → Google button visible and accessible on mobile', () => {
    cy.contains('Sign in with Google').should('be.visible')
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).should('be.visible').and('not.be.disabled')
  })

  it('page load → Google SVG icon present on mobile', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).find('svg').should('exist').and('be.visible')
  })
})

describe('Login - Auth Callback - Mobile Interactions', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('iphone-x')
  })

  it('should redirect to login when callback code cannot be exchanged', () => {
    cy.visit(`${C.routes.auth_callback_v1}?code=mock-oauth-code-12345`, {
      failOnStatusCode: false,
    })

    cy.url({ timeout: 10000 }).should('include', C.routes.login)
    cy.url().should('include', 'error=auth_failed')
  })

  it('should redirect to login with error=no_code when callback receives no code', () => {
    cy.visit(C.routes.auth_callback_v1, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.url().should('include', 'error=no_code')
  })

  it('should redirect to login with error param on invalid code', () => {
    cy.visit(`${C.routes.auth_callback_v1}?code=invalid-code`, {
      failOnStatusCode: false,
    })

    cy.url().should('include', C.routes.login)
    cy.url().should('include', 'error=auth_failed')
  })
})

describe('Login - Session Persistence - Mobile Interactions', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('iphone-x')
  })

  it('should persist session across page reloads', () => {
    cy.loginWithBypass()
    cy.visit(C.routes.landing)

    cy.url().should('include', C.routes.inventory)

    cy.reload()

    cy.url().should('include', C.routes.inventory)
    cy.get('body').should('be.visible')
  })

  it('should redirect to login when session expired after access landing page', () => {
    cy.clearAuth()
    cy.visit(C.routes.landing, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('unauthenticated access to product list → redirects to login', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product brand page', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_brand, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product name page', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_name, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product history page', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_history, {
      failOnStatusCode: false,
    })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trading dashboard page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_dashboard, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trade page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_trade, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access event page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_event, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access fee page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_fee, {
      failOnStatusCode: false,
    })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })
})

describe('Login Page - Tablet Interactions', () => {
  let C
  beforeEach(() => {
    cy.viewport('ipad-2')
    cy.fixture('app-constants').then((data) => {
      C = data
      cy.visit(C.routes.login)
    })
  })

  it('should display login page with correct elements', () => {
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should display Google login button', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).should('be.visible')
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).should('not.be.disabled')
  })

  it('should show Google icon in login button', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).find('svg').should('be.visible')
  })
})

describe('Login - Auth Callback - Tablet Interactions', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('ipad-2')
  })

  it('should redirect to login when callback code cannot be exchanged', () => {
    cy.visit(`${C.routes.auth_callback_v1}?code=mock-oauth-code-12345`, {
      failOnStatusCode: false,
    })

    cy.url({ timeout: 10000 }).should('include', C.routes.login)
    cy.url().should('include', 'error=auth_failed')
  })

  it('should redirect to login with error=no_code when callback receives no code', () => {
    cy.visit(C.routes.auth_callback_v1, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.url().should('include', 'error=no_code')
  })

  it('should redirect to login with error param on invalid code', () => {
    cy.visit(`${C.routes.auth_callback_v1}?code=invalid-code`, {
      failOnStatusCode: false,
    })

    cy.url().should('include', C.routes.login)
    cy.url().should('include', 'error=auth_failed')
  })
})

describe('Login - Session Persistence - Tablet Interactions', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('ipad-2')
  })

  it('should persist session across page reloads', () => {
    cy.loginWithBypass()
    cy.visit(C.routes.landing)

    cy.url().should('include', C.routes.inventory)

    cy.reload()

    cy.url().should('include', C.routes.inventory)
    cy.get('body').should('be.visible')
  })

  it('should redirect to login when session expired after access landing page', () => {
    cy.clearAuth()
    cy.visit(C.routes.landing, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('unauthenticated access to product list → redirects to login', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product brand page', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_brand, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product name page', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_name, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product history page', () => {
    cy.clearAuth()
    cy.visit(C.routes.inventory_product_history, {
      failOnStatusCode: false,
    })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trading dashboard page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_dashboard, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access trade page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_trade, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access event page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_event, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access fee page', () => {
    cy.clearAuth()
    cy.visit(C.routes.trading_fee, {
      failOnStatusCode: false,
    })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })
})

// ------------------------------------------------------------
// LOGIN PAGE — APP IDENTITY & BRANDING
// ------------------------------------------------------------
describe('Login Page - App Identity & Google Branding - Desktop', () => {
  let C
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.fixture('app-constants').then((data) => {
      C = data
      cy.visit(C.routes.login)
    })
  })

  it('page displays → "Personal Management" app identity text visible', () => {
    cy.contains('Personal Management').should('be.visible')
  })

  it('Google button → label displays "Sign in with Google"', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`)
      .should('be.visible')
      .and('contain.text', 'Sign in with Google')
  })

  it('Google button → has proper accessibility aria-label', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).should(
      'have.attr',
      'aria-label',
      'Sign in with Google'
    )
  })

  it('Google button → contains multicolor SVG icon (Google branding)', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn} svg path`).should('have.length.gte', 4)
  })
})

// Updated by Cypress Author — 2026-05-13
describe('Login Page - App Identity & Google Branding - Mobile', () => {
  let C
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.fixture('app-constants').then((data) => {
      C = data
      cy.visit(C.routes.login)
    })
  })

  it('page displays → "Personal Management" app identity visible on mobile', () => {
    cy.contains('Personal Management').should('be.visible')
  })

  it('Google button → label displays correctly on mobile', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).should('contain.text', 'Sign in with Google')
  })
})

// ============================================================
// MIDDLEWARE — ?next= PARAM PRESERVATION
// ============================================================
// Updated by Cypress Author — 2026-05-13
describe('Login - Middleware ?next= Param Preservation - Desktop', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.clearAllCookies()
  })

  it('inventory page redirect → preserves ?next= param on login', () => {
    cy.visit(C.routes.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login).and('include', 'next=').and('include', 'inventory')
  })

  it('trading page redirect → preserves ?next= param on login', () => {
    cy.visit(C.routes.trading_dashboard, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login).and('include', 'next=').and('include', 'trading')
  })

  it('landing page redirect → preserves ?next= param on login', () => {
    cy.visit(C.routes.landing, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login).and('include', 'next=')
  })

  it('unauthenticated API call → returns 401 JSON (no redirect)', () => {
    cy.request({
      method: 'GET',
      url: C.endpoints.user.profile,
      failOnStatusCode: false,
    }).should((res) => {
      expect(res.status).to.equal(401)
      expect(res.body).to.have.property('error').that.equals('Unauthorized')
    })
  })
})
