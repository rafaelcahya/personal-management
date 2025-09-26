import { randomString } from "../../support/common/helper";

let userData;

describe("Login page", () => {
    beforeEach(() => {
        cy.fixture("user").then((user) => {
            userData = user;
        });
        cy.OpenTradingPerformance();
    });

    it("should display username and password fields with login button", () => {
        cy.checkComponentVisible(["#username", "#password", "#loginBtn"]);
    });

    it("should mask password input", () => {
        cy.fillField("#password", randomString());
        cy.get("#password").invoke("attr", "type").should("eq", "password");
    });

    it("should show error when username is empty", () => {
        cy.fillField("#username", randomString());
        cy.get("#loginBtn").click();
        cy.verifyToastMessage("Username and password cannot be empty");
    });

    it("should show error when username is empty", () => {
        cy.fillField("#password", randomString());
        cy.get("#loginBtn").click();
        cy.verifyToastMessage("Username and password cannot be empty");
    });

    it("should show error when username and password are empty", () => {
        cy.get("#loginBtn").click();
        cy.verifyToastMessage("Username and password cannot be empty");
    });

    it("should not login with invalid credentials", () => {
        cy.fillField({
            "#username": randomString(),
            "#password": randomString(),
        });
        cy.get("#loginBtn").click();
        cy.verifyToastMessage("Invalid username or password");
    });

    it("should login with valid credentials", () => {
        cy.fillField({
            "#username": userData.username,
            "#password": userData.password,
        });
        cy.get("#loginBtn").click();
        cy.verifyToastMessage("Login successful!");
        cy.url().should("include", "/main/dashboard");
    });
});
