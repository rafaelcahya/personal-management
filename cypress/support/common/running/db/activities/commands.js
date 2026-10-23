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

const DASHBOARD_SEED_TAG = 'cy843'

Cypress.Commands.add('seedTaggedActivitiesInDb', (rows) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('seedTaggedActivitiesInDb', { userId, tag: DASHBOARD_SEED_TAG, rows })
  })
})

Cypress.Commands.add('deleteSeededDashboardActivitiesFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('deleteSeededAnalyticsActivitiesFromDb', { userId, tag: DASHBOARD_SEED_TAG })
  })
})

const STREAMS_SEED_TAG = 'cy844'

// One activity of 20+ minutes with heart rate and per-second streams (1 Hz), for the streams
// endpoint and the lazy derived-metric compute. Delete it with deleteActivityWithStreamsFromDb.
Cypress.Commands.add('seedActivityWithStreamsInDb', (rowCount = 1800) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('seedActivityWithStreamsInDb', { userId, tag: STREAMS_SEED_TAG, rowCount })
  })
})

Cypress.Commands.add('deleteActivityWithStreamsFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('deleteActivityWithStreamsFromDb', { userId, tag: STREAMS_SEED_TAG })
  })
})
