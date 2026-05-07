import { faker } from '@faker-js/faker'

describe('Login - API & Authentication', () => {
  let C
  before(() => {
    cy.clearAllCookies()
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  it('should authenticate programmatically via Supabase API', () => {
    cy.env(['TEST_EMAIL', 'TEST_PASSWORD']).then(({ TEST_EMAIL, TEST_PASSWORD }) => {
      cy.task('getSupabaseSession', {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      }).then((session) => {
        expect(session).to.not.be.null
        expect(session).to.have.property('access_token')
        expect(session).to.have.property('refresh_token')
        expect(session).to.have.property('user')

        cy.log(`✅ Access Token: ${session.access_token.substring(0, 20)}...`)
        cy.log(`✅ User ID: ${session.user.id}`)
        cy.log(`✅ User Email: ${session.user.email}`)
      })
    })
  })

  it('should redirect unauthenticated user to login', () => {
    cy.disableBypass()
    cy.visit(C.routes.landing, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
  })

  it("should redirect root '/' to login when unauthenticated", () => {
    cy.clearAllCookies()
    cy.visit(C.routes.root, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
  })

  it('should fail login with invalid credentials', () => {
    cy.task('getSupabaseSession', {
      email: faker.internet.email(),
      password: faker.word.words(2),
    }).then((session) => {
      expect(session).to.be.null
    })
  })

  it('should have valid session structure', () => {
    cy.login()

    cy.getSession().then((session) => {
      expect(session).to.have.property('access_token')
      expect(session).to.have.property('refresh_token')
      expect(session).to.have.property('expires_in')
      expect(session).to.have.property('expires_at')
      expect(session).to.have.property('token_type')
      expect(session).to.have.property('user')
      expect(session.token_type).to.equal('bearer')
      expect(session.user).to.have.property('id')
      expect(session.user).to.have.property('email')
      expect(session.user).to.have.property('user_metadata')
    })
  })

  it('should have non-expired token', () => {
    cy.login()

    cy.getSession().then((session) => {
      expect(session).to.not.be.null
      const now = Math.floor(Date.now() / 1000)
      expect(session.expires_at).to.be.greaterThan(now)
      cy.log(`✅ Token expires at: ${new Date(session.expires_at * 1000).toISOString()}`)
    })
  })

  it('should store session user email matching TEST_EMAIL', () => {
    cy.env(['TEST_EMAIL']).then(({ TEST_EMAIL }) => {
      cy.login()

      cy.getSession().then((session) => {
        expect(session).to.not.be.null
        expect(session.user.email).to.equal(TEST_EMAIL)
        cy.log(`✅ User email matches: ${session.user.email}`)
      })
    })
  })

  it('should create session and store in localStorage', () => {
    cy.login()

    cy.getSession().then((session) => {
      expect(session).to.not.be.null
      expect(session).to.have.property('access_token')
      expect(session).to.have.property('user')
      expect(session.user).to.have.property('email')

      cy.log(`✅ User: ${session.user.email}`)
      cy.log(`✅ User ID: ${session.user.id}`)
    })
  })

  it('should clear session data from localStorage on clearAuth', () => {
    cy.login()
    cy.visit(C.routes.root)

    cy.window().then((win) => {
      expect(win.localStorage.getItem('cypress-session')).to.not.be.null
    })

    cy.clearAuth()

    cy.window().then((win) => {
      expect(win.localStorage.getItem('cypress-session')).to.be.null
      expect(win.localStorage.getItem('cypress-access-token')).to.be.null
    })
  })

  it('should access protected route with bypass', () => {
    cy.loginWithBypass()

    cy.env(['CYPRESS_AUTH_SECRET']).then(({ CYPRESS_AUTH_SECRET }) => {
      cy.getCookie('cypress-bypass').then((cookie) => {
        expect(cookie).to.not.be.null
        expect(cookie.value).to.equal(CYPRESS_AUTH_SECRET)
      })
    })

    cy.visit(C.routes.landing)

    cy.url().should('include', C.routes.landing)
    cy.url().should('not.include', C.routes.login)
    cy.get('body').should('be.visible')
  })

  it("should redirect to landing when authenticated and visiting root '/'", () => {
    cy.loginWithBypass()
    cy.visit(C.routes.root)
    cy.url().should('include', C.routes.landing)
  })

  it('should get valid access token', () => {
    cy.login()

    cy.getAuthToken().then((token) => {
      expect(token).to.not.be.null
      expect(token).to.be.a('string')
      expect(token).to.have.length.greaterThan(100)

      cy.log(`✅ Token length: ${token.length}`)
    })
  })
})

describe('Login Page - Desktop Interactions', () => {
  let C
  beforeEach(() => {
    cy.viewport(1920, 1080)
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

  it('should redirect to login when callback code cannot be exchanged', () => {
    // The code exchange happens server-side (SSR), so a fake code will fail
    // the Supabase exchange and redirect to /login?error=auth_failed
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

describe('Login - Session Persistence - Dekstop Interactions', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('should persist session across page reloads', () => {
    cy.loginWithBypass()
    cy.visit(C.routes.landing)

    cy.url().should('include', C.routes.landing)

    cy.reload()

    cy.url().should('include', C.routes.landing)
    cy.get('body').should('be.visible')
  })

  it('should redirect to login when session expired after access landing page', () => {
    cy.clearAuth()
    cy.visit(C.routes.landing, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product list page', () => {
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

describe('Login Page - Mobile Interactions', () => {
  let C
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.fixture('app-constants').then((data) => {
      C = data
      cy.visit(C.routes.login)
    })
  })

  it('should display login page with correct elements', () => {
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should display Google login button', () => {
    cy.contains('Sign in with Google').should('be.visible')
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).should('not.be.disabled')
  })

  it('should show Google icon in login button', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).find('svg').should('be.visible')
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

    cy.url().should('include', C.routes.landing)

    cy.reload()

    cy.url().should('include', C.routes.landing)
    cy.get('body').should('be.visible')
  })

  it('should redirect to login when session expired after access landing page', () => {
    cy.clearAuth()
    cy.visit(C.routes.landing, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product list page', () => {
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

    cy.url().should('include', C.routes.landing)

    cy.reload()

    cy.url().should('include', C.routes.landing)
    cy.get('body').should('be.visible')
  })

  it('should redirect to login when session expired after access landing page', () => {
    cy.clearAuth()
    cy.visit(C.routes.landing, { failOnStatusCode: false })

    cy.url().should('include', C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should redirect to login when session expired after access product list page', () => {
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

  it("should display app name 'Personal Management'", () => {
    cy.contains('Personal Management').should('be.visible')
  })

  it("should show Google button with correct label 'Sign in with Google'", () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`)
      .should('be.visible')
      .and('contain.text', 'Sign in with Google')
  })

  it("should have aria-label 'Sign in with Google' on Google button", () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).should(
      'have.attr',
      'aria-label',
      'Sign in with Google'
    )
  })

  it('should have Google SVG icon with multiple colored paths', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn} svg path`).should('have.length.gte', 4)
  })
})

describe('Login Page - App Identity & Google Branding - Mobile', () => {
  let C
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.fixture('app-constants').then((data) => {
      C = data
      cy.visit(C.routes.login)
    })
  })

  it('should display app name on mobile', () => {
    cy.contains('Personal Management').should('be.visible')
  })

  it('should show correct Google button label on mobile', () => {
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).should('contain.text', 'Sign in with Google')
  })
})

// ------------------------------------------------------------
// MIDDLEWARE — ?next= PARAM PRESERVATION
// ------------------------------------------------------------
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

  it('should preserve ?next= param when redirected from inventory page', () => {
    cy.visit(C.routes.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
    cy.url().should('include', 'next=')
    cy.url().should('include', 'inventory')
  })

  it('should preserve ?next= param when redirected from trading page', () => {
    cy.visit(C.routes.trading_dashboard, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
    cy.url().should('include', 'next=')
    cy.url().should('include', 'trading')
  })

  it('should preserve ?next= param when redirected from landing page', () => {
    cy.visit(C.routes.landing, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
    cy.url().should('include', 'next=')
  })

  it('should return 401 JSON for unauthenticated API calls (not redirect)', () => {
    cy.request({
      method: 'GET',
      url: C.endpoints.user.profile,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'UNAUTHORIZED')
    })
  })
})
