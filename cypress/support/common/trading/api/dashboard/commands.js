import constants from '../../../../../fixtures/app-constants.json'

const METRICS = constants.endpoints.trading_dashboard.metrics
const QUICK_VIEW = constants.endpoints.trading_dashboard.quick_view
const DAILY_PNL = constants.endpoints.trading_dashboard.daily_pnl

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

Cypress.Commands.add('GetTradingDashboardDailyPnl', (qs = {}) => {
  return cy.apiRequestWithSession('GET', DAILY_PNL, { qs })
})

Cypress.Commands.add('GetTradingDashboardDailyPnlNoAuth', () => {
  return cy.apiRequestNoAuth('GET', DAILY_PNL)
})
