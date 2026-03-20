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

Cypress.Commands.add("getProductListFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getProductListFromDb", { userId });
    });
});

Cypress.Commands.add("getSingleProductFromDb", (productId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getSingleProductFromDb", { productId, userId });
    });
});

Cypress.Commands.add("getTotalProductsFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getTotalProductsFromDb", { userId });
    });
});

Cypress.Commands.add("getProductSummaryFromDb", () => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getProductSummaryFromDb", { userId });
    });
});

Cypress.Commands.add("getSingleProductIncludeDeletedFromDb", (productId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getSingleProductIncludeDeletedFromDb", {
            productId,
            userId,
        });
    });
});

Cypress.Commands.add("setProductQuantityInDb", (productId, quantity) => {
    return cy.task("setProductQuantityInDb", { productId, quantity });
});

Cypress.Commands.add("getProductWithQuantityFromDb", (productId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getProductWithQuantityFromDb", { productId, userId });
    });
});

Cypress.Commands.add("getLatestProductHistoryFromDb", (productId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getLatestProductHistoryFromDb", { productId, userId });
    });
});

Cypress.Commands.add("getProductFavoriteStatusFromDb", (productId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getProductFavoriteStatusFromDb", { productId, userId });
    });
});

Cypress.Commands.add("getProductHistoryCountFromDb", (productId) => {
    return cy.getTestUserId().then((userId) => {
        return cy.task("getProductHistoryCountFromDb", { productId, userId });
    });
});