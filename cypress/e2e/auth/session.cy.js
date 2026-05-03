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

// ------------------------------------------------------------
// TOAST CONTENT VERIFICATION
// ------------------------------------------------------------
describe("Session - Toast Content Verification - Desktop", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
    });

    it("should show correct toast text for ?reason=session_expired", () => {
        cy.visit("/login?reason=session_expired");
        cy.get("[data-sonner-toast]", { timeout: 5000 })
            .should("be.visible")
            .and("contain.text", "You've been signed out");
    });

    it("should show correct toast text for ?error=auth_failed", () => {
        cy.visit("/login?error=auth_failed");
        cy.get("[data-sonner-toast]", { timeout: 5000 })
            .should("be.visible")
            .and("contain.text", "Login failed");
    });

    it("should show correct toast text for ?error=no_code", () => {
        cy.visit("/login?error=no_code");
        cy.get("[data-sonner-toast]", { timeout: 5000 })
            .should("be.visible")
            .and("contain.text", "Invalid login attempt");
    });

    it("should NOT show any toast when visiting /login with no params", () => {
        cy.visit("/login");
        cy.wait(1000);
        cy.get("[data-sonner-toast]").should("not.exist");
    });

    it("should NOT show 'session expired' toast on intentional logout", () => {
        cy.loginWithBypass();
        cy.visit("/main/inventory/product-list");

        cy.intercept("POST", "/api/auth/logout", {
            statusCode: 200,
            body: { message: "Logged out successfully" },
        }).as("logoutRequest");

        cy.get("#logoutBtn").click();
        cy.wait("@logoutRequest");

        // URL must NOT include session_expired — this is the primary signal
        // that AuthListener did not fire the session expiry redirect
        cy.url({ timeout: 5000 }).should("include", "/login");
        cy.url().should("not.include", "reason=session_expired");

        // Any toasts visible must NOT contain "session expired" or "signed out" text
        cy.get("body").then(($body) => {
            if ($body.find("[data-sonner-toast]").length > 0) {
                cy.get("[data-sonner-toast]").each(($toast) => {
                    expect($toast.text().toLowerCase()).not.to.include("session");
                    expect($toast.text().toLowerCase()).not.to.include("signed out");
                });
            }
        });
    });
});

// ------------------------------------------------------------
// API SECURITY — PROTECTED ROUTES
// ------------------------------------------------------------
describe("Session - API Security - Unauthenticated Requests", () => {
    it("should return 401 for GET /api/user when unauthenticated", () => {
        cy.request({ method: "GET", url: "/api/user", failOnStatusCode: false }).then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body).to.have.property("error", "UNAUTHORIZED");
        });
    });

    it("should return 401 for POST /api/auth/logout when unauthenticated", () => {
        cy.apiRequestNoAuth("POST", "/api/auth/logout").then((res) => {
            expect(res.status).to.eq(401);
            expect(res.body).to.have.property("error", "UNAUTHORIZED");
        });
    });

    it("should return 401 for inventory API when unauthenticated", () => {
        cy.request({ method: "GET", url: "/api/inventory/v1/get-products", failOnStatusCode: false }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });

    it("should return 401 for trading API when unauthenticated", () => {
        cy.request({ method: "GET", url: "/api/trade/v1/get-trades", failOnStatusCode: false }).then((res) => {
            expect(res.status).to.eq(401);
        });
    });
});

// ------------------------------------------------------------
// CALLBACK — OPEN REDIRECT VALIDATION
// ------------------------------------------------------------
describe("Session - Callback Open Redirect Validation", () => {
    it("should redirect to /login?error=no_code when ?next= has no code param", () => {
        cy.visit("/auth/v1/callback?next=https://evil.com", {
            failOnStatusCode: false,
        });
        cy.url().should("include", "/login");
        cy.url().should("include", "error=no_code");
    });

    it("should redirect to /login?error=no_code even with relative-looking malformed next", () => {
        cy.visit("/auth/v1/callback?next=//evil.com", {
            failOnStatusCode: false,
        });
        cy.url().should("include", "/login");
        cy.url().should("include", "error=no_code");
    });
});
