Cypress.Commands.add('getLatestProductQuantityFromDb', (productListId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getLatestProductQuantityFromDb', {
      productListId,
      userId,
    })
  })
})

Cypress.Commands.add('getProductQuantityByIdFromDb', (entryId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getProductQuantityByIdFromDb', {
      entryId,
      userId,
    })
  })
})

Cypress.Commands.add('getProductQuantityCountFromDb', (productListId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getProductQuantityCountFromDb', {
      productListId,
      userId,
    })
  })
})

Cypress.Commands.add('getProductQuantityListFromDb', (productListId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getProductQuantityListFromDb', {
      productListId,
      userId,
    })
  })
})
