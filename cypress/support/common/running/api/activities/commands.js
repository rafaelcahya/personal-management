import constants from '../../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.running_manual.activities
const STREAMS_BASE = constants.endpoints.running_activity_streams.get

Cypress.Commands.add('getActivities', (qs = {}) => {
  return cy.apiRequestWithSession('GET', BASE, { qs })
})

Cypress.Commands.add('getActivitiesNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', BASE, { qs })
})

Cypress.Commands.add('getActivityDetail', (id) => {
  return cy.apiRequestWithSession('GET', `${BASE}/${id}`)
})

Cypress.Commands.add('getActivityDetailNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', `${BASE}/${id}`)
})

Cypress.Commands.add('patchActivity', (id, body) => {
  return cy.apiRequestWithSession('PATCH', `${BASE}/${id}`, { body })
})

Cypress.Commands.add('patchActivityNoAuth', (id, body) => {
  return cy.apiRequestNoAuth('PATCH', `${BASE}/${id}`, { body })
})

Cypress.Commands.add('getActivityStreams', (id, qs = {}) => {
  return cy.apiRequestWithSession('GET', `${STREAMS_BASE}/${id}/streams`, { qs })
})

Cypress.Commands.add('getActivityStreamsNoAuth', (id, qs = {}) => {
  return cy.apiRequestNoAuth('GET', `${STREAMS_BASE}/${id}/streams`, { qs })
})

Cypress.Commands.add('postActivity', (body = {}) => {
  return cy.apiRequestWithSession('POST', BASE, { body })
})

Cypress.Commands.add('postActivityNoAuth', (body = {}) => {
  return cy.apiRequestNoAuth('POST', BASE, { body })
})

Cypress.Commands.add('deleteActivity', (id) => {
  return cy.apiRequestWithSession('DELETE', `${BASE}/${id}`)
})

Cypress.Commands.add('deleteActivityNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', `${BASE}/${id}`)
})

Cypress.Commands.add('getActivityTypes', () => {
  return cy.apiRequestWithSession('GET', `${BASE}/types`)
})

Cypress.Commands.add('getActivityTypesNoAuth', () => {
  return cy.apiRequestNoAuth('GET', `${BASE}/types`)
})
