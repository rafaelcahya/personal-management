let userData;
import addEventValidationTestCases from "./addNewEventValTc.json";

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

    it("should navigate to the event page", () => {
        cy.get("#eventBtn").click();
        cy.url().should("include", "/trading-management/event");
    });

    it("should open Add New Event Dialog", () => {
        cy.get("#eventBtn").click();
        cy.url().should("include", "/trading-management/event");
        cy.get("#addNewEventBtn").click();
        cy.checkComponentVisible("#addNewEventDialogForm");
    });

    it("should close the Add New Event Dialog", () => {
        cy.get("#eventBtn").click();
        cy.url().should("include", "/trading-management/event");
        cy.get("#addNewEventBtn").click();
        cy.checkComponentVisible("#addNewEventDialogForm");
        cy.get("#cancelNewEventBtn").click();
        cy.checkComponentNotVisible("#addNewEventDialogForm");
    });

    addEventValidationTestCases?.forEach(
        ({ description, fields, expectedMsg }) => {
            it(description, () => {
                cy.get("#eventBtn").click();

                cy.url().should("include", "/trading-management/event");
                cy.get("#addNewEventBtn").should("be.visible").click();
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
                cy.get("#submitNewEventBtn").click();
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
