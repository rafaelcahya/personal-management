let userData;
import addTradeValidationTestCases from "./addNewTradeValTc.json";

describe("Navigation", () => {
    beforeEach(() => {
        cy.OpenPersonalManagement();
        cy.fixture("user").then((user) => {
            userData = user;
            cy.Login({
                username: userData.username,
                password: userData.password,
            });
        });
        cy.OpenTradingManagement();
    });

    it("should navigate to the trade page", () => {
        cy.get("#tradeBtn").click();
        cy.url().should("include", "/trading-management/trade");
    });

    it("should open Add New Trade Dialog", () => {
        cy.get("#tradeBtn").click();
        cy.url().should("include", "/trading-management/trade");
        cy.get("#addNewTradeBtn").click();
        cy.checkComponentVisible("#addNewTradeDialogForm");
    });

    it("should close the Add New Trade Dialog", () => {
        cy.get("#tradeBtn").click();
        cy.url().should("include", "/trading-management/trade");
        cy.get("#addNewTradeBtn").click();
        cy.checkComponentVisible("#addNewTradeDialogForm");
        cy.get("#cancelNewTradeBtn").click();
        cy.checkComponentNotVisible("#addNewTradeDialogForm");
    });

    addTradeValidationTestCases?.forEach(
        ({ description, fields, expectedMsg }) => {
            it(description, () => {
                cy.get("#tradeBtn").click();
                cy.url().should("include", "/trading-management/trade");
                cy.get("#addNewTradeBtn").should("be.visible").click();
                Object.entries(fields).forEach(([selector, value]) => {
                    cy.get(selector);
                    cy.get(selector)
                        .scrollIntoView({
                            easing: "linear",
                        })
                        .should("exist")
                        .should("be.visible")
                        .clear()
                        .type(value, { force: true });
                });
                cy.get("#submitNewTradeBtn").click();
                Object.entries(expectedMsg).forEach(([selector, msg]) => {
                    cy.get(selector)
                        .scrollIntoView({ easing: "linear" })
                        .should("exist");
                    cy.verifyValidationMessage(selector, msg);
                });
            });
        }
    );
});
