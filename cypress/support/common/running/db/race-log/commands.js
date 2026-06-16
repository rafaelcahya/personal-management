Cypress.Commands.add('getRaceLogListFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getRaceLogListFromDb', { userId })
  })
})

Cypress.Commands.add('getSingleRaceLogFromDb', (raceLogId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getSingleRaceLogFromDb', { raceLogId, userId })
  })
})

Cypress.Commands.add('getRaceLogCountFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getRaceLogCountFromDb', { userId })
  })
})

Cypress.Commands.add('getSingleRaceLogIncludeDeletedFromDb', (raceLogId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getSingleRaceLogIncludeDeletedFromDb', { raceLogId, userId })
  })
})
