import constants from '../../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.investment_flow.list
const MOVE_BASE = constants.endpoints.investment_flow.move
const UNINVESTED_CASH_BASE = constants.endpoints.investment_flow.uninvested_cash
const CASH_CATEGORIES_BASE = constants.endpoints.investment_flow.uninvested_cash_categories

// ─── list ─────────────────────────────────────────────────────────────────────

Cypress.Commands.add('listInvestmentFlowNodes', () => {
  return cy.apiRequestWithSession('GET', BASE)
})

Cypress.Commands.add('listInvestmentFlowNodesNoAuth', () => {
  return cy.apiRequestNoAuth('GET', BASE)
})

// ─── create ───────────────────────────────────────────────────────────────────

Cypress.Commands.add('createInvestmentFlowNode', (body = {}) => {
  return cy.apiRequestWithSession('POST', BASE, { body })
})

Cypress.Commands.add('createInvestmentFlowNodeNoAuth', (body = {}) => {
  return cy.apiRequestNoAuth('POST', BASE, { body })
})

// ─── update ───────────────────────────────────────────────────────────────────

Cypress.Commands.add('updateInvestmentFlowNode', (body = {}) => {
  return cy.apiRequestWithSession('PUT', BASE, { body })
})

Cypress.Commands.add('updateInvestmentFlowNodeNoAuth', (body = {}) => {
  return cy.apiRequestNoAuth('PUT', BASE, { body })
})

// ─── delete ───────────────────────────────────────────────────────────────────

Cypress.Commands.add('deleteInvestmentFlowNode', (id) => {
  return cy.apiRequestWithSession('DELETE', BASE, { qs: { id } })
})

Cypress.Commands.add('deleteInvestmentFlowNodeNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', BASE, { qs: { id } })
})

// ─── move ─────────────────────────────────────────────────────────────────────

Cypress.Commands.add('moveInvestmentFlowNode', (body = {}) => {
  return cy.apiRequestWithSession('PUT', MOVE_BASE, { body })
})

Cypress.Commands.add('moveInvestmentFlowNodeNoAuth', (body = {}) => {
  return cy.apiRequestNoAuth('PUT', MOVE_BASE, { body })
})

// ─── uninvested cash ──────────────────────────────────────────────────────────

Cypress.Commands.add('getUninvestedCash', () => {
  return cy.apiRequestWithSession('GET', UNINVESTED_CASH_BASE)
})

Cypress.Commands.add('getUninvestedCashNoAuth', () => {
  return cy.apiRequestNoAuth('GET', UNINVESTED_CASH_BASE)
})

Cypress.Commands.add('patchUninvestedCash', (body = {}) => {
  return cy.apiRequestWithSession('PATCH', UNINVESTED_CASH_BASE, { body })
})

Cypress.Commands.add('patchUninvestedCashNoAuth', (body = {}) => {
  return cy.apiRequestNoAuth('PATCH', UNINVESTED_CASH_BASE, { body })
})

// ─── uninvested cash categories ───────────────────────────────────────────────

Cypress.Commands.add('listUninvestedCashCategories', () => {
  return cy.apiRequestWithSession('GET', CASH_CATEGORIES_BASE)
})

Cypress.Commands.add('listUninvestedCashCategoriesNoAuth', () => {
  return cy.apiRequestNoAuth('GET', CASH_CATEGORIES_BASE)
})

Cypress.Commands.add('createUninvestedCashCategory', (body = {}) => {
  return cy.apiRequestWithSession('POST', CASH_CATEGORIES_BASE, { body })
})

Cypress.Commands.add('createUninvestedCashCategoryNoAuth', (body = {}) => {
  return cy.apiRequestNoAuth('POST', CASH_CATEGORIES_BASE, { body })
})

Cypress.Commands.add('updateUninvestedCashCategory', (id, body = {}) => {
  return cy.apiRequestWithSession('PUT', `${CASH_CATEGORIES_BASE}/${id}`, { body })
})

Cypress.Commands.add('updateUninvestedCashCategoryNoAuth', (id, body = {}) => {
  return cy.apiRequestNoAuth('PUT', `${CASH_CATEGORIES_BASE}/${id}`, { body })
})

Cypress.Commands.add('deleteUninvestedCashCategory', (id) => {
  return cy.apiRequestWithSession('DELETE', `${CASH_CATEGORIES_BASE}/${id}`)
})

Cypress.Commands.add('deleteUninvestedCashCategoryNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', `${CASH_CATEGORIES_BASE}/${id}`)
})
