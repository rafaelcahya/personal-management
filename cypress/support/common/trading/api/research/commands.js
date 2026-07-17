import constants from '../../../../../fixtures/app-constants.json'

const OVERVIEW = constants.endpoints.trading_research.overview
const TECHNICALS = constants.endpoints.trading_research.technicals
const CORPORATE_EVENTS = constants.endpoints.trading_research.corporate_events
const SYMBOL_SEARCH = constants.endpoints.trading_research.symbol_search

Cypress.Commands.add('getResearchOverview', (qs = {}) => {
  return cy.apiRequestWithSession('GET', OVERVIEW, { qs, failOnStatusCode: false })
})

Cypress.Commands.add('getResearchOverviewNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', OVERVIEW, { qs, failOnStatusCode: false })
})

Cypress.Commands.add('getResearchTechnicals', (qs = {}) => {
  return cy.apiRequestWithSession('GET', TECHNICALS, { qs, failOnStatusCode: false })
})

Cypress.Commands.add('getResearchTechnicalsNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', TECHNICALS, { qs, failOnStatusCode: false })
})

Cypress.Commands.add('getResearchCorporateEvents', (qs = {}) => {
  return cy.apiRequestWithSession('GET', CORPORATE_EVENTS, { qs, failOnStatusCode: false })
})

Cypress.Commands.add('getResearchCorporateEventsNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', CORPORATE_EVENTS, { qs, failOnStatusCode: false })
})

Cypress.Commands.add('getResearchSymbolSearch', (qs = {}) => {
  return cy.apiRequestWithSession('GET', SYMBOL_SEARCH, { qs, failOnStatusCode: false })
})

Cypress.Commands.add('getResearchSymbolSearchNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', SYMBOL_SEARCH, { qs, failOnStatusCode: false })
})
