import constants from '../../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.running_gear.list

Cypress.Commands.add('getGear', () => {
  return cy.apiRequestWithSession('GET', BASE)
})

Cypress.Commands.add('getGearNoAuth', () => {
  return cy.apiRequestNoAuth('GET', BASE)
})

Cypress.Commands.add('patchGear', (body) => {
  return cy.apiRequestWithSession('PATCH', BASE, { body })
})

Cypress.Commands.add('patchGearNoAuth', (body) => {
  return cy.apiRequestNoAuth('PATCH', BASE, { body })
})
