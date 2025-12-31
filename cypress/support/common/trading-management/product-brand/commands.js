Cypress.Commands.add("GetSingleProductBrand", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/inventory/brand/list/${id}`,
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
            url: "/api/inventory/brand/create",
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
            url: `/api/inventory/brand/delete/${id}`,
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
            url: `/api/inventory/brand/update/${id}`,
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});