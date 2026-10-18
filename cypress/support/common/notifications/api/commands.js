import constants from '../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.notifications.list
const UNREAD_COUNT = constants.endpoints.notifications.unread_count
const READ = constants.endpoints.notifications.read
const READ_ALL = constants.endpoints.notifications.read_all
const PUSH_DEVICES = constants.endpoints.notifications.push_subscriptions
const PUSH_TEST = constants.endpoints.notifications.push_subscriptions_test
const PREFERENCES = constants.endpoints.notifications.preferences

Cypress.Commands.add('getNotifications', (qs = {}) => {
  return cy.apiRequestWithSession('GET', BASE, { qs })
})

Cypress.Commands.add('getNotificationsNoAuth', (qs = {}) => {
  return cy.apiRequestNoAuth('GET', BASE, { qs })
})

Cypress.Commands.add('getUnreadNotificationCount', () => {
  return cy.apiRequestWithSession('GET', UNREAD_COUNT)
})

Cypress.Commands.add('getUnreadNotificationCountNoAuth', () => {
  return cy.apiRequestNoAuth('GET', UNREAD_COUNT)
})

Cypress.Commands.add('putNotificationRead', (body) => {
  return cy.apiRequestWithSession('PUT', READ, { body })
})

Cypress.Commands.add('putNotificationReadNoAuth', (body) => {
  return cy.apiRequestNoAuth('PUT', READ, { body })
})

Cypress.Commands.add('putAllNotificationsRead', () => {
  return cy.apiRequestWithSession('PUT', READ_ALL)
})

Cypress.Commands.add('putAllNotificationsReadNoAuth', () => {
  return cy.apiRequestNoAuth('PUT', READ_ALL)
})

// ─── push devices + preferences ───────────────────────────────────────────────

Cypress.Commands.add('getPushStatus', () => cy.apiRequestWithSession('GET', PUSH_DEVICES))
Cypress.Commands.add('getPushStatusNoAuth', () => cy.apiRequestNoAuth('GET', PUSH_DEVICES))

Cypress.Commands.add('postPushDevice', (body) =>
  cy.apiRequestWithSession('POST', PUSH_DEVICES, { body })
)
Cypress.Commands.add('postPushDeviceNoAuth', (body) =>
  cy.apiRequestNoAuth('POST', PUSH_DEVICES, { body })
)

Cypress.Commands.add('deletePushDevice', (id) =>
  cy.apiRequestWithSession('DELETE', `${PUSH_DEVICES}/${id}`)
)
Cypress.Commands.add('deletePushDeviceNoAuth', (id) =>
  cy.apiRequestNoAuth('DELETE', `${PUSH_DEVICES}/${id}`)
)

Cypress.Commands.add('postPushTest', (body) =>
  cy.apiRequestWithSession('POST', PUSH_TEST, { body })
)
Cypress.Commands.add('postPushTestNoAuth', (body) =>
  cy.apiRequestNoAuth('POST', PUSH_TEST, { body })
)

Cypress.Commands.add('getNotificationPreferences', () =>
  cy.apiRequestWithSession('GET', PREFERENCES)
)
Cypress.Commands.add('getNotificationPreferencesNoAuth', () =>
  cy.apiRequestNoAuth('GET', PREFERENCES)
)

Cypress.Commands.add('patchNotificationPreference', (body) =>
  cy.apiRequestWithSession('PATCH', PREFERENCES, { body })
)
Cypress.Commands.add('patchNotificationPreferenceNoAuth', (body) =>
  cy.apiRequestNoAuth('PATCH', PREFERENCES, { body })
)
