import constants from '../../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.running_upcoming_races.list

Cypress.Commands.add('getUpcomingRaces', (qs = {}) => {
  return cy.apiRequestWithSession('GET', BASE, { qs })
})

Cypress.Commands.add('getUpcomingRacesNoAuth', () => {
  return cy.apiRequestNoAuth('GET', BASE)
})

Cypress.Commands.add('getUpcomingRaceDetail', (id) => {
  return cy.apiRequestWithSession('GET', `${BASE}/${id}`)
})

Cypress.Commands.add('getUpcomingRaceDetailNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `${BASE}/${id}`)
})

Cypress.Commands.add('postUpcomingRace', (body) => {
  return cy.apiRequestWithSession('POST', BASE, { body })
})

Cypress.Commands.add('postUpcomingRaceNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', BASE, { body })
})

Cypress.Commands.add('patchUpcomingRace', (id, body) => {
  return cy.apiRequestWithSession('PATCH', `${BASE}/${id}`, { body })
})

Cypress.Commands.add('patchUpcomingRaceNoAuth', (id, body) => {
  return cy.apiRequestNoAuth('PATCH', `${BASE}/${id}`, { body })
})

Cypress.Commands.add('deleteUpcomingRace', (id) => {
  return cy.apiRequestWithSession('DELETE', `${BASE}/${id}`)
})

Cypress.Commands.add('deleteUpcomingRaceNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', `${BASE}/${id}`)
})
