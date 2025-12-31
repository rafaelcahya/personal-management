Cypress.Commands.add("GetSingleTrade", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/trade/trade/list/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});

Cypress.Commands.add("AddNewTrade", (request) => {
    return cy
        .request({
            method: "POST",
            url: "/api/trade/trade/create",
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("DeleteTrade", (id) => {
    return cy
        .request({
            method: "DELETE",
            url: `/api/trade/trade/delete/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("UpdateTrade", (id, request) => {
    return cy
        .request({
            method: "PUT",
            url: `/api/trade/trade/update/${id}`,
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("GetTradeSummary", () => {
    return cy
        .request({
            method: "GET",
            url: "/api/trade/trade/summary",
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});
