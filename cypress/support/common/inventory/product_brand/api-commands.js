Cypress.Commands.add("GetProductBrandDetail", (id) => {
    return cy.apiRequestWithSession(
        "GET",
        `/api/inventory/v1/product-brand/${id}`,
    );
});

Cypress.Commands.add("GetProductBrandDetailNoAuth", (id) => {
    return cy.apiRequestNoAuth("GET", `/api/inventory/v1/product-brand/${id}`);
});

Cypress.Commands.add("GetProductBrandSummary", () => {
    return cy.apiRequestWithSession(
        "GET",
        "/api/inventory/v1/product-brand/summary",
    );
});

Cypress.Commands.add("GetProductBrandSummaryNoAuth", () => {
    return cy.apiRequestNoAuth(
        "GET",
        "/api/inventory/v1/product-brand/summary",
    );
});

Cypress.Commands.add("GetSingleProductBrand", (id) => {
    return cy.apiRequestWithSession(
        "GET",
        `/api/inventory/v1/product-brand/${id}`,
    );
});

Cypress.Commands.add("GetSingleProductBrandNoAuth", (id) => {
    return cy.apiRequestNoAuth("GET", `/api/inventory/v1/product-brand/${id}`);
});

Cypress.Commands.add("GetListProductBrand", () => {
    return cy.apiRequestWithSession(
        "GET",
        `/api/inventory/v1/product-brand/list`,
    );
});

Cypress.Commands.add("GetListProductBrandNoAuth", () => {
    return cy.apiRequestNoAuth("GET", `/api/inventory/v1/product-brand/list`);
});

Cypress.Commands.add("AddProductBrand", (request) => {
    return cy.apiRequestWithSession(
        "POST",
        "/api/inventory/v1/product-brand/create",
        {
            body: request,
        },
    );
});

Cypress.Commands.add("AddProductBrandNoAuth", (request) => {
    return cy.apiRequestNoAuth(
        "POST",
        "/api/inventory/v1/product-brand/create",
        {
            body: request,
        },
    );
});

Cypress.Commands.add("DeleteProductBrand", (id) => {
    return cy.apiRequestWithSession(
        "DELETE",
        `/api/inventory/v1/product-brand/delete/${id}`,
    );
});

Cypress.Commands.add("DeleteProductBrandNoAuth", (id) => {
    return cy.apiRequestNoAuth(
        "DELETE",
        `/api/inventory/v1/product-brand/delete/${id}`,
    );
});

Cypress.Commands.add("UpdateProductBrand", (id, request) => {
    return cy.apiRequestWithSession(
        "PUT",
        `/api/inventory/v1/product-brand/update/${id}`,
        {
            body: request,
        },
    );
});

Cypress.Commands.add("UpdateProductBrandNoAuth", (id, request) => {
    return cy.apiRequestNoAuth(
        "PUT",
        `/api/inventory/v1/product-brand/update/${id}`,
        {
            body: request,
        },
    );
});