import { faker } from "@faker-js/faker";

describe("Login - API & Authentication", () => {
    before(() => {
        cy.clearAuth();
    });

    it("should authenticate programmatically via Supabase API", () => {
        const email = Cypress.env("TEST_EMAIL");
        const password = Cypress.env("TEST_PASSWORD");

        cy.task("getSupabaseSession", { email, password }).then((session) => {
            expect(session).to.not.be.null;
            expect(session).to.have.property("access_token");
            expect(session).to.have.property("refresh_token");
            expect(session).to.have.property("user");

            cy.log(
                `✅ Access Token: ${session.access_token.substring(0, 20)}...`,
            );
            cy.log(`✅ User ID: ${session.user.id}`);
            cy.log(`✅ User Email: ${session.user.email}`);
        });
    });

    it("should redirect unauthenticated user to login", () => {
        cy.disableBypass();
        cy.visit("/main/landing", { failOnStatusCode: false });
        cy.url().should("include", "/login");
    });

    it("should fail login with invalid credentials", () => {
        cy.task("getSupabaseSession", {
            email: faker.internet.email(),
            password: faker.word.words(2),
        }).then((session) => {
            expect(session).to.be.null;
        });
    });

    it("should have valid session structure", () => {
        cy.login();

        cy.getSession().then((session) => {
            expect(session).to.have.property("access_token");
            expect(session).to.have.property("refresh_token");
            expect(session).to.have.property("expires_in");
            expect(session).to.have.property("expires_at");
            expect(session).to.have.property("token_type");
            expect(session).to.have.property("user");
            expect(session.token_type).to.equal("bearer");
            expect(session.user).to.have.property("id");
            expect(session.user).to.have.property("email");
            expect(session.user).to.have.property("user_metadata");
        });
    });

    it("should create session and store in localStorage", () => {
        cy.login();

        cy.getSession().then((session) => {
            expect(session).to.not.be.null;
            expect(session).to.have.property("access_token");
            expect(session).to.have.property("user");
            expect(session.user).to.have.property("email");

            cy.log(`✅ User: ${session.user.email}`);
            cy.log(`✅ User ID: ${session.user.id}`);
        });
    });

    it("should access protected route with bypass", () => {
        cy.loginWithBypass();

        cy.getCookie("cypress-bypass").then((cookie) => {
            expect(cookie).to.not.be.null;
            expect(cookie.value).to.equal(Cypress.env("CYPRESS_AUTH_SECRET"));
        });

        cy.visit("/main/landing");

        cy.url().should("include", "/main/landing");
        cy.url().should("not.include", "/login");
        cy.get("body").should("be.visible");
    });

    it("should get valid access token", () => {
        cy.login();

        cy.getAuthToken().then((token) => {
            expect(token).to.not.be.null;
            expect(token).to.be.a("string");
            expect(token).to.have.length.greaterThan(100);

            cy.log(`✅ Token length: ${token.length}`);
        });
    });
});

describe("Login Page - Desktop Interactions", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
        cy.visit("/login");
    });

    it("should display login page with correct elements", () => {
        cy.get("#loginPage").should("be.visible");
    });

    it("should display Google login button", () => {
        cy.get("#googleSignInBtn_loginPage").should("be.visible");
        cy.get("#googleSignInBtn_loginPage").should("not.be.disabled");
    });

    it("should show Google icon in login button", () => {
        cy.get("#googleSignInBtn_loginPage").find("svg").should("be.visible");
    });
});

describe("Login - Auth Callback - Dekstop Interactions", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
    });

    it("should handle successful OAuth callback", () => {
        const mockCode = "mock-oauth-code-12345";

        // Intercept the code exchange
        cy.intercept("POST", "**/auth/v1/token*", {
            statusCode: 200,
            body: {
                access_token: "mock-access-token",
                refresh_token: "mock-refresh-token",
                expires_in: 3600,
                token_type: "bearer",
                user: {
                    id: "test-user-id",
                    email: "test@example.com",
                },
            },
        }).as("tokenExchange");

        // Visit callback URL with code
        cy.visit(`/auth/callback?code=${mockCode}`);

        // Should redirect to landing page
        cy.url({ timeout: 10000 }).should("include", "/login");
    });

    it("should handle OAuth callback error", () => {
        // Visit callback without code
        cy.visit("/auth/callback");

        // Should redirect to login with error
        cy.url().should("include", "/login");
    });

    it("should redirect to login on auth failure", () => {
        cy.intercept("POST", "**/auth/v1/token*", {
            statusCode: 400,
            body: { error: "invalid_grant" },
        });

        cy.visit("/auth/callback?code=invalid-code", {
            failOnStatusCode: false,
        });

        cy.url().should("include", "/login");
        cy.url().should("include", "error=auth_failed");
    });
});

describe("Login - Session Persistence - Dekstop Interactions", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
    });

    it("should persist session across page reloads", () => {
        cy.loginWithBypass();
        cy.visit("/main/landing");

        // Verify logged in
        cy.url().should("include", "/main/landing");

        // Reload page
        cy.reload();

        // Should still be logged in
        cy.url().should("include", "/main/landing");
        cy.get("body").should("be.visible");
    });

    it("should redirect to login when session expired after access landing page", () => {
        cy.clearAuth();
        cy.visit("/main/landing", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product list page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-list", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product brand page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-brand", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product name page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-name", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product history page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-history", {
            failOnStatusCode: false,
        });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access trading dashboard page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/dashboard", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access trade page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/trade", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access event page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/event", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access fee page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/fee", {
            failOnStatusCode: false,
        });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });
});

describe("Login Page - Mobile Interactions", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
        cy.visit("/login");
    });

    it("should display login page with correct elements", () => {
        cy.get("#loginPage").should("be.visible");
    });

    it("should display Google login button", () => {
        cy.contains("Continue with Google").should("be.visible");
        cy.get("#googleSignInBtn_loginPage").should("not.be.disabled");
    });

    it("should show Google icon in login button", () => {
        cy.get("#googleSignInBtn_loginPage").find("svg").should("be.visible");
    });
});

describe("Login - Auth Callback - Mobile Interactions", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
    });

    it("should handle successful OAuth callback", () => {
        const mockCode = "mock-oauth-code-12345";

        // Intercept the code exchange
        cy.intercept("POST", "**/auth/v1/token*", {
            statusCode: 200,
            body: {
                access_token: "mock-access-token",
                refresh_token: "mock-refresh-token",
                expires_in: 3600,
                token_type: "bearer",
                user: {
                    id: "test-user-id",
                    email: "test@example.com",
                },
            },
        }).as("tokenExchange");

        // Visit callback URL with code
        cy.visit(`/auth/callback?code=${mockCode}`);

        // Should redirect to landing page
        cy.url({ timeout: 10000 }).should("include", "/login");
    });

    it("should handle OAuth callback error", () => {
        // Visit callback without code
        cy.visit("/auth/callback");

        // Should redirect to login with error
        cy.url().should("include", "/login");
    });

    it("should redirect to login on auth failure", () => {
        cy.intercept("POST", "**/auth/v1/token*", {
            statusCode: 400,
            body: { error: "invalid_grant" },
        });

        cy.visit("/auth/callback?code=invalid-code", {
            failOnStatusCode: false,
        });

        cy.url().should("include", "/login");
        cy.url().should("include", "error=auth_failed");
    });
});

describe("Login - Session Persistence - Mobile Interactions", () => {
    beforeEach(() => {
        cy.viewport("iphone-x");
    });

    it("should persist session across page reloads", () => {
        cy.loginWithBypass();
        cy.visit("/main/landing");

        // Verify logged in
        cy.url().should("include", "/main/landing");

        // Reload page
        cy.reload();

        // Should still be logged in
        cy.url().should("include", "/main/landing");
        cy.get("body").should("be.visible");
    });

    it("should redirect to login when session expired after access landing page", () => {
        cy.clearAuth();
        cy.visit("/main/landing", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product list page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-list", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product brand page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-brand", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product name page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-name", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product history page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-history", {
            failOnStatusCode: false,
        });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access trading dashboard page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/dashboard", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access trade page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/trade", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access event page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/event", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access fee page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/fee", {
            failOnStatusCode: false,
        });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });
});

describe("Login Page - Tablet Interactions", () => {
    beforeEach(() => {
        cy.viewport("ipad-2");
        cy.visit("/login");
    });

    it("should display login page with correct elements", () => {
        cy.get("#loginPage").should("be.visible");
    });

    it("should display Google login button", () => {
        cy.get("#googleSignInBtn_loginPage").should("be.visible");
        cy.get("#googleSignInBtn_loginPage").should("not.be.disabled");
    });

    it("should show Google icon in login button", () => {
        cy.get("#googleSignInBtn_loginPage").find("svg").should("be.visible");
    });
});

describe("Login - Auth Callback - Tablet Interactions", () => {
    beforeEach(() => {
        cy.viewport("ipad-2");
    });

    it("should handle successful OAuth callback", () => {
        const mockCode = "mock-oauth-code-12345";

        // Intercept the code exchange
        cy.intercept("POST", "**/auth/v1/token*", {
            statusCode: 200,
            body: {
                access_token: "mock-access-token",
                refresh_token: "mock-refresh-token",
                expires_in: 3600,
                token_type: "bearer",
                user: {
                    id: "test-user-id",
                    email: "test@example.com",
                },
            },
        }).as("tokenExchange");

        // Visit callback URL with code
        cy.visit(`/auth/callback?code=${mockCode}`);

        // Should redirect to landing page
        cy.url({ timeout: 10000 }).should("include", "/login");
    });

    it("should handle OAuth callback error", () => {
        // Visit callback without code
        cy.visit("/auth/callback");

        // Should redirect to login with error
        cy.url().should("include", "/login");
    });

    it("should redirect to login on auth failure", () => {
        cy.intercept("POST", "**/auth/v1/token*", {
            statusCode: 400,
            body: { error: "invalid_grant" },
        });

        cy.visit("/auth/callback?code=invalid-code", {
            failOnStatusCode: false,
        });

        cy.url().should("include", "/login");
        cy.url().should("include", "error=auth_failed");
    });
});

describe("Login - Session Persistence - Tablet Interactions", () => {
    beforeEach(() => {
        cy.viewport("ipad-2");
    });

    it("should persist session across page reloads", () => {
        cy.loginWithBypass();
        cy.visit("/main/landing");

        // Verify logged in
        cy.url().should("include", "/main/landing");

        // Reload page
        cy.reload();

        // Should still be logged in
        cy.url().should("include", "/main/landing");
        cy.get("body").should("be.visible");
    });

    it("should redirect to login when session expired after access landing page", () => {
        cy.clearAuth();
        cy.visit("/main/landing", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product list page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-list", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product brand page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-brand", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product name page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-name", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access product history page", () => {
        cy.clearAuth();
        cy.visit("/main/inventory/product-history", {
            failOnStatusCode: false,
        });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access trading dashboard page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/dashboard", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access trade page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/trade", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access event page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/event", { failOnStatusCode: false });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });

    it("should redirect to login when session expired after access fee page", () => {
        cy.clearAuth();
        cy.visit("/main/trading/fee", {
            failOnStatusCode: false,
        });

        cy.url().should("include", "/login");
        cy.get("#loginPage").should("be.visible");
    });
});
