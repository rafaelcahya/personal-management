Cypress.Commands.add("GetSingleProductBrand", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/inventory/v1/product-brand/list/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});

Cypress.Commands.add("AddNewProductBrand", (request) => {
    return cy
        .request({
            method: "POST",
            url: "/api/inventory/v1/product-brand/create",
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("DeleteProductBrand", (id) => {
    return cy
        .request({
            method: "DELETE",
            url: `/api/inventory/v1/product-brand/delete/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("UpdateProductBrand", (id, request) => {
    return cy
        .request({
            method: "PUT",
            url: `/api/inventory/v1/product-brand/update/${id}`,
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("GetProductBrandSummary", () => {
    return cy
        .request({
            method: "GET",
            url: "/api/inventory/v1/product-brand/summary",
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});
