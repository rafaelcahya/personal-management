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

Cypress.Commands.add("getSingleProductBrandFromDb", (productBrandId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getSingleProductBrandFromDb", {
            productBrandId,
            userId,
        });
    });
});

Cypress.Commands.add("getTotalProductBrandsFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getTotalProductBrandsFromDb", { userId });
    });
});