Cypress.Commands.add("OpenPersonalManagement", () => {
    cy.visit("/auth/login");
});

Cypress.Commands.add("OpenTradingManagement", () => {
    cy.url().should("include", "/main/landing");
    cy.get("#tradeBtnLandingPage").click();
    cy.url().should("include", "/main/landing");
});

Cypress.Commands.add("OpenInventoryManagement", () => {
    cy.url().should("include", "/main/landing");
    cy.get("#inventoryBtnLandingPage").click();
    cy.url().should("include", "/main/trading-management/dashboard");
});

Cypress.Commands.add("verifyToastMessage", (message) => {
    cy.get("#toast").contains(message).should("be.visible");
});

Cypress.Commands.add("verifyValidationMessage", (id, message) => {
    cy.get(id).contains(message).should("be.visible");
});

Cypress.Commands.add("checkComponentVisible", (selectors) => {
    if (Array.isArray(selectors)) {
        selectors.forEach((selector) => {
            cy.get(selector).should("be.visible");
        });
    } else {
        cy.get(selectors).should("be.visible");
    }
});

Cypress.Commands.add("checkComponentNotVisible", (selectors) => {
    if (Array.isArray(selectors)) {
        selectors.forEach((selector) => {
            cy.get(selector).should("not.exist");
        });
    } else {
        cy.get(selectors).should("not.exist");
    }
});

Cypress.Commands.add("fillField", (fields, value) => {
    if (typeof fields === "string") {
        cy.get(fields).should("be.visible").clear().type(value);
        return cy.wrap(value);
    } else if (typeof fields === "object") {
        const filledValues = {};
        Object.entries(fields).forEach(([selector, value]) => {
            cy.get(selector).should("be.visible").clear().type(value);
            filledValues[selector] = value;
        });
        return cy.wrap(filledValues);
    }
});

Cypress.Commands.add("Login", ({ username, password }) => {
    cy.task("decryptPasswordTask", password).then((decryptedPassword) => {
        cy.fillField({
            "#username": username,
            "#password": decryptedPassword,
        });
        cy.get("#loginBtn").click();
    });
});

Cypress.Commands.add("saveProductId", (productId) => {
    cy.task("saveProductId", productId);
});

Cypress.Commands.add("getRandomProductId", () => {
    return cy.task("getRandomProductId");
});

Cypress.Commands.add("saveEventId", (eventId) => {
    cy.task("saveEventId", eventId);
});

Cypress.Commands.add("getRandomEventId", () => {
    return cy.task("getRandomEventId");
});

Cypress.Commands.add("saveFeeId", (feeId) => {
    cy.task("saveFeeId", feeId);
});

Cypress.Commands.add("getRandomFeeId", () => {
    return cy.task("getRandomFeeId");
});

Cypress.Commands.add("saveTradeId", (tradeId) => {
    cy.task("saveTradeId", tradeId);
});

Cypress.Commands.add("getRandomTradeId", () => {
    return cy.task("getRandomTradeId");
});

Cypress.Commands.add("saveProductBrandId", (productBrandId) => {
    cy.task("saveProductBrandId", productBrandId);
});

Cypress.Commands.add("getRandomProductBrandId", () => {
    return cy.task("getRandomProductBrandId");
});