/**
 * Get single fee from database
 */
Cypress.Commands.add('getSingleFeeFromDb', (feeId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getSingleFeeFromDb', { feeId, userId })
  })
})

/**
 * Get all fees from database
 */
Cypress.Commands.add('getFeesFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getFeesFromDb', userId)
  })
})

/**
 * Get total transactions count from database
 */
Cypress.Commands.add('getTotalFeesFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getTotalFeesFromDb', { userId })
  })
})

/**
 * Get total fees paid from database
 */
Cypress.Commands.add('getTotalFeesPaidFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    cy.log(`userId type: ${typeof userId}, value: ${JSON.stringify(userId)}`)
    return cy.task('getTotalFeesPaidFromDb', { userId })
  })
})
