import { TEST_IDS } from '../../fixtures/test-ids.js'
import { ROUTES } from '../../fixtures/routes.js'

describe('Landing Page - User Experience', () => {
  beforeEach(() => {
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)
  })

  it('should display user greeting with correct name', () => {
    cy.getSession().then((session) => {
      const fullName = session.user.user_metadata?.full_name
      const email = session.user.email

      const expectedName = fullName ? fullName.split(' ')[0] : email.split('@')[0]

      cy.get(`#${TEST_IDS.landing.full_name}`)
        .should('be.visible')
        .invoke('text')
        .should('eq', expectedName)
    })
  })

  it('should display trade management card', () => {
    cy.get(`#${TEST_IDS.landing.trade_card}`).should('be.visible')
  })

  it('should display inventory management card', () => {
    cy.get(`#${TEST_IDS.landing.inventory_card}`).should('be.visible')
  })
})

describe('Landing Page - Navigation', () => {
  beforeEach(() => {
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)
  })

  it('should navigate to Trading Dashboard when clicking Trade button', () => {
    cy.get(`#${TEST_IDS.landing.trade_btn}`).should('be.visible').click()

    cy.location('pathname').should('eq', ROUTES.trading_dashboard)
    cy.url().should('include', ROUTES.trading_dashboard)
  })

  it('should navigate to Inventory List when clicking Inventory button', () => {
    cy.get(`#${TEST_IDS.landing.inventory_btn}`).should('be.visible').click()

    cy.location('pathname').should('eq', ROUTES.inventory_product_list)
    cy.url().should('include', ROUTES.inventory_product_list)
  })
})

describe('Landing Page - Responsive Layout', () => {
  beforeEach(() => {
    cy.loginWithBypass()
  })

  it('should display correctly on mobile viewport', () => {
    cy.viewport('iphone-x')
    cy.visit(ROUTES.landing)

    cy.get(`#${TEST_IDS.landing.full_name}`).should('be.visible')
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).should('be.visible')
    cy.get(`#${TEST_IDS.landing.trade_card}`).should('be.visible')
    cy.get(`#${TEST_IDS.landing.inventory_card}`).should('be.visible')
  })

  it('should display correctly on tablet viewport', () => {
    cy.viewport('ipad-2')
    cy.visit(ROUTES.landing)

    cy.get(`#${TEST_IDS.landing.full_name}`).should('be.visible')
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).should('be.visible')
    cy.get(`#${TEST_IDS.landing.trade_card}`).should('be.visible')
    cy.get(`#${TEST_IDS.landing.inventory_card}`).should('be.visible')
  })

  it('should display correctly on desktop viewport', () => {
    cy.viewport(1920, 1080)
    cy.visit(ROUTES.landing)

    cy.get(`#${TEST_IDS.landing.full_name}`).should('be.visible')
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).should('be.visible')
    cy.get(`#${TEST_IDS.landing.trade_card}`).should('be.visible')
    cy.get(`#${TEST_IDS.landing.inventory_card}`).should('be.visible')
  })
})

describe('Landing Page - Mobile Interactions', () => {
  beforeEach(() => {
    cy.viewport('iphone-x')
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)
  })

  it('should display user greeting with correct name on mobile viewport', () => {
    cy.getSession().then((session) => {
      const fullName = session.user.user_metadata?.full_name
      const email = session.user.email

      const expectedName = fullName ? fullName.split(' ')[0] : email.split('@')[0]

      cy.get(`#${TEST_IDS.landing.full_name}`)
        .should('be.visible')
        .invoke('text')
        .should('eq', expectedName)
    })
  })

  it('should navigate to Trading Dashboard when clicking Trade button on mobile viewport', () => {
    cy.get(`#${TEST_IDS.landing.trade_btn}`).should('be.visible').click()

    cy.location('pathname').should('eq', ROUTES.trading_dashboard)
    cy.url().should('include', ROUTES.trading_dashboard)
  })

  it('should navigate to Inventory List when clicking Inventory button on mobile viewport', () => {
    cy.get(`#${TEST_IDS.landing.inventory_btn}`).should('be.visible').click()

    cy.location('pathname').should('eq', ROUTES.inventory_product_list)
    cy.url().should('include', ROUTES.inventory_product_list)
  })
})

describe('Landing Page - Tablet Interactions', () => {
  beforeEach(() => {
    cy.viewport('ipad-2')
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)
  })

  it('should display user greeting with correct name on tablet viewport', () => {
    cy.getSession().then((session) => {
      const fullName = session.user.user_metadata?.full_name
      const email = session.user.email

      const expectedName = fullName ? fullName.split(' ')[0] : email.split('@')[0]

      cy.get(`#${TEST_IDS.landing.full_name}`)
        .should('be.visible')
        .invoke('text')
        .should('eq', expectedName)
    })
  })

  it('should navigate to Trading Dashboard when clicking Trade button on tablet viewport', () => {
    cy.get(`#${TEST_IDS.landing.trade_btn}`).should('be.visible').click()

    cy.location('pathname').should('eq', ROUTES.trading_dashboard)
    cy.url().should('include', ROUTES.trading_dashboard)
  })

  it('should navigate to Inventory List when clicking Inventory button on tablet viewport', () => {
    cy.get(`#${TEST_IDS.landing.inventory_btn}`).should('be.visible').click()

    cy.location('pathname').should('eq', ROUTES.inventory_product_list)
    cy.url().should('include', ROUTES.inventory_product_list)
  })
})

describe('Landing Page - Desktop Interactions', () => {
  beforeEach(() => {
    cy.viewport(1920, 1080)
    cy.loginWithBypass()
    cy.visit(ROUTES.landing)
  })

  it('should display user greeting with correct name on desktop viewport', () => {
    cy.getSession().then((session) => {
      const fullName = session.user.user_metadata?.full_name
      const email = session.user.email

      const expectedName = fullName ? fullName.split(' ')[0] : email.split('@')[0]

      cy.get(`#${TEST_IDS.landing.full_name}`)
        .should('be.visible')
        .invoke('text')
        .should('eq', expectedName)
    })
  })

  it('should navigate to Trading Dashboard when clicking Trade button on desktop viewport', () => {
    cy.get(`#${TEST_IDS.landing.trade_btn}`).should('be.visible').click()

    cy.location('pathname').should('eq', ROUTES.trading_dashboard)
    cy.url().should('include', ROUTES.trading_dashboard)
  })

  it('should navigate to Inventory List when clicking Inventory button on desktop viewport', () => {
    cy.get(`#${TEST_IDS.landing.inventory_btn}`).should('be.visible').click()

    cy.location('pathname').should('eq', ROUTES.inventory_product_list)
    cy.url().should('include', ROUTES.inventory_product_list)
  })
})

describe('Landing Page - User Menu', () => {
  beforeEach(() => {
    cy.loginWithBypass()
    cy.setupApiAuthCookies()
    cy.visit(ROUTES.landing)
  })

  it('should display user menu trigger', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).should('be.visible')
  })

  it('should open user menu when trigger is clicked', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()

    cy.get(`#${TEST_IDS.auth.user_menu_email}`).should('be.visible')
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).should('be.visible')
  })

  it('should display correct user email in user menu', () => {
    cy.getSession().then((session) => {
      cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()

      cy.get(`#${TEST_IDS.auth.user_menu_email}`)
        .should('be.visible')
        .invoke('text')
        .should('eq', session.user.email)
    })
  })

  it('should logout via user menu sign out option', () => {
    cy.disableBypass()
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).should('be.visible').click()

    cy.getCookie('cypress-bypass').should('not.exist')
    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })
})

describe('Landing Page - User Menu - Mobile Interactions', () => {
  beforeEach(() => {
    cy.clearApiAuthCache()
    cy.viewport('iphone-x')
    cy.loginWithBypass()
    cy.setupApiAuthCookies()
    cy.visit(ROUTES.landing)
  })

  it('should display user menu trigger on mobile viewport', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).should('be.visible')
  })

  it('should open user menu when trigger is clicked on mobile viewport', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()

    cy.get(`#${TEST_IDS.auth.user_menu_email}`).should('be.visible')
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).should('be.visible')
  })

  it('should display correct user email in user menu on mobile viewport', () => {
    cy.getSession().then((session) => {
      cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()

      cy.get(`#${TEST_IDS.auth.user_menu_email}`)
        .should('be.visible')
        .invoke('text')
        .should('eq', session.user.email)
    })
  })

  it('should logout via user menu sign out option on mobile viewport', () => {
    cy.disableBypass()
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).should('be.visible').click()

    cy.getCookie('cypress-bypass').should('not.exist')
    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })
})

describe('Landing Page - User Menu - Tablet Interactions', () => {
  beforeEach(() => {
    cy.clearApiAuthCache()
    cy.viewport('ipad-2')
    cy.loginWithBypass()
    cy.setupApiAuthCookies()
    cy.visit(ROUTES.landing)
  })

  it('should display user menu trigger on tablet viewport', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).should('be.visible')
  })

  it('should open user menu when trigger is clicked on tablet viewport', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()

    cy.get(`#${TEST_IDS.auth.user_menu_email}`).should('be.visible')
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).should('be.visible')
  })

  it('should display correct user email in user menu on tablet viewport', () => {
    cy.getSession().then((session) => {
      cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()

      cy.get(`#${TEST_IDS.auth.user_menu_email}`)
        .should('be.visible')
        .invoke('text')
        .should('eq', session.user.email)
    })
  })

  it('should logout via user menu sign out option on tablet viewport', () => {
    cy.disableBypass()
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).should('be.visible').click()

    cy.getCookie('cypress-bypass').should('not.exist')
    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })
})

describe('Landing Page - User Menu - Desktop Interactions', () => {
  beforeEach(() => {
    cy.clearApiAuthCache()
    cy.viewport(1920, 1080)
    cy.loginWithBypass()
    cy.setupApiAuthCookies()
    cy.visit(ROUTES.landing)
  })

  it('should display user menu trigger on desktop viewport', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).should('be.visible')
  })

  it('should open user menu when trigger is clicked on desktop viewport', () => {
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()

    cy.get(`#${TEST_IDS.auth.user_menu_email}`).should('be.visible')
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).should('be.visible')
  })

  it('should display correct user email in user menu on desktop viewport', () => {
    cy.getSession().then((session) => {
      cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()

      cy.get(`#${TEST_IDS.auth.user_menu_email}`)
        .should('be.visible')
        .invoke('text')
        .should('eq', session.user.email)
    })
  })

  it('should logout via user menu sign out option on desktop viewport', () => {
    cy.disableBypass()
    cy.get(`#${TEST_IDS.auth.user_menu_trigger}`).click()
    cy.get(`#${TEST_IDS.auth.user_menu_signout}`).should('be.visible').click()

    cy.getCookie('cypress-bypass').should('not.exist')
    cy.url().should('include', ROUTES.login)
    cy.get(`#${TEST_IDS.auth.login_page}`).should('be.visible')
  })
})
