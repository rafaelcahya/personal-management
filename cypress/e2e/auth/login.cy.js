import { faker } from "@faker-js/faker";

describe("Login - API & Authentication", () => {
    before(() => {
        cy.clearAllCookies();
    });

    it("should authenticate programmatically via Supabase API", () => {
        cy.env(["TEST_EMAIL", "TEST_PASSWORD"]).then(
            ({ TEST_EMAIL, TEST_PASSWORD }) => {
                cy.task("getSupabaseSession", {
                    email: TEST_EMAIL,
                    password: TEST_PASSWORD,
                }).then((session) => {
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
            },
        );
    });

    it("should redirect unauthenticated user to login", () => {
        cy.disableBypass();
        cy.visit("/main/landing", { failOnStatusCode: false });
        cy.url().should("include", "/login");
    });

    it("should redirect root '/' to login when unauthenticated", () => {
        cy.clearAllCookies();
        cy.visit("/", { failOnStatusCode: false });
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

    it("should have non-expired token", () => {
        cy.login();

        cy.getSession().then((session) => {
            expect(session).to.not.be.null;
            const now = Math.floor(Date.now() / 1000);
            expect(session.expires_at).to.be.greaterThan(now);
            cy.log(`✅ Token expires at: ${new Date(session.expires_at * 1000).toISOString()}`);
        });
    });

    it("should store session user email matching TEST_EMAIL", () => {
        cy.env(["TEST_EMAIL"]).then(({ TEST_EMAIL }) => {
            cy.login();

            cy.getSession().then((session) => {
                expect(session).to.not.be.null;
                expect(session.user.email).to.equal(TEST_EMAIL);
                cy.log(`✅ User email matches: ${session.user.email}`);
            });
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

    it("should clear session data from localStorage on clearAuth", () => {
        cy.login();
        cy.visit("/");

        cy.window().then((win) => {
            expect(win.localStorage.getItem("cypress-session")).to.not.be.null;
        });

        cy.clearAuth();

        cy.window().then((win) => {
            expect(win.localStorage.getItem("cypress-session")).to.be.null;
            expect(win.localStorage.getItem("cypress-access-token")).to.be.null;
        });
    });

    it("should access protected route with bypass", () => {
        cy.loginWithBypass();

        cy.env(["CYPRESS_AUTH_SECRET"]).then(({ CYPRESS_AUTH_SECRET }) => {
            cy.getCookie("cypress-bypass").then((cookie) => {
                expect(cookie).to.not.be.null;
                expect(cookie.value).to.equal(CYPRESS_AUTH_SECRET);
            });
        });

        cy.visit("/main/landing");

        cy.url().should("include", "/main/landing");
        cy.url().should("not.include", "/login");
        cy.get("body").should("be.visible");
    });

    it("should redirect to landing when authenticated and visiting root '/'", () => {
        cy.loginWithBypass();
        cy.visit("/");
        cy.url().should("include", "/main/landing");
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

describe("Login - Auth Callback - Desktop Interactions", () => {
    beforeEach(() => {
        cy.viewport(1920, 1080);
    });

    it("should redirect to login when callback code cannot be exchanged", () => {
        // The code exchange happens server-side (SSR), so a fake code will fail
        // the Supabase exchange and redirect to /login?error=auth_failed
        cy.visit("/auth/v1/callback?code=mock-oauth-code-12345", {
            failOnStatusCode: false,
        });

        cy.url({ timeout: 10000 }).should("include", "/login");
        cy.url().should("include", "error=auth_failed");
    });

    it("should redirect to landing when callback receives no code", () => {
        // No code param → callback skips exchange → redirects to /main/landing
        // Middleware then redirects unauthenticated user to /login
        cy.visit("/auth/v1/callback", { failOnStatusCode: false });

        cy.url().should("include", "/login");
    });

    it("should redirect to login with error param on invalid code", () => {
        cy.visit("/auth/v1/callback?code=invalid-code", {
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

        cy.url().should("include", "/main/landing");

        cy.reload();

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

    it("should redirect to login when callback code cannot be exchanged", () => {
        cy.visit("/auth/v1/callback?code=mock-oauth-code-12345", {
            failOnStatusCode: false,
        });

        cy.url({ timeout: 10000 }).should("include", "/login");
        cy.url().should("include", "error=auth_failed");
    });

    it("should redirect to landing when callback receives no code", () => {
        cy.visit("/auth/v1/callback", { failOnStatusCode: false });

        cy.url().should("include", "/login");
    });

    it("should redirect to login with error param on invalid code", () => {
        cy.visit("/auth/v1/callback?code=invalid-code", {
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

        cy.url().should("include", "/main/landing");

        cy.reload();

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

    it("should redirect to login when callback code cannot be exchanged", () => {
        cy.visit("/auth/v1/callback?code=mock-oauth-code-12345", {
            failOnStatusCode: false,
        });

        cy.url({ timeout: 10000 }).should("include", "/login");
        cy.url().should("include", "error=auth_failed");
    });

    it("should redirect to landing when callback receives no code", () => {
        cy.visit("/auth/v1/callback", { failOnStatusCode: false });

        cy.url().should("include", "/login");
    });

    it("should redirect to login with error param on invalid code", () => {
        cy.visit("/auth/v1/callback?code=invalid-code", {
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

        cy.url().should("include", "/main/landing");

        cy.reload();

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
