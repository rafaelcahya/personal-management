Cypress.Commands.add('getSingleProductNameFromDb', (productNameId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getSingleProductNameFromDb', {
      productNameId,
      userId,
    })
  })
})

Cypress.Commands.add('getTotalProductNamesFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getTotalProductNamesFromDb', { userId })
  })
})
