let userData;
import addFeeValidationTestCases from "./addNewFeeValTc.json";
import { randomString } from "../../support/common/helper";

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

    it("should navigate to the fee page", () => {
        cy.get("#feeBtn").click();
        cy.url().should("include", "/trading-management/fee");
    });

    it("should open Add New Fee Dialog", () => {
        cy.get("#feeBtn").click();
        cy.url().should("include", "/trading-management/fee");
        cy.get("#addNewFeeBtn").click();
        cy.checkComponentVisible("#addNewFeeDialogForm");
    });

    it("should close the Add New Fee Dialog", () => {
        cy.get("#feeBtn").click();
        cy.url().should("include", "/trading-management/fee");
        cy.get("#addNewFeeBtn").click();
        cy.checkComponentVisible("#addNewFeeDialogForm");
        cy.get("#cancelNewFeeBtn").click();
        cy.checkComponentNotVisible("#addNewFeeDialogForm");
    });

    addFeeValidationTestCases?.forEach(
        ({ description, fields, expectedMsg }) => {
            it(description, () => {
                cy.get("#feeBtn").click();

                cy.url().should("include", "/trading-management/fee");
                cy.get("#addNewFeeBtn").should("be.visible").click();
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
                cy.get("#submitNewFeeBtn").click();
                Object.entries(expectedMsg).forEach(([selector, msg]) => {
                    cy.get(selector)
                        .scrollIntoView({ easing: "linear" })
                        .should("exist");
                    cy.verifyValidationMessage(selector, msg);
                });
            });
        }
    );

    it("should be successfull to add new fee", () => {
        const text = randomString(10, "text").toUpperCase();
        const number = randomString(5, "number");

        cy.get("#feeBtn").click();

        cy.url().should("include", "/trading-management/fee");
        cy.get("#addNewFeeBtn").should("be.visible").click();

        cy.fillField({
            "#feeNameField": text,
            "#feeField": number,
        });

        cy.get("#submitNewFeeBtn").click();
        cy.verifyToastMessage("New fee added successfully!");
    });
});
