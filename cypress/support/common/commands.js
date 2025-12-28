Cypress.Commands.add("OpenTradingPerformance", () => {
    cy.visit("/auth/login");
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