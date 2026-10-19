Cypress.Commands.add('getSingleTradeFromDb', (tradeId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getSingleTradeFromDb', { tradeId, userId })
  })
})

Cypress.Commands.add('getTradesFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getTradesFromDb', { userId })
  })
})

Cypress.Commands.add('getTotalTradesFromDb', (userId) => {
  return cy.task('getTotalTradesFromDb', { userId })
})

Cypress.Commands.add('getTotalWinsFromDb', (userId) => {
  return cy.task('getTotalWinsFromDb', { userId })
})

Cypress.Commands.add('getTotalLossesFromDb', (userId) => {
  return cy.task('getTotalLossesFromDb', { userId })
})

Cypress.Commands.add('getStockTypeSummaryFromDb', (userId) => {
  return cy.task('getStockTypeSummaryFromDb', { userId })
})

Cypress.Commands.add('getEntrySessionSummaryFromDb', (userId) => {
  return cy.task('getEntrySessionSummaryFromDb', { userId })
})

Cypress.Commands.add('getEntryOccasionSummaryFromDb', (userId) => {
  return cy.task('getEntryOccasionSummaryFromDb', { userId })
})

Cypress.Commands.add('getTradeSettingsFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getTradeSettingsFromDb', { userId })
  })
})
