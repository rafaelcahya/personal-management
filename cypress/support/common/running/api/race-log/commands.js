import constants from '../../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.running_race_log.list

Cypress.Commands.add('getRaceLog', (qs = {}) => {
  return cy.apiRequestWithSession('GET', BASE, { qs })
})

Cypress.Commands.add('getRaceLogNoAuth', () => {
  return cy.apiRequestNoAuth('GET', BASE)
})

Cypress.Commands.add('getRaceLogDetail', (id) => {
  return cy.apiRequestWithSession('GET', `${BASE}/${id}`)
})

Cypress.Commands.add('getRaceLogDetailNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `${BASE}/${id}`)
})

Cypress.Commands.add('postRaceLog', (body) => {
  return cy.apiRequestWithSession('POST', BASE, { body })
})

Cypress.Commands.add('postRaceLogNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', BASE, { body })
})

Cypress.Commands.add('patchRaceLog', (id, body) => {
  return cy.apiRequestWithSession('PATCH', `${BASE}/${id}`, { body })
})

Cypress.Commands.add('patchRaceLogNoAuth', (id, body) => {
  return cy.apiRequestNoAuth('PATCH', `${BASE}/${id}`, { body })
})

Cypress.Commands.add('deleteRaceLog', (id) => {
  return cy.apiRequestWithSession('DELETE', `${BASE}/${id}`)
})

Cypress.Commands.add('deleteRaceLogNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', `${BASE}/${id}`)
})
