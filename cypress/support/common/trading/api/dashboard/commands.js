import constants from '../../../../../fixtures/app-constants.json'

const METRICS = constants.endpoints.trading_dashboard.metrics
const QUICK_VIEW = constants.endpoints.trading_dashboard.quick_view

Cypress.Commands.add('GetTradingDashboardMetrics', () => {
  return cy.apiRequestWithSession('GET', METRICS)
})

Cypress.Commands.add('GetTradingDashboardMetricsNoAuth', () => {
  return cy.apiRequestNoAuth('GET', METRICS)
})

Cypress.Commands.add('GetTradingDashboardQuickView', (qs = {}) => {
  return cy.apiRequestWithSession('GET', QUICK_VIEW, { qs })
})

Cypress.Commands.add('GetTradingDashboardQuickViewNoAuth', () => {
  return cy.apiRequestNoAuth('GET', QUICK_VIEW)
})
