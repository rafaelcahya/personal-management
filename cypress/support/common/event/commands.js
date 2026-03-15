Cypress.Commands.add("GetSingleEventUnauthenticated", (id) => {
    return cy.request({
        method: "GET",
        url: `/api/trade/v1/event/list/${id}`,
        failOnStatusCode: false,
    });
});

Cypress.Commands.add("AddNewEventUnauthenticated", (request) => {
    return cy.request({
        method: "POST",
        url: "/api/trade/v1/event/create",
        body: request,
        failOnStatusCode: false,
    });
});

Cypress.Commands.add("DeleteEventUnauthenticated", (id) => {
    return cy.request({
        method: "DELETE",
        url: `/api/trade/v1/event/delete/${id}`,
        failOnStatusCode: false,
    });
});

Cypress.Commands.add("UpdateEventUnauthenticated", (id, request) => {
    return cy.request({
        method: "PUT",
        url: `/api/trade/v1/event/update/${id}`,
        body: request,
        failOnStatusCode: false,
    });
});

Cypress.Commands.add("FavoriteEventUnauthenticated", (id, request) => {
    return cy.request({
        method: "PATCH",
        url: `/api/trade/v1/event/favorite/${id}`,
        body: request,
        failOnStatusCode: false,
    });
});

Cypress.Commands.add("GetRandomEventId", () => {
    cy.env(["authToken"]).then(({ authToken }) => {
        return cy
            .request({
                method: "GET",
                url: "/api/trade/v1/event/list",
                headers: {
                    Authorization: `Bearer ${authToken}`,
                },
                failOnStatusCode: false,
            })
            .then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body.events).to.be.an("array").and.not.be.empty;

                const events = response.body.events;
                const randomEvent =
                    events[Math.floor(Math.random() * events.length)];

                return randomEvent.id;
            });
    });
});
