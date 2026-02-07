Cypress.Commands.add("GetSingleProduct", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/inventory/v1/product/list/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});

Cypress.Commands.add("AddNewProduct", (request) => {
    return cy
        .request({
            method: "POST",
            url: "/api/inventory/v1/product/create",
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("DeleteProduct", (id) => {
    return cy
        .request({
            method: "DELETE",
            url: `/api/inventory/v1/product/delete/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("UpdateProduct", (id, request) => {
    return cy
        .request({
            method: "PUT",
            url: `/api/inventory/v1/product/update/${id}`,
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("GetProductSummary", () => {
    return cy
        .request({
            method: "GET",
            url: "/api/inventory/v1/product/summary",
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});
