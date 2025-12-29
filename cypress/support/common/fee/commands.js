Cypress.Commands.add("GetSingleFee", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/fee/list/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});

Cypress.Commands.add("AddNewFee", (request) => {
    return cy
        .request({
            method: "POST",
            url: "/api/fee/create",
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("DeleteFee", (id) => {
    return cy
        .request({
            method: "DELETE",
            url: `/api/fee/delete/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("UpdateFee", (id, request) => {
    return cy
        .request({
            method: "PUT",
            url: `/api/fee/update/${id}`,
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("GetFeeSummary", () => {
    return cy
        .request({
            method: "GET",
            url: "/api/fee/summary",
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});
