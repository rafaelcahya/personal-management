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

Cypress.Commands.add("getSingleProductNameFromDb", (productNameId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getSingleProductNameFromDb", {
            productNameId,
            userId,
        });
    });
});

Cypress.Commands.add("getTotalProductNamesFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getTotalProductNamesFromDb", { userId });
    });
});