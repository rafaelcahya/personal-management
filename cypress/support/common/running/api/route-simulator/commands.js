import constants from '../../../../../fixtures/app-constants.json'

const SIM = constants.endpoints.running_route_simulations
const withId = (path, id) => path.replace(':id', id)

Cypress.Commands.add('getRouteSimulations', (qs = {}) => {
  return cy.apiRequestWithSession('GET', SIM.list, { qs })
})
Cypress.Commands.add('getRouteSimulationsNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', SIM.list, { qs })
})

// headers lets a test send a raw string body with a JSON content type (malformed JSON cases).
Cypress.Commands.add('postRouteSimulation', (body, headers) => {
  return cy.apiRequestWithSession('POST', SIM.create, { body, headers })
})
Cypress.Commands.add('postRouteSimulationNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', SIM.create, { body })
})

Cypress.Commands.add('previewRouteSimulation', (body, headers) => {
  return cy.apiRequestWithSession('POST', SIM.preview, { body, headers })
})
Cypress.Commands.add('previewRouteSimulationNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', SIM.preview, { body })
})

Cypress.Commands.add('getRouteSimulation', (id) => {
  return cy.apiRequestWithSession('GET', withId(SIM.detail, id))
})
Cypress.Commands.add('getRouteSimulationNoAuth', (id) => {
  return cy.apiRequestNoAuth('GET', withId(SIM.detail, id))
})

Cypress.Commands.add('patchRouteSimulation', (id, body, headers) => {
  return cy.apiRequestWithSession('PATCH', withId(SIM.detail, id), { body, headers })
})
Cypress.Commands.add('patchRouteSimulationNoAuth', (id, body) => {
  return cy.apiRequestNoAuth('PATCH', withId(SIM.detail, id), { body })
})

Cypress.Commands.add('deleteRouteSimulation', (id) => {
  return cy.apiRequestWithSession('DELETE', withId(SIM.detail, id))
})
Cypress.Commands.add('deleteRouteSimulationNoAuth', (id) => {
  return cy.apiRequestNoAuth('DELETE', withId(SIM.detail, id))
})

// Only used for the free paths (401, 404, 400). The 200 path calls Claude and is never sent.
Cypress.Commands.add('postRouteSimulationStrategy', (id, body, headers) => {
  return cy.apiRequestWithSession('POST', withId(SIM.ai_strategy, id), { body, headers })
})
Cypress.Commands.add('postRouteSimulationStrategyNoAuth', (id, body) => {
  return cy.apiRequestNoAuth('POST', withId(SIM.ai_strategy, id), { body })
})
