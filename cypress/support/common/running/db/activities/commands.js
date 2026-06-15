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
