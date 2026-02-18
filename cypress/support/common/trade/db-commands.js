/**
 * Get test user ID from session
 */
Cypress.Commands.add("getTestUserId", () => {
    const email = Cypress.env("TEST_EMAIL");
    const password = Cypress.env("TEST_PASSWORD");

    return cy
        .task("getSupabaseSession", { email, password })
        .then((session) => {
            if (!session) {
                throw new Error("Failed to get test user session");
            }
            return session.user.id;
        });
});
/**
 * Get single trade from database
 */
Cypress.Commands.add("getSingleTradeFromDb", (tradeId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getSingleTradeFromDb", { tradeId, userId });
    });
});

/**
 * Get all trades from database
 */
Cypress.Commands.add("getTradesFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getTradesFromDb", userId);
    });
});

/**
 * Get total trades count from database
 */
Cypress.Commands.add("getTotalTradesFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getTotalTradesFromDb", userId);
    });
});

/**
 * Get total wins from database
 */
Cypress.Commands.add("getTotalWinsFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getTotalWinsFromDb", userId);
    });
});

/**
 * Get total losses from database
 */
Cypress.Commands.add("getTotalLossesFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getTotalLossesFromDb", userId);
    });
});

/**
 * Get stock type summary from database
 */
Cypress.Commands.add("getStockTypeSummaryFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getStockTypeSummaryFromDb", userId);
    });
});

/**
 * Get entry session summary from database
 */
Cypress.Commands.add("getEntrySessionSummaryFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getEntrySessionSummaryFromDb", userId);
    });
});

/**
 * Get entry occasion summary from database
 */
Cypress.Commands.add("getEntryOccasionSummaryFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getEntryOccasionSummaryFromDb", userId);
    });
});
