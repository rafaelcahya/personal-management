import constants from '../../../../../fixtures/app-constants.json'

const TARGET_EFFORT = constants.endpoints.running_analytics.target_effort
const PERSONAL_BESTS = constants.endpoints.running_analytics.personal_bests
const CALORIE_TREND = constants.endpoints.running_analytics.calorie_trend
const FITNESS_AGE = constants.endpoints.running_analytics.fitness_age

Cypress.Commands.add('getTargetEffort', (qs = {}) => {
  return cy.apiRequestWithSession('GET', TARGET_EFFORT, { qs })
})

Cypress.Commands.add('getTargetEffortNoAuth', () => {
  return cy.apiRequestNoAuth('GET', TARGET_EFFORT)
})

Cypress.Commands.add('getPersonalBests', (qs = {}) => {
  return cy.apiRequestWithSession('GET', PERSONAL_BESTS, { qs })
})

Cypress.Commands.add('getPersonalBestsNoAuth', () => {
  return cy.apiRequestNoAuth('GET', PERSONAL_BESTS)
})

Cypress.Commands.add('getCalorieTrend', (qs = {}) => {
  return cy.apiRequestWithSession('GET', CALORIE_TREND, { qs })
})

Cypress.Commands.add('getCalorieTrendNoAuth', () => {
  return cy.apiRequestNoAuth('GET', CALORIE_TREND)
})

Cypress.Commands.add('getFitnessAgeTrend', () => {
  return cy.apiRequestWithSession('GET', FITNESS_AGE)
})

Cypress.Commands.add('getFitnessAgeTrendNoAuth', () => {
  return cy.apiRequestNoAuth('GET', FITNESS_AGE)
})
