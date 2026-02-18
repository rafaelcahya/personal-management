Cypress.Commands.add("GetSingleTrade", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/trade/v1/trade/list/${id}`,
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
            url: "/api/trade/v1/trade/create",
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
            url: `/api/trade/v1/trade/delete/${id}`,
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
            url: `/api/trade/v1/trade/update/${id}`,
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("GetTradeSummary", () => {
    return cy.apiRequestWithSession("GET", "/api/trade/v1/trade/summary");
});

Cypress.Commands.add("GetTradeSummaryNoAuth", () => {
    return cy.apiRequestNoAuth("GET", "/api/trade/v1/trade/summary");
});

Cypress.Commands.add("GetSingleTrade", (id) => {
    return cy.apiRequestWithSession("GET", `/api/trade/v1/trade/${id}`);
});

Cypress.Commands.add("GetSingleTradeNoAuth", (id) => {
    return cy.apiRequestNoAuth("GET", `/api/trade/v1/trade/${id}`);
});

Cypress.Commands.add("AddTrade", (request) => {
    return cy.apiRequestWithSession("POST", "/api/trade/v1/trade/create", {
        body: request,
    });
});

Cypress.Commands.add("AddTradeNoAuth", (request) => {
    return cy.apiRequestNoAuth("POST", "/api/trade/v1/trade/create", {
        body: request,
    });
});
