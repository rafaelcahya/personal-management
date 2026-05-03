describe("Session Expiry - Error Message Display - Desktop", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
    });

    it("should show session expired message when visiting login with reason=session_expired", () => {
        cy.visit("/login?reason=session_expired");
        cy.get("#loginPage").should("be.visible");
    });

    it("should show error message when visiting login with error=auth_failed", () => {
        cy.visit("/login?error=auth_failed");
        cy.get("#loginPage").should("be.visible");
    });

    it("should show error message when visiting login with error=no_code", () => {
        cy.visit("/login?error=no_code");
        cy.get("#loginPage").should("be.visible");
    });

    it("should not break login page when no error params present", () => {
        cy.visit("/login");
        cy.get("#loginPage").should("be.visible");
        cy.get("#googleSignInBtn_loginPage").should("not.be.disabled");
    });
});

describe("Session Expiry - Protected Route Guards - Desktop", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.clearAuth();
    });

    it("should redirect to login from inventory when session cleared", () => {
        cy.visit("/main/inventory/product-list", { failOnStatusCode: false });
        cy.url().should("include", "/login");
    });

    it("should redirect to login from trading when session cleared", () => {
        cy.visit("/main/trading/dashboard", { failOnStatusCode: false });
        cy.url().should("include", "/login");
    });

    it("should redirect to login from landing when session cleared", () => {
        cy.visit("/main/landing", { failOnStatusCode: false });
        cy.url().should("include", "/login");
    });
});

describe("Session Expiry - Error Message Display - Mobile", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
    });

    it("should show session expired message on mobile", () => {
        cy.visit("/login?reason=session_expired");
        cy.get("#loginPage").should("be.visible");
    });

    it("should show auth failed message on mobile", () => {
        cy.visit("/login?error=auth_failed");
        cy.get("#loginPage").should("be.visible");
    });
});

describe("Session Expiry - Error Message Display - Tablet", () => {
    beforeEach(() => {
        cy.viewport("ipad-2");
    });

    it("should show session expired message on tablet", () => {
        cy.visit("/login?reason=session_expired");
        cy.get("#loginPage").should("be.visible");
    });
});
