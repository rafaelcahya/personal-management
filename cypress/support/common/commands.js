Cypress.Commands.add("OpenTradingPerformance", () => {
    cy.visit(Cypress.config("baseUrl"));
});

Cypress.Commands.add("verifyToastMessage", (message) => {
    cy.get("#toast").contains(message).should("be.visible");
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
