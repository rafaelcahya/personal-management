import { ROUTES } from '../../../fixtures/routes.js'
import { TEST_IDS } from '../../../fixtures/test-ids.js'
import { AUTH_ENDPOINTS } from '../../../fixtures/endpoints.js'

beforeEach(() => {
  Cypress.session.clearAllSavedSessions()
})

describe('Logout Button - Inventory Layout - Desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.loginWithBypass()
    cy.visit(ROUTES.inventory_product_list)
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
  })

  it('logout button (Inventory) → is visible on page load', () => {
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('be.visible')
  })

  it('logout button (Inventory) → displays "Sign out" label with icon', () => {
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('contain.text', 'Sign out')
    cy.get(`#${TEST_IDS.auth.logout_btn_el} svg`).should('exist')
  })

  it('logout button (Inventory) → has accessible aria-label attribute', () => {
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should(
      'have.attr',
      'aria-label',
      'Sign out from application'
    )
  })

  it('logout button (Inventory) → is focusable via keyboard Tab navigation', () => {
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).focus().should('be.focused')
  })

  it('logout button (Inventory) → shows disabled + "Signing out..." while API in progress', () => {
    cy.intercept('POST', AUTH_ENDPOINTS.LOGOUT, (req) => {
      req.reply({ delay: 2000, statusCode: 200, body: { message: 'Logged out successfully' } })
    }).as('logoutRequest')

    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).click()
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('be.disabled')
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('contain.text', 'Signing out...')
    cy.get(`#${TEST_IDS.auth.logout_btn_el} svg`).should('exist')
  })

  it('logout button (Inventory) → redirects to /login after successful logout', () => {
    cy.intercept('POST', AUTH_ENDPOINTS.LOGOUT, {
      statusCode: 200,
      body: { message: 'Logged out successfully' },
    }).as('logoutRequest')

    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).click()
    cy.wait('@logoutRequest')
    cy.url({ timeout: 5000 }).should('include', ROUTES.login)
    cy.url().should('not.include', 'reason=session_expired')
  })

  it('logout button (Inventory) API error → displays error toast and stays on page', () => {
    cy.intercept('POST', AUTH_ENDPOINTS.LOGOUT, {
      statusCode: 500,
      body: { error: 'LOGOUT_FAILED', message: 'Internal server error' },
    }).as('logoutFailed')

    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).click()
    cy.wait('@logoutFailed')
    cy.get('[data-sonner-toast]').should('be.visible').and('contain.text', "Couldn't sign you out")
    cy.url().should('not.include', ROUTES.login)
  })

  it('logout button (Inventory) API error → re-enables button after failed logout', () => {
    cy.intercept('POST', AUTH_ENDPOINTS.LOGOUT, {
      statusCode: 500,
      body: { error: 'LOGOUT_FAILED', message: 'Internal server error' },
    }).as('logoutFailed')

    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).click()
    cy.wait('@logoutFailed')
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('not.be.disabled')
  })
})

describe('Logout Button - Trading Layout - Desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.loginWithBypass()
    cy.visit(ROUTES.trading_dashboard)
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
  })

  it('logout button (Trading) → is visible on page load', () => {
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('be.visible')
  })

  it('logout button (Trading) → displays "Sign out" label with icon', () => {
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('contain.text', 'Sign out')
    cy.get(`#${TEST_IDS.auth.logout_btn_el} svg`).should('exist')
  })

  it('logout button (Trading) → has accessible aria-label attribute', () => {
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should(
      'have.attr',
      'aria-label',
      'Sign out from application'
    )
  })

  it('logout button (Trading) → shows disabled + "Signing out..." while API in progress', () => {
    cy.intercept('POST', AUTH_ENDPOINTS.LOGOUT, (req) => {
      req.reply({ delay: 2000, statusCode: 200, body: { message: 'Logged out successfully' } })
    }).as('logoutRequest')

    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).click()
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('be.disabled')
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('contain.text', 'Signing out...')
  })

  it('logout button (Trading) → redirects to /login after successful logout', () => {
    cy.intercept('POST', AUTH_ENDPOINTS.LOGOUT, {
      statusCode: 200,
      body: { message: 'Logged out successfully' },
    }).as('logoutRequest')

    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).click()
    cy.wait('@logoutRequest')
    cy.url({ timeout: 5000 }).should('include', ROUTES.login)
    cy.url().should('not.include', 'reason=session_expired')
  })
})

describe('UserMenu - Landing Page - Desktop', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)
  })

  it('user menu trigger (Landing) → is visible on page load', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).should('be.visible')
  })

  it('user menu trigger (Landing) → has accessible aria-label attribute', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).should('have.attr', 'aria-label', 'User menu')
  })

  it('user menu trigger (Landing) → displays avatar or initial (rounded element)', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).within(() => {
      cy.get('div.rounded-full').should('exist')
    })
  })

  it('user menu trigger (Landing) click → opens dropdown menu', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_email}`).should('be.visible')
  })

  it('user menu (Landing) → displays user email in dropdown', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_email}`).should('be.visible').and('not.be.empty')
  })

  it('user menu (Landing) → displays "Sign out" option in dropdown', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`)
      .should('be.visible')
      .and('contain.text', 'Sign out')
  })

  it('user menu (Landing) "Sign out" successful → redirects to /login', () => {
    cy.intercept('POST', AUTH_ENDPOINTS.LOGOUT, {
      statusCode: 200,
      body: { message: 'Logged out successfully' },
    }).as('logoutRequest')

    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).click()
    cy.wait('@logoutRequest')
    cy.url({ timeout: 5000 }).should('include', ROUTES.login)
    cy.url().should('not.include', 'reason=session_expired')
  })

  it('user menu (Landing) "Sign out" API error → displays error toast and menu closes', () => {
    cy.intercept('POST', AUTH_ENDPOINTS.LOGOUT, {
      statusCode: 500,
      body: { error: 'LOGOUT_FAILED', message: 'Internal server error' },
    }).as('logoutFailed')

    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).click()
    cy.wait('@logoutFailed')
    cy.get('[data-sonner-toast]').should('be.visible').and('contain.text', "Couldn't sign you out")
  })

  it('user menu trigger (Landing) → is focusable and opens on Enter key', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).focus().should('be.focused').click()
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).should('be.visible')
  })
})

describe('UserMenu - Landing Page - Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)
    cy.get(`#${TEST_IDS.auth.mobile_menu_trigger}`).click()
  })

  it('user menu trigger (Landing, Mobile) → is visible on mobile viewport', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger_mobile}`).should('be.visible')
  })

  it('user menu (Landing, Mobile) click → opens dropdown and displays "Sign out"', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger_mobile}`).click({ force: true })
    cy.get(`#${TEST_IDS.auth.user_menu_signout_mobile}`).should('be.visible')
  })
})

describe('UserMenu - Landing Page - Tablet', () => {
  beforeEach(() => {
    cy.viewport('ipad-2')
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
  })

  it('user menu trigger (Landing, Tablet) → is visible on tablet viewport', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).should('be.visible')
  })

  it('user menu (Landing, Tablet) click → opens dropdown showing email + "Sign out"', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_email}`).should('be.visible')
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).should('be.visible')
  })
})

describe('Logout Button - Inventory Layout - Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.loginWithBypass()
    cy.visit(ROUTES.inventory_product_list)
    cy.get(`#${TEST_IDS.auth.mobile_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_trigger_mobile}`).click({ force: true })
  })

  it('logout button (Inventory, Mobile) → is visible on mobile viewport', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_signout_mobile}`).should('be.visible')
  })

  it('logout button (Inventory, Mobile) → displays "Sign out" label', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_signout_mobile}`).should('contain.text', 'Sign out')
  })
})

describe('Logout Button - Trading Layout - Mobile', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.loginWithBypass()
    cy.visit(ROUTES.trading_dashboard)
    cy.get(`#${TEST_IDS.auth.mobile_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_trigger_mobile}`).click({ force: true })
  })

  it('logout button (Trading, Mobile) → is visible on mobile viewport', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_signout_mobile}`).should('be.visible')
  })

  it('logout button (Trading, Mobile) → displays "Sign out" label', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_signout_mobile}`).should('contain.text', 'Sign out')
  })
})

describe('Logout Button - Inventory Layout - Tablet', () => {
  beforeEach(() => {
    cy.viewport('ipad-2')
    cy.loginWithBypass()
    cy.visit(ROUTES.inventory_product_list)
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
  })

  it('logout button (Inventory, Tablet) → is visible on tablet viewport', () => {
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('be.visible')
  })
})

describe('Logout Button - Trading Layout - Tablet', () => {
  beforeEach(() => {
    cy.viewport('ipad-2')
    cy.loginWithBypass()
    cy.visit(ROUTES.trading_dashboard)
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
  })

  it('logout button (Trading, Tablet) → is visible on tablet viewport', () => {
    cy.get(`#${TEST_IDS.auth.logout_btn_el}`).should('be.visible')
  })
})
