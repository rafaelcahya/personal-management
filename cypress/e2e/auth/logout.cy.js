// ============================================================
// LOGOUT TEST SUITE
// Covers: API endpoint, LogoutButton (Inventory & Trading),
//         UserMenu (Landing), redirect, loading state, error toast
// ============================================================

// ------------------------------------------------------------
// API ENDPOINT
// ------------------------------------------------------------
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
            expect(res.body).to.have.property("error", "UNAUTHORIZED");
        });
    });

    it("should not accept GET method", () => {
        cy.apiRequestNoAuth("GET", "/api/auth/logout").then((res) => {
            expect(res.status).to.not.eq(200);
        });
    });
});

// ------------------------------------------------------------
// LOGOUT BUTTON — INVENTORY LAYOUT — DESKTOP
// ------------------------------------------------------------
describe("Logout Button - Inventory Layout - Desktop", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.loginWithBypass();
        cy.visit("/main/inventory/product-list");
    });

    it("should display logout button", () => {
        cy.get("#logoutBtn").should("be.visible");
    });

    it("should show correct label 'Sign out'", () => {
        cy.get("#logoutBtn").should("contain.text", "Sign out");
        cy.get("#logoutBtn svg").should("exist");
    });

    it("should have accessible aria-label", () => {
        cy.get("#logoutBtn").should("have.attr", "aria-label", "Sign out from application");
    });

    it("should be keyboard accessible via Tab", () => {
        cy.get("#logoutBtn").focus().should("be.focused");
    });

    it("should show loading state while signing out", () => {
        cy.intercept("POST", "/api/auth/logout", (req) => {
            req.reply({ delay: 2000, statusCode: 200, body: { message: "Logged out successfully" } });
        }).as("logoutRequest");

        cy.get("#logoutBtn").click();
        cy.get("#logoutBtn").should("be.disabled");
        cy.get("#logoutBtn").should("contain.text", "Signing out...");
        cy.get("#logoutBtn svg").should("exist");
    });

    it("should redirect to /login after successful logout", () => {
        cy.intercept("POST", "/api/auth/logout", {
            statusCode: 200,
            body: { message: "Logged out successfully" },
        }).as("logoutRequest");

        cy.get("#logoutBtn").click();
        cy.wait("@logoutRequest");
        cy.url({ timeout: 5000 }).should("include", "/login");
        cy.url().should("not.include", "reason=session_expired");
    });

    it("should show error toast when logout API fails", () => {
        cy.intercept("POST", "/api/auth/logout", {
            statusCode: 500,
            body: { error: "LOGOUT_FAILED", message: "Internal server error" },
        }).as("logoutFailed");

        cy.get("#logoutBtn").click();
        cy.wait("@logoutFailed");
        cy.get("[data-sonner-toast]")
            .should("be.visible")
            .and("contain.text", "Couldn't sign you out");
        cy.url().should("not.include", "/login");
    });

    it("should re-enable button after failed logout", () => {
        cy.intercept("POST", "/api/auth/logout", {
            statusCode: 500,
            body: { error: "LOGOUT_FAILED", message: "Internal server error" },
        }).as("logoutFailed");

        cy.get("#logoutBtn").click();
        cy.wait("@logoutFailed");
        cy.get("#logoutBtn").should("not.be.disabled");
    });
});

// ------------------------------------------------------------
// LOGOUT BUTTON — TRADING LAYOUT — DESKTOP
// ------------------------------------------------------------
describe("Logout Button - Trading Layout - Desktop", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.loginWithBypass();
        cy.visit("/main/trading/dashboard");
    });

    it("should display logout button", () => {
        cy.get("#logoutBtn").should("be.visible");
    });

    it("should show correct label 'Sign out'", () => {
        cy.get("#logoutBtn").should("contain.text", "Sign out");
        cy.get("#logoutBtn svg").should("exist");
    });

    it("should have accessible aria-label", () => {
        cy.get("#logoutBtn").should("have.attr", "aria-label", "Sign out from application");
    });

    it("should show loading state while signing out", () => {
        cy.intercept("POST", "/api/auth/logout", (req) => {
            req.reply({ delay: 2000, statusCode: 200, body: { message: "Logged out successfully" } });
        }).as("logoutRequest");

        cy.get("#logoutBtn").click();
        cy.get("#logoutBtn").should("be.disabled");
        cy.get("#logoutBtn").should("contain.text", "Signing out...");
    });

    it("should redirect to /login after successful logout", () => {
        cy.intercept("POST", "/api/auth/logout", {
            statusCode: 200,
            body: { message: "Logged out successfully" },
        }).as("logoutRequest");

        cy.get("#logoutBtn").click();
        cy.wait("@logoutRequest");
        cy.url({ timeout: 5000 }).should("include", "/login");
        cy.url().should("not.include", "reason=session_expired");
    });
});

// ------------------------------------------------------------
// USER MENU — LANDING PAGE — DESKTOP
// ------------------------------------------------------------
describe("UserMenu - Landing Page - Desktop", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.loginWithBypass();
        cy.visit("/main/landing");
    });

    it("should display user menu trigger button", () => {
        cy.get("#userMenuTrigger_landingPage").should("be.visible");
    });

    it("should have accessible aria-label", () => {
        cy.get("#userMenuTrigger_landingPage").should("have.attr", "aria-label", "User menu");
    });

    it("should show avatar or initial in trigger", () => {
        cy.get("#userMenuTrigger_landingPage").within(() => {
            cy.get("div.rounded-full").should("exist");
        });
    });

    it("should open dropdown when clicked", () => {
        cy.get("#userMenuTrigger_landingPage").click();
        cy.get("#userMenuEmail_landingPage").should("be.visible");
    });

    it("should show user email in dropdown", () => {
        cy.get("#userMenuTrigger_landingPage").click();
        cy.get("#userMenuEmail_landingPage")
            .should("be.visible")
            .and("not.be.empty");
    });

    it("should show 'Sign out' option in dropdown", () => {
        cy.get("#userMenuTrigger_landingPage").click();
        cy.get("#userMenuSignOut_landingPage")
            .should("be.visible")
            .and("contain.text", "Sign out");
    });

    it("should redirect to /login after sign out from UserMenu", () => {
        cy.intercept("POST", "/api/auth/logout", {
            statusCode: 200,
            body: { message: "Logged out successfully" },
        }).as("logoutRequest");

        cy.get("#userMenuTrigger_landingPage").click();
        cy.get("#userMenuSignOut_landingPage").click();
        cy.wait("@logoutRequest");
        cy.url({ timeout: 5000 }).should("include", "/login");
        cy.url().should("not.include", "reason=session_expired");
    });

    it("should show error toast when sign out fails from UserMenu", () => {
        cy.intercept("POST", "/api/auth/logout", {
            statusCode: 500,
            body: { error: "LOGOUT_FAILED", message: "Internal server error" },
        }).as("logoutFailed");

        cy.get("#userMenuTrigger_landingPage").click();
        cy.get("#userMenuSignOut_landingPage").click();
        cy.wait("@logoutFailed");
        cy.get("[data-sonner-toast]")
            .should("be.visible")
            .and("contain.text", "Couldn't sign you out");
    });

    it("should be keyboard accessible", () => {
        cy.get("#userMenuTrigger_landingPage").focus().should("be.focused");
        cy.get("#userMenuTrigger_landingPage").type("{enter}");
        cy.get("#userMenuSignOut_landingPage").should("be.visible");
    });
});

// ------------------------------------------------------------
// USER MENU — LANDING PAGE — MOBILE
// ------------------------------------------------------------
describe("UserMenu - Landing Page - Mobile", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
        cy.loginWithBypass();
        cy.visit("/main/landing");
    });

    it("should display user menu trigger on mobile", () => {
        cy.get("#userMenuTrigger_landingPage").should("be.visible");
    });

    it("should open dropdown on mobile and show sign out", () => {
        cy.get("#userMenuTrigger_landingPage").click();
        cy.get("#userMenuSignOut_landingPage").should("be.visible");
    });
});

// ------------------------------------------------------------
// USER MENU — LANDING PAGE — TABLET
// ------------------------------------------------------------
describe("UserMenu - Landing Page - Tablet", () => {
    beforeEach(() => {
        cy.viewport("ipad-2");
        cy.loginWithBypass();
        cy.visit("/main/landing");
    });

    it("should display user menu trigger on tablet", () => {
        cy.get("#userMenuTrigger_landingPage").should("be.visible");
    });

    it("should open dropdown on tablet and show email + sign out", () => {
        cy.get("#userMenuTrigger_landingPage").click();
        cy.get("#userMenuEmail_landingPage").should("be.visible");
        cy.get("#userMenuSignOut_landingPage").should("be.visible");
    });
});

// ------------------------------------------------------------
// LOGOUT BUTTON — INVENTORY LAYOUT — MOBILE
// ------------------------------------------------------------
describe("Logout Button - Inventory Layout - Mobile", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
        cy.loginWithBypass();
        cy.visit("/main/inventory/product-list");
    });

    it("should display logout button", () => {
        cy.get("#logoutBtn").should("be.visible");
    });

    it("should show correct label 'Sign out'", () => {
        cy.get("#logoutBtn").should("contain.text", "Sign out");
    });
});

// ------------------------------------------------------------
// LOGOUT BUTTON — TRADING LAYOUT — MOBILE
// ------------------------------------------------------------
describe("Logout Button - Trading Layout - Mobile", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
        cy.loginWithBypass();
        cy.visit("/main/trading/dashboard");
    });

    it("should display logout button", () => {
        cy.get("#logoutBtn").should("be.visible");
    });

    it("should show correct label 'Sign out'", () => {
        cy.get("#logoutBtn").should("contain.text", "Sign out");
    });
});

// ------------------------------------------------------------
// LOGOUT BUTTON — INVENTORY LAYOUT — TABLET
// ------------------------------------------------------------
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

// ------------------------------------------------------------
// LOGOUT BUTTON — TRADING LAYOUT — TABLET
// ------------------------------------------------------------
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
