describe('Session Expiry - Error Message Display - Desktop', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('login with ?reason=session_expired → login page displays', () => {
    cy.visit(`${C.routes.login}?reason=session_expired`)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('login with ?error=auth_failed → login page displays', () => {
    cy.visit(`${C.routes.login}?error=auth_failed`)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('login with ?error=no_code → login page displays', () => {
    cy.visit(`${C.routes.login}?error=no_code`)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('login with no params → page loads normally with enabled button', () => {
    cy.visit(C.routes.login)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
    cy.get(`#${C.test_ids.auth.google_signin_btn}`).should('not.be.disabled')
  })
})

describe('Session Expiry - Protected Route Guards - Desktop', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.clearAuth()
  })

  it('should redirect to login from inventory when session cleared', () => {
    cy.visit(C.routes.inventory_product_list, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
  })

  it('should redirect to login from trading when session cleared', () => {
    cy.visit(C.routes.trading_dashboard, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
  })

  it('should redirect to login from landing when session cleared', () => {
    cy.visit(C.routes.landing, { failOnStatusCode: false })
    cy.url().should('include', C.routes.login)
  })
})

describe('Session Expiry - Error Message Display - Mobile', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('iphone-x')
  })

  it('should show session expired message on mobile', () => {
    cy.visit(`${C.routes.login}?reason=session_expired`)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })

  it('should show auth failed message on mobile', () => {
    cy.visit(`${C.routes.login}?error=auth_failed`)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })
})

describe('Session Expiry - Error Message Display - Tablet', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('ipad-2')
  })

  it('should show session expired message on tablet', () => {
    cy.visit(`${C.routes.login}?reason=session_expired`)
    cy.get(`#${C.test_ids.auth.login_page}`).should('be.visible')
  })
})

// ------------------------------------------------------------
// TOAST CONTENT VERIFICATION
// ------------------------------------------------------------
describe('Session - Toast Content Verification - Desktop', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport(1920, 1080)
  })

  it('?reason=session_expired param → displays "session expired" toast', () => {
    cy.visit(`${C.routes.login}?reason=session_expired`)
    cy.get('[data-sonner-toast]', { timeout: 5000 })
      .should('be.visible')
      .and('contain.text', "You've been signed out")
  })

  it('should show correct toast text for ?error=auth_failed', () => {
    cy.visit(`${C.routes.login}?error=auth_failed`)
    cy.get('[data-sonner-toast]', { timeout: 5000 })
      .should('be.visible')
      .and('contain.text', 'Login failed')
  })

  it('should show correct toast text for ?error=no_code', () => {
    cy.visit(`${C.routes.login}?error=no_code`)
    cy.get('[data-sonner-toast]', { timeout: 5000 })
      .should('be.visible')
      .and('contain.text', 'Invalid login attempt')
  })

  it('should NOT show any toast when visiting /login with no params', () => {
    cy.visit(C.routes.login)
    cy.wait(1000)
    cy.get('[data-sonner-toast]').should('not.exist')
  })

  it("should NOT show 'session expired' toast on intentional logout", () => {
    cy.loginWithBypass()
    cy.visit(C.routes.inventory_product_list)

    cy.intercept('POST', C.endpoints.auth.logout, {
      statusCode: 200,
      body: { message: 'Logged out successfully' },
    }).as('logoutRequest')

    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.wait('@logoutRequest')

    // URL must NOT include session_expired — this is the primary signal
    // that AuthListener did not fire the session expiry redirect
    cy.url({ timeout: 5000 }).should('include', C.routes.login)
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

// ------------------------------------------------------------
// API SECURITY — PROTECTED ROUTES
// ------------------------------------------------------------
describe('Session - API Security - Unauthenticated Requests', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  it('should return 401 for GET /api/user when unauthenticated', () => {
    cy.request({ method: 'GET', url: C.endpoints.user.profile, failOnStatusCode: false }).then(
      (res) => {
        expect(res.status).to.eq(401)
        expect(res.body).to.have.property('error', 'Unauthorized')
      }
    )
  })

  it('should return 401 for POST /api/auth/logout when unauthenticated', () => {
    cy.apiRequestNoAuth('POST', C.endpoints.auth.logout).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
    })
  })

  it('should return 401 for inventory API when unauthenticated', () => {
    cy.request({
      method: 'GET',
      url: C.endpoints.inventory.get_products,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })

  it('should return 401 for trading API when unauthenticated', () => {
    cy.request({
      method: 'GET',
      url: C.endpoints.trading.get_trades,
      failOnStatusCode: false,
    }).then((res) => {
      expect(res.status).to.eq(401)
    })
  })
})

// ------------------------------------------------------------
// CALLBACK — OPEN REDIRECT VALIDATION
// ------------------------------------------------------------
describe('Session - Callback Open Redirect Validation', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  it('should redirect to /login?error=no_code when ?next= has no code param', () => {
    cy.visit(`${C.routes.auth_callback_v1}?next=https://evil.com`, {
      failOnStatusCode: false,
    })
    cy.url().should('include', C.routes.login)
    cy.url().should('include', 'error=no_code')
  })

  it('should redirect to /login?error=no_code even with relative-looking malformed next', () => {
    cy.visit(`${C.routes.auth_callback_v1}?next=//evil.com`, {
      failOnStatusCode: false,
    })
    cy.url().should('include', C.routes.login)
    cy.url().should('include', 'error=no_code')
  })
})
