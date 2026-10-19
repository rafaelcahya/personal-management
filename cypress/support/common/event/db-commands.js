Cypress.Commands.add('getSingleEventFromDb', (eventId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getSingleEventFromDb', { eventId, userId })
  })
})

Cypress.Commands.add('getEventsFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getEventsFromDb', userId)
  })
})

Cypress.Commands.add('getEventSummaryFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getEventSummaryFromDb', { userId })
  })
})
