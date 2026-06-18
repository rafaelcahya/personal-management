Cypress.Commands.add('getAiInsightFromDb', (insightId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getAiInsightFromDb', { insightId, userId })
  })
})

Cypress.Commands.add('getLatestAiInsightByTypeFromDb', (insightType) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getLatestAiInsightByTypeFromDb', { insightType, userId })
  })
})

Cypress.Commands.add('getUnacknowledgedInsightIdFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getUnacknowledgedInsightIdFromDb', { userId })
  })
})
