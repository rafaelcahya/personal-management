Cypress.Commands.add('CreateProductStock', (request) => {
  return cy.apiRequestWithSession('POST', `/api/inventory/v1/product/stock/create`, {
    body: request,
  })
})

Cypress.Commands.add('CreateProductStockNoAuth', (request) => {
  return cy.apiRequestNoAuth('POST', `/api/inventory/v1/product/stock/create`, { body: request })
})

Cypress.Commands.add('UpdateProductStock', (entryId, request) => {
  return cy.apiRequestWithSession('PUT', `/api/inventory/v1/product/stock/${entryId}`, {
    body: request,
  })
})

Cypress.Commands.add('UpdateProductStockNoAuth', (entryId, request) => {
  return cy.apiRequestNoAuth('PUT', `/api/inventory/v1/product/stock/${entryId}`, { body: request })
})

Cypress.Commands.add('DeleteProductStock', (entryId) => {
  return cy.apiRequestWithSession('DELETE', `/api/inventory/v1/product/stock/${entryId}`)
})

Cypress.Commands.add('DeleteProductStockNoAuth', (entryId) => {
  return cy.apiRequestNoAuth('DELETE', `/api/inventory/v1/product/stock/${entryId}`)
})
