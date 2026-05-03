describe("Logout - API Endpoint", () => {
    before(() => {
        cy.setupApiAuthCookies();
    });

    it("should return 200 when authenticated", () => {
        cy.apiRequestWithSession("POST", "/api/auth/logout").then((res) => {
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property("message", "Logged out successfully");
        });
    });

    it("should return 401 when unauthenticated", () => {
        cy.apiRequestNoAuth("POST", "/api/auth/logout").then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

describe("Logout Button - Inventory Layout - Desktop", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.loginWithBypass();
        cy.visit("/main/inventory/product-list");
    });

    it("should display logout button", () => {
        cy.get("#logoutBtn").should("be.visible");
    });

    it("should show logout icon and label", () => {
        cy.get("#logoutBtn").should("contain.text", "Logout");
        cy.get("#logoutBtn svg").should("exist");
    });

    it("should have accessible aria-label", () => {
        cy.get("#logoutBtn").should("have.attr", "aria-label", "Logout from application");
    });

    it("should be keyboard accessible via Tab", () => {
        cy.get("#logoutBtn").focus().should("be.focused");
    });
});

describe("Logout Button - Trading Layout - Desktop", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.loginWithBypass();
        cy.visit("/main/trading/dashboard");
    });

    it("should display logout button", () => {
        cy.get("#logoutBtn").should("be.visible");
    });

    it("should show logout icon and label", () => {
        cy.get("#logoutBtn").should("contain.text", "Logout");
        cy.get("#logoutBtn svg").should("exist");
    });

    it("should have accessible aria-label", () => {
        cy.get("#logoutBtn").should("have.attr", "aria-label", "Logout from application");
    });

    it("should be disabled and show loading state during logout", () => {
        cy.intercept("POST", "/api/auth/logout", (req) => {
            req.reply({ delay: 2000, statusCode: 200, body: { message: "Logged out successfully" } });
        }).as("logoutRequest");

        cy.get("#logoutBtn").click();
        cy.get("#logoutBtn").should("be.disabled");
        cy.get("#logoutBtn").should("contain.text", "Logging out...");
        cy.get("#logoutBtn svg").should("exist");
    });
});

describe("Logout Button - Inventory Layout - Mobile", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
        cy.loginWithBypass();
        cy.visit("/main/inventory/product-list");
    });

    it("should display logout button", () => {
        cy.get("#logoutBtn").should("be.visible");
    });
});

describe("Logout Button - Trading Layout - Mobile", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
        cy.loginWithBypass();
        cy.visit("/main/trading/dashboard");
    });

    it("should display logout button", () => {
        cy.get("#logoutBtn").should("be.visible");
    });
});

describe("Logout Button - Inventory Layout - Tablet", () => {
    beforeEach(() => {
        cy.viewport("ipad-2");
        cy.loginWithBypass();
        cy.visit("/main/inventory/product-list");
    });

    it("should display logout button", () => {
        cy.get("#logoutBtn").should("be.visible");
    });
});

describe("Logout Button - Trading Layout - Tablet", () => {
    beforeEach(() => {
        cy.viewport("ipad-2");
        cy.loginWithBypass();
        cy.visit("/main/trading/dashboard");
    });

    it("should display logout button", () => {
        cy.get("#logoutBtn").should("be.visible");
    });
});
