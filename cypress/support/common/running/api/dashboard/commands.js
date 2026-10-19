import constants from '../../../../../fixtures/app-constants.json'

const DASHBOARD = constants.endpoints.running_dashboard.dashboard
const WEEKLY_STATS = constants.endpoints.running_dashboard.weekly_stats
const CALENDAR = constants.endpoints.running_dashboard.calendar
const PERFORMANCE_TRENDS = constants.endpoints.running_dashboard.performance_trends

Cypress.Commands.add('getDashboard', (qs = {}) => {
  return cy.apiRequestWithSession('GET', DASHBOARD, { qs })
})

Cypress.Commands.add('getDashboardNoAuth', () => {
  return cy.apiRequestNoAuth('GET', DASHBOARD)
})

Cypress.Commands.add('getWeeklyStats', (qs = {}) => {
  return cy.apiRequestWithSession('GET', WEEKLY_STATS, { qs })
})

Cypress.Commands.add('getWeeklyStatsNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', WEEKLY_STATS, { qs, followRedirect: false })
})

Cypress.Commands.add('getCalendar', (qs = {}) => {
  return cy.apiRequestWithSession('GET', CALENDAR, { qs })
})

Cypress.Commands.add('getCalendarNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', CALENDAR, { qs })
})

Cypress.Commands.add('getPerformanceTrends', (qs = {}) => {
  return cy.apiRequestWithSession('GET', PERFORMANCE_TRENDS, { qs })
})

Cypress.Commands.add('getPerformanceTrendsNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', PERFORMANCE_TRENDS, { qs })
})
