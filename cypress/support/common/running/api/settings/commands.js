import constants from '../../../../../fixtures/app-constants.json'

const { running_manual, running_strava, running_user } = constants.endpoints
const SUBJECTIVE = running_manual.subjective_health
const WEIGHT = running_manual.weight_log

const healthBase = (kind) => (kind === 'weight' ? WEIGHT : SUBJECTIVE)

// Health (kind: 'subjective' | 'weight')
Cypress.Commands.add('getHealthLogs', (kind, qs = {}) => {
  return cy.apiRequestWithSession('GET', healthBase(kind), { qs })
})

Cypress.Commands.add('getHealthLogsNoAuth', (kind, qs = {}) => {
  return cy.apiRequestNoAuth('GET', healthBase(kind), { qs })
})

Cypress.Commands.add('postHealthLog', (kind, body) => {
  return cy.apiRequestWithSession('POST', healthBase(kind), { body })
})

Cypress.Commands.add('postHealthLogNoAuth', (kind, body) => {
  return cy.apiRequestNoAuth('POST', healthBase(kind), { body })
})

Cypress.Commands.add('patchHealthLog', (kind, id, body) => {
  return cy.apiRequestWithSession('PATCH', `${healthBase(kind)}/${id}`, { body })
})

Cypress.Commands.add('patchHealthLogNoAuth', (kind, id, body) => {
  return cy.apiRequestNoAuth('PATCH', `${healthBase(kind)}/${id}`, { body })
})

Cypress.Commands.add('deleteHealthLog', (kind, id) => {
  return cy.apiRequestWithSession('DELETE', `${healthBase(kind)}/${id}`)
})

Cypress.Commands.add('deleteHealthLogNoAuth', (kind, id) => {
  return cy.apiRequestNoAuth('DELETE', `${healthBase(kind)}/${id}`)
})

// Strava (never reaches the real Strava API: connect only redirects, the rest run against the stub)
Cypress.Commands.add('getStravaConnect', () => {
  return cy.apiRequestWithSession('GET', running_strava.connect, { followRedirect: false })
})

Cypress.Commands.add('getStravaConnectNoAuth', () => {
  return cy.apiRequestNoAuth('GET', running_strava.connect, { followRedirect: false })
})

Cypress.Commands.add('getStravaCallbackNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', running_strava.callback, { qs, followRedirect: false })
})

Cypress.Commands.add('postStravaDisconnect', () => {
  return cy.apiRequestWithSession('POST', running_strava.disconnect)
})

Cypress.Commands.add('postStravaDisconnectNoAuth', () => {
  return cy.apiRequestNoAuth('POST', running_strava.disconnect)
})

Cypress.Commands.add('postStravaAuthSync', () => {
  return cy.apiRequestWithSession('POST', running_strava.sync)
})

Cypress.Commands.add('postStravaAuthSyncNoAuth', () => {
  return cy.apiRequestNoAuth('POST', running_strava.sync)
})

Cypress.Commands.add('postStravaReEnrich', () => {
  return cy.apiRequestWithSession('POST', running_strava.re_enrich)
})

Cypress.Commands.add('postStravaReEnrichNoAuth', () => {
  return cy.apiRequestNoAuth('POST', running_strava.re_enrich)
})

// HR zones, threshold pace, activities
Cypress.Commands.add('getHrZones', () => {
  return cy.apiRequestWithSession('GET', running_user.hr_zones)
})

Cypress.Commands.add('getHrZonesNoAuth', () => {
  return cy.apiRequestNoAuth('GET', running_user.hr_zones)
})

Cypress.Commands.add('patchHrZones', (body) => {
  return cy.apiRequestWithSession('PATCH', running_user.hr_zones, { body })
})

Cypress.Commands.add('patchHrZonesNoAuth', (body) => {
  return cy.apiRequestNoAuth('PATCH', running_user.hr_zones, { body })
})

Cypress.Commands.add('getThresholdPaceDetect', () => {
  return cy.apiRequestWithSession('GET', running_user.threshold_pace_detect)
})

Cypress.Commands.add('getThresholdPaceDetectNoAuth', () => {
  return cy.apiRequestNoAuth('GET', running_user.threshold_pace_detect)
})

Cypress.Commands.add('deleteAllUserActivities', (body) => {
  return cy.apiRequestWithSession('DELETE', running_user.activities, { body })
})

Cypress.Commands.add('deleteAllUserActivitiesNoAuth', (body) => {
  return cy.apiRequestNoAuth('DELETE', running_user.activities, { body })
})
