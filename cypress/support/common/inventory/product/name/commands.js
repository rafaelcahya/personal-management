Cypress.Commands.add("GetSingleProductName", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/inventory/v1/product-name/list/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});

Cypress.Commands.add("AddNewProductName", (request) => {
    return cy
        .request({
            method: "POST",
            url: "/api/inventory/v1/product-name/create",
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("DeleteProductName", (id) => {
    return cy
        .request({
            method: "DELETE",
            url: `/api/inventory/v1/product-name/delete/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("UpdateProductName", (id, request) => {
    return cy
        .request({
            method: "PUT",
            url: `/api/inventory/v1/product-name/update/${id}`,
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("GetProductNameSummary", () => {
    return cy
        .request({
            method: "GET",
            url: "/api/inventory/v1/product-name/summary",
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});
