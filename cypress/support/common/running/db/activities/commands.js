Cypress.Commands.add('getActivityListFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getActivityListFromDb', { userId })
  })
})

Cypress.Commands.add('getSingleActivityFromDb', (activityId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getSingleActivityFromDb', { activityId, userId })
  })
})

Cypress.Commands.add('getActivityCountFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getActivityCountFromDb', { userId })
  })
})

Cypress.Commands.add('getActivityIdWithSplitsFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getActivityIdWithSplitsFromDb', { userId })
  })
})

const ANALYTICS_SEED_TAG = 'cy842'

Cypress.Commands.add('seedAnalyticsActivitiesInDb', (count) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('seedAnalyticsActivitiesInDb', { userId, tag: ANALYTICS_SEED_TAG, count })
  })
})

Cypress.Commands.add('deleteSeededAnalyticsActivitiesFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('deleteSeededAnalyticsActivitiesFromDb', { userId, tag: ANALYTICS_SEED_TAG })
  })
})

Cypress.Commands.add('getSeededAnalyticsActivitiesFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getSeededAnalyticsActivitiesFromDb', { userId, tag: ANALYTICS_SEED_TAG })
  })
})
