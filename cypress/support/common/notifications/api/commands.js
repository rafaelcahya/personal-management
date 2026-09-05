import constants from '../../../../fixtures/app-constants.json'

const BASE = constants.endpoints.notifications.list
const UNREAD_COUNT = constants.endpoints.notifications.unread_count
const READ = constants.endpoints.notifications.read
const READ_ALL = constants.endpoints.notifications.read_all

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
