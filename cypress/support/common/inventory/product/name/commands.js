Cypress.Commands.add("GetSingleProductName", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/inventory/product/name/list/${id}`,
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
            url: "/api/inventory/product/name/create",
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
            url: `/api/inventory/product/name/delete/${id}`,
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
            url: `/api/inventory/product/name/update/${id}`,
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});
