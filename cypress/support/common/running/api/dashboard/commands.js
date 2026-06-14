import constants from '../../../../../fixtures/app-constants.json'

const DASHBOARD = constants.endpoints.running_dashboard.dashboard
const PERFORMANCE_TRENDS = '/api/running/v1/performance-trends'

Cypress.Commands.add('getDashboard', () => {
  return cy.apiRequestWithSession('GET', DASHBOARD)
})

Cypress.Commands.add('getDashboardNoAuth', () => {
  return cy.apiRequestNoAuth('GET', DASHBOARD)
})

Cypress.Commands.add('getPerformanceTrends', (qs = {}) => {
  return cy.apiRequestWithSession('GET', PERFORMANCE_TRENDS, { qs })
})

Cypress.Commands.add('getPerformanceTrendsNoAuth', () => {
  return cy.apiRequestNoAuth('GET', PERFORMANCE_TRENDS)
})
