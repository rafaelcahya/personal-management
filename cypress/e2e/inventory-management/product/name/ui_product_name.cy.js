let userData;
import addProductNameValidationTestCases from "./addNewProductNameValTc.json";
import { faker } from "@faker-js/faker";

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
        cy.OpenInventoryManagement();
    });

    it("should navigate to the Product Name page", () => {
        cy.get("#productNameBtn").click();
        cy.url().should("include", "/inventory-management/product-name");
    });

    it("should open Add New Product Name Dialog", () => {
        cy.get("#productNameBtn").click();
        cy.url().should("include", "/inventory-management/product-name");
        cy.get("#addNewProductNameBtn").click();
        cy.checkComponentVisible("#addNewProductNameDialogForm");
    });

    it("should close the Add New Product Name Dialog", () => {
        cy.get("#productNameBtn").click();
        cy.url().should("include", "/inventory-management/product-name");
        cy.get("#addNewProductNameBtn").click();
        cy.checkComponentVisible("#addNewProductNameDialogForm");
        cy.get("#cancelNewProductNameBtn").click();
        cy.checkComponentNotVisible("#addNewProductNameDialogForm");
    });

    addProductNameValidationTestCases?.forEach(
        ({ description, fields, expectedMsg }) => {
            it(description, () => {
                cy.get("#productNameBtn").click();

                cy.url().should(
                    "include",
                    "/inventory-management/product-name"
                );
                cy.get("#addNewProductNameBtn").should("be.visible").click();
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
                cy.get("#submitNewProductNameBtn").click();
                Object.entries(expectedMsg).forEach(([selector, msg]) => {
                    cy.get(selector)
                        .scrollIntoView({ easing: "linear" })
                        .should("exist");
                    cy.verifyValidationMessage(selector, msg);
                });
            });
        }
    );

    it("should be successfull to add new Product Name", () => {
        cy.get("#productNameBtn").click();

        cy.url().should("include", "/inventory-management/product-name");
        cy.get("#addNewProductNameBtn").should("be.visible").click();

        cy.fillField({
            "#productNameField": faker.company.name(),
            "#noteField": faker.commerce.productDescription(),
        });

        cy.get("#submitNewProductNameBtn").click();
        cy.verifyToastMessage("New Product Name added successfully!");
    });
});
