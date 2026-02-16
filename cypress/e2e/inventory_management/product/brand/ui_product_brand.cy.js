let userData;
import addProductBrandValidationTestCases from "./addNewProductBrandValTc.json";
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

    it("should navigate to the product brand page", () => {
        cy.get("#productBrandBtn").click();
        cy.url().should("include", "/inventory-management/product-brand");
    });

    it("should open Add New Product Brand Dialog", () => {
        cy.get("#productBrandBtn").click();
        cy.url().should("include", "/inventory-management/product-brand");
        cy.get("#addNewProductBrandBtn").click();
        cy.checkComponentVisible("#addNewProductBrandDialogForm");
    });

    it("should close the Add New Product Brand Dialog", () => {
        cy.get("#productBrandBtn").click();
        cy.url().should("include", "/inventory-management/product-brand");
        cy.get("#addNewProductBrandBtn").click();
        cy.checkComponentVisible("#addNewProductBrandDialogForm");
        cy.get("#cancelNewProductBrandBtn").click();
        cy.checkComponentNotVisible("#addNewProductBrandDialogForm");
    });

    addProductBrandValidationTestCases?.forEach(
        ({ description, fields, expectedMsg }) => {
            it(description, () => {
                cy.get("#productBrandBtn").click();

                cy.url().should(
                    "include",
                    "/inventory-management/product-brand"
                );
                cy.get("#addNewProductBrandBtn").should("be.visible").click();
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
                cy.get("#submitNewProductBrandBtn").click();
                Object.entries(expectedMsg).forEach(([selector, msg]) => {
                    cy.get(selector)
                        .scrollIntoView({ easing: "linear" })
                        .should("exist");
                    cy.verifyValidationMessage(selector, msg);
                });
            });
        }
    );

    it("should be successfull to add new product brand", () => {
        cy.get("#productBrandBtn").click();

        cy.url().should("include", "/inventory-management/product-brand");
        cy.get("#addNewProductBrandBtn").should("be.visible").click();

        cy.fillField({
            "#brandField": faker.company.name(),
            "#noteField": faker.commerce.productDescription(),
        });

        cy.get("#submitNewProductBrandBtn").click();
        cy.verifyToastMessage("New product brand added successfully!");
    });
});
