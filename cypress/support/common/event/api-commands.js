Cypress.Commands.add("GetEventDetail", (id) => {
    return cy.apiRequestWithSession("GET", `/api/trade/v1/event/${id}`);
});

Cypress.Commands.add("GetEventDetailNoAuth", (id) => {
    return cy.apiRequestNoAuth("GET", `/api/trade/v1/event/${id}`);
});

Cypress.Commands.add("GetEventSummary", () => {
    return cy.apiRequestWithSession("GET", "/api/trade/v1/event/summary");
});

Cypress.Commands.add("GetEventSummaryNoAuth", () => {
    return cy.apiRequestNoAuth("GET", "/api/trade/v1/event/summary");
});

Cypress.Commands.add("GetSingleEvent", (id) => {
    return cy.apiRequestWithSession("GET", `/api/trade/v1/event/${id}`);
});

Cypress.Commands.add("GetSingleEventNoAuth", (id) => {
    return cy.apiRequestNoAuth("GET", `/api/trade/v1/event/${id}`);
});

Cypress.Commands.add("GetListEvent", () => {
    return cy.apiRequestWithSession("GET", `/api/trade/v1/event/list`);
});

Cypress.Commands.add("GetListEventNoAuth", () => {
    return cy.apiRequestNoAuth("GET", `/api/trade/v1/event/list`);
});

Cypress.Commands.add("AddEvent", (request) => {
    return cy.apiRequestWithSession("POST", "/api/trade/v1/event/create", {
        body: request,
    });
});

Cypress.Commands.add("AddEventNoAuth", (request) => {
    return cy.apiRequestNoAuth("POST", "/api/trade/v1/event/create", {
        body: request,
    });
});

Cypress.Commands.add("DeleteEvent", (id) => {
    return cy.apiRequestWithSession(
        "DELETE",
        `/api/trade/v1/event/delete/${id}`,
    );
});

Cypress.Commands.add("DeleteEventNoAuth", (id) => {
    return cy.apiRequestNoAuth("DELETE", `/api/trade/v1/event/delete/${id}`);
});

Cypress.Commands.add("UpdateEvent", (id, request) => {
    return cy.apiRequestWithSession("PUT", `/api/trade/v1/event/update/${id}`, {
        body: request,
    });
});

Cypress.Commands.add("UpdateEventNoAuth", (id, request) => {
    return cy.apiRequestNoAuth("PUT", `/api/trade/v1/event/update/${id}`, {
        body: request,
    });
});

Cypress.Commands.add("FavoriteEvent", (id, request) => {
    return cy.apiRequestWithSession(
        "PATCH",
        `/api/trade/v1/event/favorite/${id}`,
        {
            body: request,
        },
    );
});

Cypress.Commands.add("FavoriteEventNoAuth", (id, request) => {
    return cy.apiRequestNoAuth("PATCH", `/api/trade/v1/event/favorite/${id}`, {
        body: request,
    });
});

