import constants from '../../../../fixtures/app-constants.json'

const LIST_BASE = constants.endpoints.currency_investments.list
const CREATE_BASE = constants.endpoints.currency_investments.create
const DELETE_BASE = constants.endpoints.currency_investments.delete
const HOLDINGS_BASE = constants.endpoints.currency_investments.holdings
const RATES_BASE = constants.endpoints.forex.rates
const HISTORY_BASE = constants.endpoints.forex.history
const CURRENCIES_BASE = constants.endpoints.forex.currencies

// ─── currency investments ─────────────────────────────────────────────────────

Cypress.Commands.add('getCurrencyInvestments', (qs = {}) => {
  return cy.apiRequestWithSession('GET', LIST_BASE, { qs })
})

Cypress.Commands.add('getCurrencyInvestmentsNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', LIST_BASE, { qs })
})

Cypress.Commands.add('createCurrencyInvestment', (body = {}) => {
  return cy.apiRequestWithSession('POST', CREATE_BASE, { body })
})

Cypress.Commands.add('createCurrencyInvestmentNoAuth', (body = {}) => {
  return cy.apiRequestNoAuth('POST', CREATE_BASE, { body })
})

Cypress.Commands.add('deleteCurrencyInvestment', (id) => {
  return cy.apiRequestWithSession('DELETE', `${DELETE_BASE}/${id}`)
})

Cypress.Commands.add('deleteCurrencyInvestmentNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', `${DELETE_BASE}/${id}`)
})

// ─── currency holdings ────────────────────────────────────────────────────────

Cypress.Commands.add('getCurrencyHoldings', () => {
  return cy.apiRequestWithSession('GET', HOLDINGS_BASE)
})

Cypress.Commands.add('getCurrencyHoldingsNoAuth', () => {
  return cy.apiRequestNoAuth('GET', HOLDINGS_BASE)
})

Cypress.Commands.add('getCurrencyHoldingById', (id) => {
  return cy.apiRequestWithSession('GET', `${HOLDINGS_BASE}/${id}`)
})

Cypress.Commands.add('getCurrencyHoldingByIdNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `${HOLDINGS_BASE}/${id}`)
})

// ─── forex rates ──────────────────────────────────────────────────────────────

Cypress.Commands.add('getForexRates', (qs = {}) => {
  return cy.apiRequestWithSession('GET', RATES_BASE, { qs })
})

Cypress.Commands.add('getForexRatesNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', RATES_BASE, { qs })
})

// ─── forex history ────────────────────────────────────────────────────────────

Cypress.Commands.add('getForexHistory', (qs = {}) => {
  return cy.apiRequestWithSession('GET', HISTORY_BASE, { qs })
})

Cypress.Commands.add('getForexHistoryNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', HISTORY_BASE, { qs })
})

// ─── forex currencies ─────────────────────────────────────────────────────────

Cypress.Commands.add('getForexCurrencies', () => {
  return cy.apiRequestWithSession('GET', CURRENCIES_BASE)
})

Cypress.Commands.add('getForexCurrenciesNoAuth', () => {
  return cy.apiRequestNoAuth('GET', CURRENCIES_BASE)
})
