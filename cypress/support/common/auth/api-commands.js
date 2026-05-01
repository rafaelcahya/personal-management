/**
 * ============================================================================
 * API TESTING COMMANDS - Supabase Authentication
 * ============================================================================
 *
 * Commands untuk API testing dengan cookie-based authentication.
 *
 * SETUP:
 * - Tambahkan di cypress/support/e2e.js: import './api-commands'
 * - Set env vars: TEST_EMAIL, TEST_PASSWORD, SUPABASE_PROJECT_REF
 *
 * USAGE PATTERNS:
 *
 * 1. Single Test (Auto Auth):
 *    cy.apiRequest("GET", "/api/endpoint")
 *
 * 2. Multiple Tests (Reuse Session - RECOMMENDED):
 *    before(() => cy.setupApiAuthCookies())
 *    cy.apiRequestWithSession("GET", "/api/endpoint")
 *
 * 3. Unauthenticated:
 *    cy.apiRequestNoAuth("GET", "/api/endpoint")
 * ============================================================================
 */

/**
 * Get Supabase access token
 *
 * @param {string} email - Optional email (default: TEST_EMAIL env)
 * @param {string} password - Optional password (default: TEST_PASSWORD env)
 * @returns {string} Access token
 *
 * @example
 * cy.getApiAuthToken().then((token) => {
 *     cy.log(`Token: ${token}`)
 * })
 */
Cypress.Commands.add("getApiAuthToken", (email, password) => {
    cy.env(["TEST_EMAIL", "TEST_PASSWORD"]).then(
        ({ TEST_EMAIL, TEST_PASSWORD }) => {
            const testEmail = email || TEST_EMAIL;
            const testPassword = password || TEST_PASSWORD;

            if (!testEmail || !testPassword) {
                throw new Error(
                    "TEST_EMAIL and TEST_PASSWORD must be configured",
                );
            }

            return cy
                .task("getSupabaseSession", {
                    email: testEmail,
                    password: testPassword,
                })
                .then((session) => {
                    if (!session || !session.access_token) {
                        throw new Error(
                            `Failed to get auth token for ${testEmail}`,
                        );
                    }

                    return session.access_token;
                });
        },
    );
});

/**
 * Setup authentication cookies (mimics browser behavior)
 * Use in before() hook untuk optimal performance
 *
 * @param {string} email - Optional email
 * @param {string} password - Optional password
 * @returns {object} Supabase session
 *
 * @example
 * before(() => {
 *     cy.setupApiAuthCookies()
 * })
 */
let cachedSession = null;
let cacheExpiry = null;

Cypress.Commands.add("setupApiAuthCookies", (email, password) => {
    cy.env(["TEST_EMAIL", "TEST_PASSWORD", "SUPABASE_PROJECT_REF"]).then(
        ({ TEST_EMAIL, TEST_PASSWORD, SUPABASE_PROJECT_REF }) => {
            const testEmail = email || TEST_EMAIL;
            const testPassword = password || TEST_PASSWORD;

            if (!testEmail || !testPassword) {
                throw new Error(
                    "TEST_EMAIL and TEST_PASSWORD must be configured",
                );
            }

            const now = Date.now() / 1000;
            if (cachedSession && cacheExpiry && now < cacheExpiry - 60) {
                cy.log("♻️ Reusing cached session");
                const projectRef = SUPABASE_PROJECT_REF || "default";
                return cy.setCookie(
                    `sb-${projectRef}-auth-token`,
                    JSON.stringify(cachedSession),
                    {
                        path: "/",
                        httpOnly: false,
                        secure: false,
                        sameSite: "lax",
                    },
                );
            }

            const tryGetSession = (attempt = 1) => {
                return cy
                    .task("getSupabaseSession", {
                        email: testEmail,
                        password: testPassword,
                    })
                    .then((session) => {
                        if (!session && attempt < 3) {
                            cy.log(
                                `⚠️ Session attempt ${attempt} failed, retrying...`,
                            );
                            cy.wait(1000 * attempt);
                            return tryGetSession(attempt + 1);
                        }

                        if (!session) {
                            throw new Error(
                                `Failed to get session for ${testEmail} after 3 attempts`,
                            );
                        }

                        cachedSession = {
                            access_token: session.access_token,
                            refresh_token: session.refresh_token,
                            expires_at: session.expires_at,
                            expires_in: session.expires_in,
                            token_type: "bearer",
                            user: session.user,
                        };
                        cacheExpiry = session.expires_at;

                        const projectRef = SUPABASE_PROJECT_REF || "default";
                        return cy.setCookie(
                            `sb-${projectRef}-auth-token`,
                            JSON.stringify(cachedSession),
                            {
                                path: "/",
                                httpOnly: false,
                                secure: false,
                                sameSite: "lax",
                            },
                        );
                    });
            };

            return tryGetSession();
        },
    );
});

/**
 * Make authenticated API request (auto setup session)
 * Slower - use apiRequestWithSession() for better performance
 *
 * @param {string} method - HTTP method (GET, POST, PUT, DELETE, PATCH)
 * @param {string} url - API endpoint
 * @param {object} options - Request options
 * @param {string} options.email - Custom email
 * @param {string} options.password - Custom password
 * @param {object} options.body - Request body
 * @param {object} options.qs - Query string params
 * @param {object} options.headers - Custom headers
 * @returns {object} Cypress response
 *
 * @example
 * cy.apiRequest("GET", "/api/trades").then((res) => {
 *     expect(res.status).to.eq(200)
 * })
 *
 * cy.apiRequest("POST", "/api/trade", {
 *     body: { ticker: "AAPL" }
 * })
 */
Cypress.Commands.add("apiRequest", (method, url, options = {}) => {
    return cy.setupApiAuthCookies(options.email, options.password).then(() => {
        return cy.request({
            method,
            url,
            body: options.body,
            qs: options.qs,
            headers: options.headers,
            followRedirect: options.followRedirect ?? false,
            failOnStatusCode: options.failOnStatusCode ?? false,
        });
    });
});

/**
 * Make authenticated API request (reuse existing session)
 * RECOMMENDED for multiple tests - much faster than apiRequest()
 *
 * Must call setupApiAuthCookies() in before() hook first
 *
 * @param {string} method - HTTP method
 * @param {string} url - API endpoint
 * @param {object} options - Request options (same as apiRequest)
 * @returns {object} Cypress response
 *
 * @example
 * describe("Tests", () => {
 *     before(() => cy.setupApiAuthCookies())
 *
 *     it("test 1", () => {
 *         cy.apiRequestWithSession("GET", "/api/endpoint1")
 *     })
 *
 *     it("test 2", () => {
 *         cy.apiRequestWithSession("GET", "/api/endpoint2")
 *     })
 * })
 */
Cypress.Commands.add("apiRequestWithSession", (method, url, options = {}) => {
    cy.env(["TEST_EMAIL"]).then(({ TEST_EMAIL }) => {
        const email = options.email || TEST_EMAIL;
        const sessionKey = `api-session-${email}`;

        // Check if session was already set up for this email (Cypress.env, not the key string itself)
        if (Cypress.env(sessionKey)) {
            return cy.request({
                method,
                url,
                body: options.body,
                qs: options.qs,
                headers: options.headers,
                followRedirect: options.followRedirect ?? false,
                failOnStatusCode: options.failOnStatusCode ?? false,
            });
        }

        return cy
            .setupApiAuthCookies(options.email, options.password)
            .then(() => {
                Cypress.env(sessionKey, true);

                return cy.request({
                    method,
                    url,
                    body: options.body,
                    qs: options.qs,
                    headers: options.headers,
                    followRedirect: options.followRedirect ?? false,
                    failOnStatusCode: options.failOnStatusCode ?? false,
                });
            });
    });
});

/**
 * Make unauthenticated API request
 * For testing auth/authorization or public endpoints
 *
 * @param {string} method - HTTP method
 * @param {string} url - API endpoint
 * @param {object} options - Request options (no email/password)
 * @returns {object} Cypress response
 *
 * @example
 * // Test unauthorized access
 * cy.apiRequestNoAuth("GET", "/api/protected").then((res) => {
 *     expect(res.status).to.eq(401)
 * })
 *
 * // Test public endpoint
 * cy.apiRequestNoAuth("GET", "/api/public")
 */
Cypress.Commands.add("apiRequestNoAuth", (method, url, options = {}) => {
    return cy.request({
        method,
        url,
        body: options.body,
        qs: options.qs,
        headers: options.headers,
        followRedirect: options.followRedirect ?? false,
        failOnStatusCode: options.failOnStatusCode ?? false,
    });
});

/**
 * Setup API auth and store token in env
 * Alternative to setupApiAuthCookies()
 *
 * @param {string} email - Optional email
 * @param {string} password - Optional password
 * @returns {string} Access token
 *
 * @example
 * before(() => {
 *     cy.setupApiAuth()
 * })
 *
 * it("test", () => {
 *     const token = Cypress.env("API_AUTH_TOKEN")
 * })
 */
Cypress.Commands.add("setupApiAuth", (email, password) => {
    cy.env(["TEST_EMAIL", "TEST_PASSWORD"]).then(
        ({ TEST_EMAIL, TEST_PASSWORD }) => {
            const testEmail = email || TEST_EMAIL;
            const testPassword = password || TEST_PASSWORD;

            return cy.getApiAuthToken(testEmail, testPassword).then((token) => {
                Cypress.env("API_AUTH_TOKEN", token);
                cy.log("✅ API Auth setup complete");
                return token;
            });
        },
    );
});


/**
 * Clear all authentication data
 * Use in afterEach() or before testing unauthenticated scenarios
 *
 * @example
 * afterEach(() => {
 *     cy.clearApiAuth()
 * })
 *
 * it("test unauth", () => {
 *     cy.clearApiAuth()
 *     // Now no authentication
 * })
 */
Cypress.Commands.add("clearApiAuth", () => {
    cy.clearCookies();

    const email = Cypress.env("TEST_EMAIL");
    if (email) {
        Cypress.env(`api-session-${email}`, null);
    }
});