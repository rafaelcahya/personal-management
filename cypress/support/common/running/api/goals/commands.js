import constants from '../../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.running_goals.update

Cypress.Commands.add('patchGoal', (id, body) => {
  return cy.apiRequestWithSession('PATCH', `${BASE}/${id}`, { body })
})

Cypress.Commands.add('patchGoalNoAuth', (id, body) => {
  return cy.apiRequestNoAuth('PATCH', `${BASE}/${id}`, { body })
})
