// Covers: Sidebar nav tooltips — collapsed state (#8)
//
// AUTH STRATEGY:
//   - Uses cy.setupApiAuthCookies() for a real Supabase session.
//   - Stubs inventory dashboard API so page content doesn't interfere.
//   - Sidebar collapsed state is set via localStorage before page load.
//
// NOTE: Tooltip triggering uses native PointerEvent dispatch because
// CDP-based realHover() does not reliably fire Radix UI's onPointerMove
// handler in Cypress Electron headless mode. Dispatching a PointerEvent
// directly on the DOM node triggers React's synthetic event delegation.

import constants from '../../fixtures/app-constants.json'

const IDS = constants.test_ids.sidebar
const VISIT_URL = constants.routes.inventory

const stubInventoryApi = () => {
  cy.intercept('GET', '/api/inventory/v1/dashboard*', {
    statusCode: 200,
    body: { success: true, data: {} },
  }).as('getInventoryDashboard')
}

const hoverTriggerTooltip = (selector) => {
  cy.get(selector).then(($el) => {
    $el[0].dispatchEvent(
      new PointerEvent('pointermove', {
        bubbles: true,
        cancelable: true,
        pointerType: 'mouse',
        pointerId: 1,
        isPrimary: true,
      })
    )
  })
  cy.wait(50)
}

// ---------------------------------------------------------------------------
// A. Auth guard
// ---------------------------------------------------------------------------

describe('Sidebar — Auth guard', () => {
  it('unauthenticated visit redirects to /login', () => {
    cy.clearAllCookies()
    cy.clearAllLocalStorage()
    cy.visit(VISIT_URL, { failOnStatusCode: false })
    cy.url().should('include', '/login')
  })
})

// ---------------------------------------------------------------------------
// B. Collapsed sidebar — tooltips appear on hover
// ---------------------------------------------------------------------------

describe('Sidebar — Collapsed: tooltips visible on hover', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubInventoryApi()
    cy.viewport(1280, 900)
    cy.visit(VISIT_URL, {
      onBeforeLoad(win) {
        win.localStorage.setItem('sidebar-collapsed', 'true')
      },
    })
    // Wait for React useEffect to apply collapsed state
    cy.get(`#${IDS.collapse_btn}`).should('have.attr', 'title', 'Expand sidebar')
  })

  it('shows "Inventory Dashboard" tooltip when hovering Inventory Dashboard nav', () => {
    hoverTriggerTooltip(`#${IDS.inventory_dashboard_nav}`)
    cy.get('[data-slot="tooltip-content"]')
      .should('exist')
      .and('contain.text', 'Inventory Dashboard')
  })

  it('shows "Running Dashboard" tooltip when hovering Running Dashboard nav', () => {
    hoverTriggerTooltip(`#${IDS.running_dashboard_nav}`)
    cy.get('[data-slot="tooltip-content"]').should('exist').and('contain.text', 'Running Dashboard')
  })

  it('shows item name as tooltip for a nav item without a custom tooltip', () => {
    hoverTriggerTooltip('a[href="/main/running/activities"]')
    cy.get('[data-slot="tooltip-content"]').should('exist').and('contain.text', 'Activities')
  })
})

// ---------------------------------------------------------------------------
// C. Expanded sidebar — no tooltips on hover
// ---------------------------------------------------------------------------

describe('Sidebar — Expanded: no tooltips on hover', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubInventoryApi()
    cy.viewport(1280, 900)
    cy.visit(VISIT_URL, {
      onBeforeLoad(win) {
        win.localStorage.setItem('sidebar-collapsed', 'false')
      },
    })
    // Wait for React useEffect to apply expanded state
    cy.get(`#${IDS.collapse_btn}`).should('have.attr', 'title', 'Collapse sidebar')
  })

  it('does not show a tooltip when hovering Inventory Dashboard nav in expanded state', () => {
    hoverTriggerTooltip(`#${IDS.inventory_dashboard_nav}`)
    cy.get('[data-slot="tooltip-content"]').should('not.exist')
  })

  it('does not show a tooltip when hovering Running Dashboard nav in expanded state', () => {
    hoverTriggerTooltip(`#${IDS.running_dashboard_nav}`)
    cy.get('[data-slot="tooltip-content"]').should('not.exist')
  })
})

// ---------------------------------------------------------------------------
// D. Collapse toggle — sidebar collapses and expands
// ---------------------------------------------------------------------------

describe('Sidebar — Collapse toggle', () => {
  beforeEach(() => {
    cy.setupApiAuthCookies()
    stubInventoryApi()
    cy.viewport(1280, 900)
  })

  it('collapse button hides nav labels (collapses sidebar)', () => {
    cy.visit(VISIT_URL, {
      onBeforeLoad(win) {
        win.localStorage.setItem('sidebar-collapsed', 'false')
      },
    })
    // Wait for expanded state, then collapse
    cy.get(`#${IDS.collapse_btn}`).should('have.attr', 'title', 'Collapse sidebar')
    cy.get('aside').first().contains('span', 'Dashboard').should('be.visible')
    cy.get(`#${IDS.collapse_btn}`).click()
    cy.get('aside').first().contains('span', 'Dashboard').should('not.exist')
  })

  it('expand button shows nav labels (expands sidebar)', () => {
    cy.visit(VISIT_URL, {
      onBeforeLoad(win) {
        win.localStorage.setItem('sidebar-collapsed', 'true')
      },
    })
    // Wait for collapsed state before clicking expand
    cy.get(`#${IDS.collapse_btn}`).should('have.attr', 'title', 'Expand sidebar')
    cy.get(`#${IDS.collapse_btn}`).click()
    cy.get('aside').first().contains('span', 'Dashboard').should('be.visible')
  })
})
