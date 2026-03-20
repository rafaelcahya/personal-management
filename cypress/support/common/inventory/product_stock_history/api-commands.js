Cypress.Commands.add("GetProductStockHistory", (id) => {
    return cy.apiRequestWithSession(
        "GET",
        `/api/inventory/v1/product/stock/history/${id}`,
    );
});

Cypress.Commands.add("GetProductStockHistoryNoAuth", (id) => {
    return cy.apiRequestNoAuth(
        "GET",
        `/api/inventory/v1/product/stock/history/${id}`,
    );
});
