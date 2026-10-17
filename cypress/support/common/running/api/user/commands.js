import constants from '../../../../../fixtures/app-constants.json'

const PROFILE = constants.endpoints.running_user.profile
const SETTINGS = constants.endpoints.running_user.settings
const MAX_HR_DETECT = constants.endpoints.running_user.max_hr_detect
const PUSH_SUBSCRIPTION = constants.endpoints.running_user.push_subscription
const PUSH_SUBSCRIPTION_TEST = constants.endpoints.running_user.push_subscription_test

Cypress.Commands.add('getUserProfile', () => {
  return cy.apiRequestWithSession('GET', PROFILE)
})

Cypress.Commands.add('getUserProfileNoAuth', () => {
  return cy.apiRequestNoAuth('GET', PROFILE)
})

Cypress.Commands.add('patchUserProfile', (body) => {
  return cy.apiRequestWithSession('PATCH', PROFILE, { body })
})

Cypress.Commands.add('patchUserProfileNoAuth', (body) => {
  return cy.apiRequestNoAuth('PATCH', PROFILE, { body })
})

Cypress.Commands.add('getUserSettings', () => {
  return cy.apiRequestWithSession('GET', SETTINGS)
})

Cypress.Commands.add('getUserSettingsNoAuth', () => {
  return cy.apiRequestNoAuth('GET', SETTINGS)
})

Cypress.Commands.add('patchUserSettings', (body) => {
  return cy.apiRequestWithSession('PATCH', SETTINGS, { body })
})

Cypress.Commands.add('patchUserSettingsNoAuth', (body) => {
  return cy.apiRequestNoAuth('PATCH', SETTINGS, { body })
})

Cypress.Commands.add('postMaxHrDetect', (body) => {
  return cy.apiRequestWithSession('POST', MAX_HR_DETECT, { body })
})

Cypress.Commands.add('postMaxHrDetectNoAuth', () => {
  return cy.apiRequestNoAuth('POST', MAX_HR_DETECT)
})

Cypress.Commands.add('postPushSubscription', (body) => {
  return cy.apiRequestWithSession('POST', PUSH_SUBSCRIPTION, { body })
})

Cypress.Commands.add('postPushSubscriptionNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', PUSH_SUBSCRIPTION, { body })
})

Cypress.Commands.add('deletePushSubscription', (body) => {
  return cy.apiRequestWithSession('DELETE', PUSH_SUBSCRIPTION, { body })
})

Cypress.Commands.add('getPushStatus', () => {
  return cy.apiRequestWithSession('GET', PUSH_SUBSCRIPTION)
})

Cypress.Commands.add('getPushStatusNoAuth', () => {
  return cy.apiRequestNoAuth('GET', PUSH_SUBSCRIPTION)
})

Cypress.Commands.add('postPushTest', (body) => {
  return cy.apiRequestWithSession('POST', PUSH_SUBSCRIPTION_TEST, { body })
})

Cypress.Commands.add('postPushTestNoAuth', (body) => {
  return cy.apiRequestNoAuth('POST', PUSH_SUBSCRIPTION_TEST, { body })
})
