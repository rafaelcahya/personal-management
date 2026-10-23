Cypress.Commands.add('seedStravaCredentialsInDb', (needsReconnect) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('seedStravaCredentialsInDb', { userId, needsReconnect })
  })
})

Cypress.Commands.add('deleteSeededStravaCredentialsInDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('deleteSeededStravaCredentialsInDb', { userId })
  })
})

Cypress.Commands.add('getStravaCredentialsFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getStravaCredentialsFromDb', { userId })
  })
})

Cypress.Commands.add('getHealthLogFromDb', (kind, id) => {
  return cy.task('getHealthLogFromDb', { kind, id })
})

Cypress.Commands.add('deleteSeededHealthLogsInDb', () => {
  return cy.task('deleteSeededHealthLogsInDb')
})
