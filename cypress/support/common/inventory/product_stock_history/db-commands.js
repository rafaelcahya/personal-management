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

Cypress.Commands.add("getLatestProductQuantityFromDb", (productListId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getLatestProductQuantityFromDb", {
            productListId,
            userId,
        });
    });
});

Cypress.Commands.add("getProductQuantityCountFromDb", (productListId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getProductQuantityCountFromDb", {
            productListId,
            userId,
        });
    });
});

Cypress.Commands.add("getProductQuantityListFromDb", (productListId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getProductQuantityListFromDb", {
            productListId,
            userId,
        });
    });
});

Cypress.Commands.add("getProductQuantityHistoryFromDb", (productListId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getProductQuantityHistoryFromDb", {
            productListId,
            userId,
        });
    });
});