Cypress.Commands.add("GetSingleProduct", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/inventory/product/list/${id}`,
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
            url: "/api/inventory/product/create",
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
            url: `/api/inventory/product/delete/${id}`,
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
            url: `/api/inventory/product/update/${id}`,
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
            url: "/api/inventory/product/summary",
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});