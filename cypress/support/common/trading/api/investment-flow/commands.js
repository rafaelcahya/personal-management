import constants from '../../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.investment_flow.list
const MOVE_BASE = constants.endpoints.investment_flow.move
const UNINVESTED_CASH_BASE = constants.endpoints.investment_flow.uninvested_cash

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
