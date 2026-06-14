import constants from '../../../../../fixtures/app-constants.json'

const SYNC_STRAVA = constants.endpoints.running_sync.sync_strava
const SYNC_STATUS = constants.endpoints.running_sync.sync_status
const STRAVA_STATUS = constants.endpoints.running_sync.strava_status

Cypress.Commands.add('postSyncStrava', (body = {}) => {
  return cy.apiRequestWithSession('POST', SYNC_STRAVA, { body })
})

Cypress.Commands.add('postSyncStravaNoAuth', () => {
  return cy.apiRequestNoAuth('POST', SYNC_STRAVA)
})

Cypress.Commands.add('getSyncStatus', () => {
  return cy.apiRequestWithSession('GET', SYNC_STATUS)
})

Cypress.Commands.add('getSyncStatusNoAuth', () => {
  return cy.apiRequestNoAuth('GET', SYNC_STATUS)
})

Cypress.Commands.add('getStravaStatus', () => {
  return cy.apiRequestWithSession('GET', STRAVA_STATUS)
})

Cypress.Commands.add('getStravaStatusNoAuth', () => {
  return cy.apiRequestNoAuth('GET', STRAVA_STATUS)
})
