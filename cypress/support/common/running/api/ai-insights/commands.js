import constants from '../../../../../fixtures/app-constants.json'

const LIST = constants.endpoints.running_ai_insights.list
const GENERATE = constants.endpoints.running_ai_insights.generate
const DAILY = constants.endpoints.running_analytics_ai.daily
const FOLLOWUP = constants.endpoints.running_analytics_ai.followup
const STALENESS = constants.endpoints.running_analytics_ai.staleness
const ACK_BASE = constants.endpoints.running_analytics_ai.acknowledge.replace('/:id/ack', '')

Cypress.Commands.add('getAiInsights', (qs = {}) => {
  return cy.apiRequestWithSession('GET', LIST, { qs })
})

Cypress.Commands.add('getAiInsightsNoAuth', () => {
  return cy.apiRequestNoAuth('GET', LIST)
})

Cypress.Commands.add('postAiInsightsGenerate', (body) => {
  return cy.apiRequestWithSession('POST', GENERATE, { body })
})

Cypress.Commands.add('postAiInsightsGenerateNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', GENERATE, { body })
})

Cypress.Commands.add('getAiInsightsDaily', () => {
  return cy.apiRequestWithSession('GET', DAILY)
})

Cypress.Commands.add('postAiInsightsFollowup', (body) => {
  return cy.apiRequestWithSession('POST', FOLLOWUP, { body })
})

Cypress.Commands.add('getAiInsightsStaleness', () => {
  return cy.apiRequestWithSession('GET', STALENESS)
})

Cypress.Commands.add('patchAiInsightAck', (id) => {
  return cy.apiRequestWithSession('PATCH', `${ACK_BASE}/${id}/ack`)
})

Cypress.Commands.add('patchAiInsightAckNoAuth', (id) => {
  return cy.apiRequestNoAuth('PATCH', `${ACK_BASE}/${id}/ack`)
})
