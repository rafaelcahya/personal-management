import constants from '../../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.investment_flow.list
const MOVE_BASE = constants.endpoints.investment_flow.move

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
