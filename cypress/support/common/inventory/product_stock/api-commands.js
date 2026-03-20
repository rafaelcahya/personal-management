Cypress.Commands.add("CreateProductStock", (request) => {
    return cy.apiRequestWithSession(
        "POST",
        `/api/inventory/v1/product/stock/create`,
        { body: request },
    );
});

Cypress.Commands.add("CreateProductStockNoAuth", (request) => {
    return cy.apiRequestNoAuth(
        "POST",
        `/api/inventory/v1/product/stock/create`,
        { body: request },
    );
});
