Cypress.Commands.add("GetSingleFee", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/trade/fee/list/${id}`,
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
            url: "/api/trade/fee/create",
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
            url: `/api/trade/fee/delete/${id}`,
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
            url: `/api/trade/fee/update/${id}`,
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
            url: "/api/trade/fee/summary",
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});
