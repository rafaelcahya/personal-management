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
 * Get single fee from database
 */
Cypress.Commands.add("getSingleFeeFromDb", (feeId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getSingleFeeFromDb", { feeId, userId });
    });
});

/**
 * Get all fees from database
 */
Cypress.Commands.add("getFeesFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getFeesFromDb", userId);
    });
});

/**
 * Get total transactions count from database
 */
Cypress.Commands.add("getTotalFeesFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getTotalFeesFromDb", userId);
    });
});

/**
 * Get total fees paid from database
 */
Cypress.Commands.add("getTotalFeesPaidFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getTotalFeesPaidFromDb", userId);
    });
});
