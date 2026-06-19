import constants from '../../../../fixtures/app-constants.json'

const DASHBOARD = constants.endpoints.inventory.dashboard
const BUDGET = constants.endpoints.inventory.budget

// ─── dashboard ───────────────────────────────────────────────────────────────

Cypress.Commands.add('getInventoryDashboard', () => {
  return cy.apiRequestWithSession('GET', DASHBOARD)
})

Cypress.Commands.add('getInventoryDashboardNoAuth', () => {
  return cy.apiRequestNoAuth('GET', DASHBOARD)
})

// ─── budget ──────────────────────────────────────────────────────────────────

Cypress.Commands.add('getInventoryBudget', () => {
  return cy.apiRequestWithSession('GET', BUDGET)
})

Cypress.Commands.add('getInventoryBudgetNoAuth', () => {
  return cy.apiRequestNoAuth('GET', BUDGET)
})

Cypress.Commands.add('postInventoryBudget', (body) => {
  return cy.apiRequestWithSession('POST', BUDGET, { body })
})

Cypress.Commands.add('postInventoryBudgetNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', BUDGET, { body })
})
