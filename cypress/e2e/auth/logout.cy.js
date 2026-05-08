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

  it('should return 200 when authenticated', () => {
    cy.apiRequestWithSession('POST', C.endpoints.auth.logout).then((res) => {
      expect(res.status).to.eq(200)
      expect(res.body).to.have.property('message', 'Logged out successfully')
    })
  })

  it('should return 401 when unauthenticated', () => {
    cy.apiRequestNoAuth('POST', C.endpoints.auth.logout).then((res) => {
      expect(res.status).to.eq(401)
      expect(res.body).to.have.property('error', 'UNAUTHORIZED')
    })
  })

  it('should not accept GET method', () => {
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
  })

  it('should display logout button', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.visible')
  })

  it("should show correct label 'Sign out'", () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('contain.text', 'Sign out')
    cy.get(`#${C.test_ids.auth.logout_btn_el} svg`).should('exist')
  })

  it('should have accessible aria-label', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should(
      'have.attr',
      'aria-label',
      'Sign out from application'
    )
  })

  it('should be keyboard accessible via Tab', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).focus().should('be.focused')
  })

  it('should show loading state while signing out', () => {
    cy.intercept('POST', C.endpoints.auth.logout, (req) => {
      req.reply({ delay: 2000, statusCode: 200, body: { message: 'Logged out successfully' } })
    }).as('logoutRequest')

    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.disabled')
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('contain.text', 'Signing out...')
    cy.get(`#${C.test_ids.auth.logout_btn_el} svg`).should('exist')
  })

  it('should redirect to /login after successful logout', () => {
    cy.intercept('POST', C.endpoints.auth.logout, {
      statusCode: 200,
      body: { message: 'Logged out successfully' },
    }).as('logoutRequest')

    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.wait('@logoutRequest')
    cy.url({ timeout: 5000 }).should('include', C.routes.login)
    cy.url().should('not.include', 'reason=session_expired')
  })

  it('should show error toast when logout API fails', () => {
    cy.intercept('POST', C.endpoints.auth.logout, {
      statusCode: 500,
      body: { error: 'LOGOUT_FAILED', message: 'Internal server error' },
    }).as('logoutFailed')

    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.wait('@logoutFailed')
    cy.get('[data-sonner-toast]').should('be.visible').and('contain.text', "Couldn't sign you out")
    cy.url().should('not.include', C.routes.login)
  })

  it('should re-enable button after failed logout', () => {
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
  })

  it('should display logout button', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.visible')
  })

  it("should show correct label 'Sign out'", () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('contain.text', 'Sign out')
    cy.get(`#${C.test_ids.auth.logout_btn_el} svg`).should('exist')
  })

  it('should have accessible aria-label', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should(
      'have.attr',
      'aria-label',
      'Sign out from application'
    )
  })

  it('should show loading state while signing out', () => {
    cy.intercept('POST', C.endpoints.auth.logout, (req) => {
      req.reply({ delay: 2000, statusCode: 200, body: { message: 'Logged out successfully' } })
    }).as('logoutRequest')

    cy.get(`#${C.test_ids.auth.logout_btn_el}`).click()
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.disabled')
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('contain.text', 'Signing out...')
  })

  it('should redirect to /login after successful logout', () => {
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

  it('should display user menu trigger button', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).should('be.visible')
  })

  it('should have accessible aria-label', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).should('have.attr', 'aria-label', 'User menu')
  })

  it('should show avatar or initial in trigger', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).within(() => {
      cy.get('div.rounded-full').should('exist')
    })
  })

  it('should open dropdown when clicked', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_email}`).should('be.visible')
  })

  it('should show user email in dropdown', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_email}`).should('be.visible').and('not.be.empty')
  })

  it("should show 'Sign out' option in dropdown", () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_signout}`)
      .should('be.visible')
      .and('contain.text', 'Sign out')
  })

  it('should redirect to /login after sign out from UserMenu', () => {
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

  it('should show error toast when sign out fails from UserMenu', () => {
    cy.intercept('POST', C.endpoints.auth.logout, {
      statusCode: 500,
      body: { error: 'LOGOUT_FAILED', message: 'Internal server error' },
    }).as('logoutFailed')

    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_signout}`).click()
    cy.wait('@logoutFailed')
    cy.get('[data-sonner-toast]').should('be.visible').and('contain.text', "Couldn't sign you out")
  })

  it('should be keyboard accessible', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).focus().should('be.focused')
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).type('{enter}')
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
  })

  it('should display user menu trigger on mobile', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).should('be.visible')
  })

  it('should open dropdown on mobile and show sign out', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
    cy.get(`#${C.test_ids.auth.user_menu_signout}`).should('be.visible')
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
  })

  it('should display user menu trigger on tablet', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).should('be.visible')
  })

  it('should open dropdown on tablet and show email + sign out', () => {
    cy.get(`#${C.test_ids.auth.user_menu_trigger}`).click()
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
  })

  it('should display logout button', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.visible')
  })

  it("should show correct label 'Sign out'", () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('contain.text', 'Sign out')
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
  })

  it('should display logout button', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.visible')
  })

  it("should show correct label 'Sign out'", () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('contain.text', 'Sign out')
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
  })

  it('should display logout button', () => {
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
  })

  it('should display logout button', () => {
    cy.get(`#${C.test_ids.auth.logout_btn_el}`).should('be.visible')
  })
})
