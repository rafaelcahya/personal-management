Cypress.Commands.add("getTestUserId", () => {
    cy.env(["TEST_EMAIL", "TEST_PASSWORD"]).then(
        ({ TEST_EMAIL, TEST_PASSWORD }) => {
            return cy
                .task("getSupabaseSession", {
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD,
                })
                .then((session) => {
                    if (!session) {
                        throw new Error("Failed to get test user session");
                    }
                    return session.user.id;
                });
        },
    );
});

Cypress.Commands.add("getSingleEventFromDb", (eventId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getSingleEventFromDb", { eventId, userId });
    });
});

Cypress.Commands.add("getEventsFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getEventsFromDb", userId);
    });
});

Cypress.Commands.add("getEventSummaryFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getEventSummaryFromDb", { userId });
    });
});
