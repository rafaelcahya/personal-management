import constants from '../../../../../fixtures/app-constants.json'

const SYMPTOMS = constants.endpoints.running_ai.symptoms
const INJURY_COACH = constants.endpoints.running_ai.injury_coach
const INJURY_COACH_HISTORY = constants.endpoints.running_ai.injury_coach_history

Cypress.Commands.add('getSymptoms', () => {
  return cy.apiRequestWithSession('GET', SYMPTOMS)
})

Cypress.Commands.add('getSymptomsNoAuth', () => {
  return cy.apiRequestNoAuth('GET', SYMPTOMS)
})

Cypress.Commands.add('postSymptoms', (body) => {
  return cy.apiRequestWithSession('POST', SYMPTOMS, { body })
})

Cypress.Commands.add('postSymptomsNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', SYMPTOMS, { body })
})

Cypress.Commands.add('getSymptomById', (id) => {
  return cy.apiRequestWithSession('GET', `${SYMPTOMS}/${id}`)
})

Cypress.Commands.add('getSymptomByIdNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `${SYMPTOMS}/${id}`)
})

Cypress.Commands.add('deleteSymptom', (id) => {
  return cy.apiRequestWithSession('DELETE', `${SYMPTOMS}/${id}`)
})

Cypress.Commands.add('deleteSymptomNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', `${SYMPTOMS}/${id}`)
})

Cypress.Commands.add('postInjuryCoach', (body) => {
  return cy.apiRequestWithSession('POST', INJURY_COACH, { body })
})

Cypress.Commands.add('postInjuryCoachNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', INJURY_COACH, { body })
})

Cypress.Commands.add('getInjuryCoachHistory', () => {
  return cy.apiRequestWithSession('GET', INJURY_COACH_HISTORY)
})

Cypress.Commands.add('getInjuryCoachHistoryNoAuth', () => {
  return cy.apiRequestNoAuth('GET', INJURY_COACH_HISTORY)
})
