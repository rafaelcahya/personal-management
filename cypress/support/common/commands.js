/**
 * ============================================================================
 * AUTHENTICATION COMMANDS - UI Testing with Supabase
 * ============================================================================
 *
 * Commands untuk UI testing dengan session management & bypass mechanism.
 *
 * SETUP:
 * - Set env vars: TEST_EMAIL, TEST_PASSWORD, CYPRESS_AUTH_SECRET
 * - Implement bypass mechanism di middleware/route
 *
 * USAGE PATTERNS:
 *
 * 1. Standard Login (UI Testing):
 *    cy.login()
 *    cy.visit("/dashboard")
 *
 * 2. Login with Bypass (Skip Auth Checks):
 *    cy.loginWithBypass()
 *    cy.visit("/protected-page")
 *
 * 3. Session Management:
 *    cy.getSession() - Get current session
 *    cy.getAuthToken() - Get access token
 *    cy.clearAuth() - Logout
 *
 * 4. Bypass Control:
 *    cy.enableBypass() - Enable auth bypass
 *    cy.disableBypass() - Disable auth bypass
 * ============================================================================
 */

/**
 * Login user and create persistent session
 * Uses cy.session() for caching across tests and specs
 *
 * Session is stored in localStorage for validation and reuse
 *
 * @param {string} email - Optional email (default: TEST_EMAIL env)
 * @param {string} password - Optional password (default: TEST_PASSWORD env)
 *
 * @example
 * // Login with default test user
 * cy.login()
 * cy.visit("/dashboard")
 *
 * // Login with custom user
 * cy.login("user@example.com", "password123")
 *
 * // Use in beforeEach for consistent auth state
 * beforeEach(() => {
 *     cy.login()
 * })
 */
Cypress.Commands.add("login", (email, password) => {
    cy.env(["TEST_EMAIL", "TEST_PASSWORD"]).then(
        ({ TEST_EMAIL, TEST_PASSWORD }) => {
            const testEmail = email || TEST_EMAIL;
            const testPassword = password || TEST_PASSWORD;

            if (!testEmail || !testPassword) {
                throw new Error(
                    "TEST_EMAIL and TEST_PASSWORD must be configured",
                );
            }

            return cy.session(
                [testEmail, testPassword],
                () => {
                    // retry logic
                    const attemptLogin = (attempt = 1) => {
                        cy.task("getSupabaseSession", {
                            email: testEmail,
                            password: testPassword,
                        }).then((session) => {
                            if (!session && attempt < 3) {
                                cy.log(
                                    `⚠️ Attempt ${attempt} failed, retrying...`,
                                );
                                cy.wait(1000 * attempt);
                                attemptLogin(attempt + 1);
                                return;
                            }

                            if (!session) {
                                throw new Error(
                                    `Failed to get session for ${testEmail} after 3 attempts`,
                                );
                            }

                            cy.log(`✅ Session obtained on attempt ${attempt}`);

                            cy.setCookie(
                                "cypress-session-token",
                                session.access_token,
                                { path: "/", httpOnly: false },
                            );

                            cy.visit("/");
                            cy.window().then((win) => {
                                win.localStorage.setItem(
                                    "cypress-session",
                                    JSON.stringify(session),
                                );
                                win.localStorage.setItem(
                                    "cypress-access-token",
                                    session.access_token,
                                );
                            });
                        });
                    };

                    attemptLogin();
                },
                {
                    cacheAcrossSpecs: true,
                    validate() {
                        cy.getCookie("cypress-session-token").then((cookie) => {
                            if (!cookie || !cookie.value) {
                                throw new Error(
                                    "Session validation failed - no token cookie",
                                );
                            }
                            cy.log("✅ Session validated");
                        });
                    },
                },
            );
        },
    );
});

/**
 * Enable authentication bypass mechanism
 * Sets cookie that your middleware/route can check to skip auth
 *
 * Requires CYPRESS_AUTH_SECRET env var
 *
 * @example
 * cy.enableBypass()
 * cy.visit("/protected-page") // Will bypass auth checks
 *
 * // Use with login for full bypass
 * cy.login()
 * cy.enableBypass()
 */
Cypress.Commands.add("enableBypass", () => {
    cy.env(["CYPRESS_AUTH_SECRET"]).then(({ CYPRESS_AUTH_SECRET }) => {
        if (!CYPRESS_AUTH_SECRET) {
            throw new Error("CYPRESS_AUTH_SECRET not configured in env");
        }

        cy.setCookie("cypress-bypass", CYPRESS_AUTH_SECRET, {
            path: "/",
            httpOnly: false,
            secure: false,
            sameSite: "lax",
        });

        cy.log("✅ Bypass enabled");
    });
});


/**
 * Disable authentication bypass
 * Removes bypass cookie - normal auth checks resume
 *
 * @example
 * cy.disableBypass()
 * cy.visit("/protected-page") // Normal auth required
 *
 * // Test auth behavior after bypass
 * cy.enableBypass()
 * cy.visit("/page")
 * cy.disableBypass()
 * cy.visit("/page") // Should redirect to login
 */
Cypress.Commands.add("disableBypass", () => {
    cy.clearCookie("cypress-bypass");
    cy.log("🗑️ Bypass disabled");
});

/**
 * Get current session object from localStorage
 *
 * @returns {object|null} Supabase session object or null
 *
 * @example
 * cy.getSession().then((session) => {
 *     if (session) {
 *         cy.log(`User: ${session.user.email}`)
 *         cy.log(`Expires: ${session.expires_at}`)
 *     }
 * })
 *
 * // Verify session exists
 * cy.getSession().should("exist")
 *
 * // Access session data
 * cy.getSession().then((session) => {
 *     expect(session.user.email).to.eq("test@example.com")
 * })
 */
Cypress.Commands.add("getSession", () => {
    return cy.window().then((win) => {
        const sessionStr = win.localStorage.getItem("cypress-session");
        if (!sessionStr) {
            cy.log("⚠️  No session found in localStorage");
            return null;
        }

        try {
            return JSON.parse(sessionStr);
        } catch (err) {
            cy.log(`❌ Failed to parse session: ${err.message}`);
            return null;
        }
    });
});

/**
 * Get access token from localStorage
 *
 * @returns {string|null} Access token or null
 *
 * @example
 * cy.getAuthToken().then((token) => {
 *     if (token) {
 *         cy.log(`Token length: ${token.length}`)
 *     }
 * })
 *
 * // Use token for manual API call
 * cy.getAuthToken().then((token) => {
 *     cy.request({
 *         url: "/api/endpoint",
 *         headers: {
 *             Authorization: `Bearer ${token}`
 *         }
 *     })
 * })
 */
Cypress.Commands.add("getAuthToken", () => {
    return cy.window().then((win) => {
        const token = win.localStorage.getItem("cypress-access-token");
        if (!token) {
            cy.log("⚠️  No access token found in localStorage");
            return null;
        }
        return token;
    });
});

/**
 * Clear all authentication data
 * Removes session, tokens, and cookies - equivalent to logout
 *
 * @example
 * // Logout after test
 * afterEach(() => {
 *     cy.clearAuth()
 * })
 *
 * // Test logout flow
 * it("should logout", () => {
 *     cy.login()
 *     cy.visit("/dashboard")
 *     cy.clearAuth()
 *     cy.visit("/dashboard")
 *     cy.url().should("include", "/login")
 * })
 */
Cypress.Commands.add("clearAuth", () => {
    cy.window().then((win) => {
        win.localStorage.removeItem("cypress-session");
        win.localStorage.removeItem("cypress-access-token");
    });
    cy.clearAllCookies();
    cy.log("🗑️  Auth cleared");
});

/**
 * Login user and enable bypass in one command
 * Convenience method for quick authenticated testing
 *
 * @param {string} email - Optional email
 * @param {string} password - Optional password
 *
 * @example
 * // Quick setup for testing protected pages
 * beforeEach(() => {
 *     cy.loginWithBypass()
 * })
 *
 * it("test protected page", () => {
 *     cy.visit("/protected")
 *     // Page loads without auth redirect
 * })
 *
 * // Custom user with bypass
 * cy.loginWithBypass("admin@test.com", "adminpass")
 */
Cypress.Commands.add("loginWithBypass", (email, password) => {
    cy.login(email, password);
    cy.enableBypass();
});
