Cypress.Commands.add("GetSingleEvent", (id) => {
    return cy
        .request({
            method: "GET",
            url: `/api/trade/event/list/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return response.body.data;
        });
});

Cypress.Commands.add("AddNewEvent", (request) => {
    return cy
        .request({
            method: "POST",
            url: "/api/trade/event/create",
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("DeleteEvent", (id) => {
    return cy
        .request({
            method: "DELETE",
            url: `/api/trade/event/delete/${id}`,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});

Cypress.Commands.add("UpdateEvent", (id, request) => {
    return cy
        .request({
            method: "PUT",
            url: `/api/trade/event/update/${id}`,
            body: request,
            failOnStatusCode: false,
        })
        .then((response) => {
            return cy.wrap(response);
        });
});
