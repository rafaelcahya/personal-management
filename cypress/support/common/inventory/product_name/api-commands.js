Cypress.Commands.add("GetProductNameDetail", (id) => {
    return cy.apiRequestWithSession(
        "GET",
        `/api/inventory/v1/product-name/${id}`,
    );
});

Cypress.Commands.add("GetProductNameDetailNoAuth", (id) => {
    return cy.apiRequestNoAuth("GET", `/api/inventory/v1/product-name/${id}`);
});

Cypress.Commands.add("GetProductNameSummary", () => {
    return cy.apiRequestWithSession(
        "GET",
        "/api/inventory/v1/product-name/summary",
    );
});

Cypress.Commands.add("GetProductNameSummaryNoAuth", () => {
    return cy.apiRequestNoAuth(
        "GET",
        "/api/inventory/v1/product-name/summary",
    );
});

Cypress.Commands.add("GetSingleProductName", (id) => {
    return cy.apiRequestWithSession(
        "GET",
        `/api/inventory/v1/product-name/${id}`,
    );
});

Cypress.Commands.add("GetSingleProductNameNoAuth", (id) => {
    return cy.apiRequestNoAuth("GET", `/api/inventory/v1/product-name/${id}`);
});

Cypress.Commands.add("GetListProductName", () => {
    return cy.apiRequestWithSession(
        "GET",
        `/api/inventory/v1/product-name/list`,
    );
});

Cypress.Commands.add("GetListProductNameNoAuth", () => {
    return cy.apiRequestNoAuth("GET", `/api/inventory/v1/product-name/list`);
});

Cypress.Commands.add("AddProductName", (request) => {
    return cy.apiRequestWithSession(
        "POST",
        "/api/inventory/v1/product-name/create",
        {
            body: request,
        },
    );
});

Cypress.Commands.add("AddProductNameNoAuth", (request) => {
    return cy.apiRequestNoAuth(
        "POST",
        "/api/inventory/v1/product-name/create",
        {
            body: request,
        },
    );
});

Cypress.Commands.add("DeleteProductName", (id) => {
    return cy.apiRequestWithSession(
        "DELETE",
        `/api/inventory/v1/product-name/delete/${id}`,
    );
});

Cypress.Commands.add("DeleteProductNameNoAuth", (id) => {
    return cy.apiRequestNoAuth(
        "DELETE",
        `/api/inventory/v1/product-name/delete/${id}`,
    );
});

Cypress.Commands.add("UpdateProductName", (id, request) => {
    return cy.apiRequestWithSession(
        "PUT",
        `/api/inventory/v1/product-name/update/${id}`,
        {
            body: request,
        },
    );
});

Cypress.Commands.add("UpdateProductNameNoAuth", (id, request) => {
    return cy.apiRequestNoAuth(
        "PUT",
        `/api/inventory/v1/product-name/update/${id}`,
        {
            body: request,
        },
    );
});