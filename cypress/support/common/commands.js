import { randomString } from "./helper";

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
    cy.fillField({
        "#username": username,
        "#password": password,
    });
    cy.get("#loginBtn").click();
});

Cypress.Commands.add("AddNewTrade", () => {
    const date = new Date().toISOString().replace("Z", "+00:00");
    const text = randomString(4, "text").toUpperCase();
    const number = randomString(5, "number");
    const uuid = crypto.randomUUID();

    return cy.request({
        method: "POST",
        url: "/api/trade/create",
        body: {
            trade_date: date,
            ticker: text,
            margin: number,
            proceeds: number,
            return_percent: number,
            realized_gain: number,
            entry_session_option: text,
            entry_occasion_option: text,
            buy_reason_option: text,
            sell_reason_option: text,
            stock_type_option: text,
            notes: "created by automation at" + date,
            uuid: uuid,
        },
        failOnStatusCode: false,
    });
});
