Cypress.Commands.add('getLatestProductQuantityFromDb', (productListId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getLatestProductQuantityFromDb', {
      productListId,
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

Cypress.Commands.add('getProductQuantityHistoryFromDb', (productListId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getProductQuantityHistoryFromDb', {
      productListId,
      userId,
    })
  })
})

Cypress.Commands.add('getLastPurchasePriceFromDb', (productListId) => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getLastPurchasePriceFromDb', { productListId, userId })
  })
})

Cypress.Commands.add('getActiveProductsWithHistoryFromDb', () => {
  return cy.getTestUserId().then((userId) => {
    return cy.task('getActiveProductsWithHistoryFromDb', { userId })
  })
})
