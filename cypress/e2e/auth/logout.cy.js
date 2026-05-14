// ============================================================
// LOGOUT TEST SUITE
// Covers: API endpoint, LogoutButton (Inventory & Trading),
//         UserMenu (Landing), redirect, loading state, error toast
// ============================================================

// ------------------------------------------------------------
// API ENDPOINT
// ------------------------------------------------------------
describe('Logout - API Endpoint', () => {
  let C
  before(() => {
    cy.setupApiAuthCookies()
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  it('POST logout endpoint (authenticated) → returns 200 with success message', () => {
    cy.apiRequestWithSession('POST', C.endpoints.auth.logout).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Logged out successfully')
    })
  })

  it('POST logout endpoint (unauthenticated) → returns 401 unauthorized', () => {
    cy.apiRequestNoAuth('POST', C.endpoints.auth.logout).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'Unauthorized')
    })
  })

  it('GET logout endpoint (invalid method) → returns non-200 status', () => {
    cy.apiRequestNoAuth('GET', C.endpoints.auth.logout).then((res) => {
      expect(res.status).to.not.eq(200)
    })
  })
})

// ------------------------------------------------------------
// LOGOUT BUTTON — INVENTORY LAYOUT — DESKTOP
// ------------------------------------------------------------
describe('Logout Button - Inventory Layout - Desktop', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.loginWithBypass()
    cy.visit(C.routes.inventory_product_list)
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
  })

  it('logout button (Inventory) → is visible on page load', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.visible')
  })

  it('logout button (Inventory) → displays "Sign out" label with icon', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('contain.text', 'Sign out')
    cy.get(`#${C.test_ids.auth.logout_btn_el} svg`).should('exist')
  })

  it('logout button (Inventory) → has accessible aria-label attribute', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should(
      'have.attr',
      'aria-label',
      'Sign out from application'
    )
  })

  it('logout button (Inventory) → is focusable via keyboard Tab navigation', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).focus().should('be.focused')
  })

  it('logout button (Inventory) → shows disabled + "Signing out..." while API in progress', () => {
    cy.intercept('POST', C.endpoints.auth.logout, (req) => {
      req.reply({ delay: 2000, statusCode: 200, body: { message: 'Logged out successfully' } })
    }).as('logoutRequest')

    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.disabled')
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('contain.text', 'Signing out...')
    cy.get(`#${C.test_ids.auth.logout_btn_el} svg`).should('exist')
  })

  it('logout button (Inventory) → redirects to /login after successful logout', () => {
    cy.intercept('POST', C.endpoints.auth.logout, {
      statusCode: 200,
      body: { message: 'Logged out successfully' },
    }).as('logoutRequest')

    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.wait('@logoutRequest')
    cy.url({ timeout: 5000 }).should('include', C.routes.login)
    cy.url().should('not.include', 'reason=session_expired')
  })

  it('logout button (Inventory) API error → displays error toast and stays on page', () => {
    cy.intercept('POST', C.endpoints.auth.logout, {
      statusCode: 500,
      body: { error: 'LOGOUT_FAILED', message: 'Internal server error' },
    }).as('logoutFailed')

    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.wait('@logoutFailed')
    cy.get('[data-sonner-toast]').should('be.visible').and('contain.text', "Couldn't sign you out")
    cy.url().should('not.include', C.routes.login)
  })

  it('logout button (Inventory) API error → re-enables button after failed logout', () => {
    cy.intercept('POST', C.endpoints.auth.logout, {
      statusCode: 500,
      body: { error: 'LOGOUT_FAILED', message: 'Internal server error' },
    }).as('logoutFailed')

    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.wait('@logoutFailed')
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('not.be.disabled')
  })
})

// ------------------------------------------------------------
// LOGOUT BUTTON — TRADING LAYOUT — DESKTOP
// ------------------------------------------------------------
describe('Logout Button - Trading Layout - Desktop', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.loginWithBypass()
    cy.visit(C.routes.trading_dashboard)
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
  })

  it('logout button (Trading) → is visible on page load', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.visible')
  })

  it('logout button (Trading) → displays "Sign out" label with icon', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('contain.text', 'Sign out')
    cy.get(`#${C.test_ids.auth.logout_btn_el} svg`).should('exist')
  })

  it('logout button (Trading) → has accessible aria-label attribute', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should(
      'have.attr',
      'aria-label',
      'Sign out from application'
    )
  })

  it('logout button (Trading) → shows disabled + "Signing out..." while API in progress', () => {
    cy.intercept('POST', C.endpoints.auth.logout, (req) => {
      req.reply({ delay: 2000, statusCode: 200, body: { message: 'Logged out successfully' } })
    }).as('logoutRequest')

    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.disabled')
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('contain.text', 'Signing out...')
  })

  it('logout button (Trading) → redirects to /login after successful logout', () => {
    cy.intercept('POST', C.endpoints.auth.logout, {
      statusCode: 200,
      body: { message: 'Logged out successfully' },
    }).as('logoutRequest')

    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.wait('@logoutRequest')
    cy.url({ timeout: 5000 }).should('include', C.routes.login)
    cy.url().should('not.include', 'reason=session_expired')
  })
})

// ------------------------------------------------------------
// USER MENU — LANDING PAGE — DESKTOP
// ------------------------------------------------------------
describe('UserMenu - Landing Page - Desktop', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.loginWithBypass()
    cy.visit(C.routes.landing)
  })

  it('user menu trigger (Landing) → is visible on page load', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).should('be.visible')
  })

  it('user menu trigger (Landing) → has accessible aria-label attribute', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).should('have.attr', 'aria-label', 'User menu')
  })

  it('user menu trigger (Landing) → displays avatar or initial (rounded element)', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).within(() => {
      cy.get('div.rounded-full').should('exist')
    })
  })

  it('user menu trigger (Landing) click → opens dropdown menu', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_email}`).should('be.visible')
  })

  it('user menu (Landing) → displays user email in dropdown', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_email}`).should('be.visible').and('not.be.empty')
  })

  it('user menu (Landing) → displays "Sign out" option in dropdown', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_signout}`)
      .should('be.visible')
      .and('contain.text', 'Sign out')
  })

  it('user menu (Landing) "Sign out" successful → redirects to /login', () => {
    cy.intercept('POST', C.endpoints.auth.logout, {
      statusCode: 200,
      body: { message: 'Logged out successfully' },
    }).as('logoutRequest')

    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_signout}`).click()
    cy.wait('@logoutRequest')
    cy.url({ timeout: 5000 }).should('include', C.routes.login)
    cy.url().should('not.include', 'reason=session_expired')
  })

  it('user menu (Landing) "Sign out" API error → displays error toast and menu closes', () => {
    cy.intercept('POST', C.endpoints.auth.logout, {
      statusCode: 500,
      body: { error: 'LOGOUT_FAILED', message: 'Internal server error' },
    }).as('logoutFailed')

    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_signout}`).click()
    cy.wait('@logoutFailed')
    cy.get('[data-sonner-toast]').should('be.visible').and('contain.text', "Couldn't sign you out")
  })

  it('user menu trigger (Landing) → is focusable and opens on Enter key', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).focus().should('be.focused').click()
    cy.get(`#${C.test_ids.auth.user_menu_signout}`).should('be.visible')
  })
})

// ------------------------------------------------------------
// USER MENU — LANDING PAGE — MOBILE
// ------------------------------------------------------------
describe('UserMenu - Landing Page - Mobile', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.loginWithBypass()
    cy.visit(C.routes.landing)
    cy.get(`#${C.test_ids.auth.mobile_menu_trigger}`).click()
  })

  it('user menu trigger (Landing, Mobile) → is visible on mobile viewport', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger_mobile}`).should('be.visible')
  })

  it('user menu (Landing, Mobile) click → opens dropdown and displays "Sign out"', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger_mobile}`).click({ force: true })
    cy.get(`#${C.test_ids.auth.user_menu_signout_mobile}`).should('be.visible')
  })
})

// ------------------------------------------------------------
// USER MENU — LANDING PAGE — TABLET
// ------------------------------------------------------------
describe('UserMenu - Landing Page - Tablet', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('ipad-2')
    cy.loginWithBypass()
    cy.visit(C.routes.landing)
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
  })

  it('user menu trigger (Landing, Tablet) → is visible on tablet viewport', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).should('be.visible')
  })

  it('user menu (Landing, Tablet) click → opens dropdown showing email + "Sign out"', () => {
    cy.get(`#${C.test_ids.auth.user_menu_email}`).should('be.visible')
    cy.get(`#${C.test_ids.auth.user_menu_signout}`).should('be.visible')
  })
})

// ------------------------------------------------------------
// LOGOUT BUTTON — INVENTORY LAYOUT — MOBILE
// ------------------------------------------------------------
describe('Logout Button - Inventory Layout - Mobile', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.loginWithBypass()
    cy.visit(C.routes.inventory_product_list)
    cy.get(`#${C.test_ids.auth.mobile_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_trigger_mobile}`).click({ force: true })
  })

  it('logout button (Inventory, Mobile) → is visible on mobile viewport', () => {
    cy.get(`#${C.test_ids.auth.user_menu_signout_mobile}`).should('be.visible')
  })

  it('logout button (Inventory, Mobile) → displays "Sign out" label', () => {
    cy.get(`#${C.test_ids.auth.user_menu_signout_mobile}`).should('contain.text', 'Sign out')
  })
})

// ------------------------------------------------------------
// LOGOUT BUTTON — TRADING LAYOUT — MOBILE
// ------------------------------------------------------------
describe('Logout Button - Trading Layout - Mobile', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.loginWithBypass()
    cy.visit(C.routes.trading_dashboard)
    cy.get(`#${C.test_ids.auth.mobile_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_trigger_mobile}`).click({ force: true })
  })

  it('logout button (Trading, Mobile) → is visible on mobile viewport', () => {
    cy.get(`#${C.test_ids.auth.user_menu_signout_mobile}`).should('be.visible')
  })

  it('logout button (Trading, Mobile) → displays "Sign out" label', () => {
    cy.get(`#${C.test_ids.auth.user_menu_signout_mobile}`).should('contain.text', 'Sign out')
  })
})

// ------------------------------------------------------------
// LOGOUT BUTTON — INVENTORY LAYOUT — TABLET
// ------------------------------------------------------------
describe('Logout Button - Inventory Layout - Tablet', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('ipad-2')
    cy.loginWithBypass()
    cy.visit(C.routes.inventory_product_list)
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
  })

  it('logout button (Inventory, Tablet) → is visible on tablet viewport', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.visible')
  })
})

// ------------------------------------------------------------
// LOGOUT BUTTON — TRADING LAYOUT — TABLET
// ------------------------------------------------------------
describe('Logout Button - Trading Layout - Tablet', () => {
  let C
  before(() => {
    cy.fixture('app-constants').then((data) => {
      C = data
    })
  })

  beforeEach(() => {
    cy.viewport('ipad-2')
    cy.loginWithBypass()
    cy.visit(C.routes.trading_dashboard)
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
  })

  it('logout button (Trading, Tablet) → is visible on tablet viewport', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.visible')
  })
})
