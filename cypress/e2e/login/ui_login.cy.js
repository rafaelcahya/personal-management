import { randomString } from "../../support/common/helper";
import loginValidationTestCases from "./loginValTc.json";

let userData;

describe("Login page", () => {
    const protectedUrls = [
        "/main/dashboard",
        "/main/trade",
        "/main/fee",
        "/main/event",
    ];

    beforeEach(() => {
        cy.fixture("user").then((user) => {
            userData = user;
        });
        cy.OpenPersonalManagement();
    });

    it("should display username and password fields with login button", () => {
        cy.checkComponentVisible(["#username", "#password", "#loginBtn"]);
    });

    it("should mask password input", () => {
        cy.fillField("#password", randomString());
        cy.get("#password").invoke("attr", "type").should("eq", "password");
    });

    loginValidationTestCases?.forEach(
        ({ description, fields, expectedToast }) => {
            it(description, () => {
                Object.entries(fields).forEach(([selector, value]) => {
                    const inputValue =
                        value === "random" ? randomString() : value;
                    cy.get(selector).clear().type(inputValue);
                });
                cy.get("#loginBtn").click();
                cy.verifyToastMessage(expectedToast);
            });
        }
    );

    it("should login with valid credentials", () => {
        cy.task("decryptPasswordTask", userData.password).then(
            (decryptedPassword) => {
                cy.fillField({
                    "#username": userData.username,
                    "#password": decryptedPassword,
                });
                cy.get("#loginBtn").click();
                cy.verifyToastMessage("Login successful!");
                cy.url().should("include", "/main/landing");
            }
        );
    });

    it("should not have authToken cookie when opening login page", () => {
        cy.getCookie("authToken").should("not.exist");
        cy.checkComponentVisible(["#username", "#password", "#loginBtn"]);
    });

    protectedUrls.forEach((url) => {
        it(`should redirect to login when accessing ${url} without auth`, () => {
            cy.visit(url, { failOnStatusCode: false });
            cy.url().should("include", "/auth/login");
            cy.getCookie("authToken").should("not.exist");
            cy.checkComponentVisible(["#username", "#password", "#loginBtn"]);
        });
    });
});
