Cypress.Commands.add("OpenPersonalManagement", () => {
    cy.visit("/auth/login");
});

Cypress.Commands.add("login", (email, password) => {
    const testEmail = email || Cypress.env("TEST_EMAIL");
    const testPassword = password || Cypress.env("TEST_PASSWORD");

    if (!testEmail || !testPassword) {
        throw new Error("TEST_EMAIL and TEST_PASSWORD must be configured");
    }

    cy.session(
        [testEmail, testPassword],
        () => {
            cy.log(`🔐 Logging in as: ${testEmail}`);

            cy.task("getSupabaseSession", {
                email: testEmail,
                password: testPassword,
            }).then((session) => {
                if (!session) {
                    throw new Error(`Failed to get session for ${testEmail}`);
                }

                // Session is already an object here
                cy.log("✅ Session obtained");
                cy.log(`User ID: ${session.user?.id}`);

                // Store the RAW session object (not encoded yet)
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

                cy.log("✅ Session stored in localStorage");
            });
        },
        {
            cacheAcrossSpecs: true,
            validate() {
                cy.window().then((win) => {
                    const sessionStr =
                        win.localStorage.getItem("cypress-session");
                    if (!sessionStr) {
                        throw new Error(
                            "Session validation failed - no session in localStorage",
                        );
                    }

                    try {
                        const session = JSON.parse(sessionStr);
                        if (!session.access_token) {
                            throw new Error(
                                "Session validation failed - no access token",
                            );
                        }
                        cy.log("✅ Session validated");
                    } catch (err) {
                        throw new Error(
                            `Session validation failed: ${err.message}`,
                        );
                    }
                });
            },
        },
    );
});

Cypress.Commands.add("enableBypass", () => {
    const authSecret = Cypress.env("CYPRESS_AUTH_SECRET");

    if (!authSecret) {
        throw new Error("CYPRESS_AUTH_SECRET not configured in env");
    }

    cy.setCookie("cypress-bypass", authSecret, {
        path: "/",
        httpOnly: false,
        secure: false,
        sameSite: "lax",
    });

    cy.log("✅ Bypass enabled");
});

Cypress.Commands.add("disableBypass", () => {
    cy.clearCookie("cypress-bypass");
    cy.log("🗑️ Bypass disabled");
});

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

Cypress.Commands.add("clearAuth", () => {
    cy.window().then((win) => {
        win.localStorage.removeItem("cypress-session");
        win.localStorage.removeItem("cypress-access-token");
    });
    cy.clearAllCookies();
    cy.log("🗑️  Auth cleared");
});

Cypress.Commands.add("loginWithBypass", (email, password) => {
    cy.login(email, password);
    cy.enableBypass();
});

Cypress.Commands.add("verifyToastMessage", (message) => {
    cy.get("#toast").contains(message).should("be.visible");
});

Cypress.Commands.add("verifyValidationMessage", (id, message) => {
    cy.get(id).contains(message).should("be.visible");
});

Cypress.Commands.add("checkComponentVisible", (selectors) => {
    if (Array.isArray(selectors)) {
        selectors.forEach((selector) => {
            cy.get(selector).should("be.visible");
        });
    } else {
        cy.get(selectors).should("be.visible");
    }
});

Cypress.Commands.add("checkComponentNotVisible", (selectors) => {
    if (Array.isArray(selectors)) {
        selectors.forEach((selector) => {
            cy.get(selector).should("not.exist");
        });
    } else {
        cy.get(selectors).should("not.exist");
    }
});

Cypress.Commands.add("fillField", (fields, value) => {
    if (typeof fields === "string") {
        cy.get(fields).should("be.visible").clear().type(value);
        return cy.wrap(value);
    } else if (typeof fields === "object") {
        const filledValues = {};
        Object.entries(fields).forEach(([selector, value]) => {
            cy.get(selector).should("be.visible").clear().type(value);
            filledValues[selector] = value;
        });
        return cy.wrap(filledValues);
    }
});

Cypress.Commands.add("saveProductId", (productId) => {
    cy.task("saveProductId", productId);
});

Cypress.Commands.add("getRandomProductId", () => {
    return cy.task("getRandomProductId");
});

Cypress.Commands.add("saveEventId", (eventId) => {
    cy.task("saveEventId", eventId);
});

Cypress.Commands.add("getRandomEventId", () => {
    return cy.task("getRandomEventId");
});

Cypress.Commands.add("saveFeeId", (feeId) => {
    cy.task("saveFeeId", feeId);
});

Cypress.Commands.add("getRandomFeeId", () => {
    return cy.task("getRandomFeeId");
});

Cypress.Commands.add("saveTradeId", (tradeId) => {
    cy.task("saveTradeId", tradeId);
});

Cypress.Commands.add("getRandomTradeId", () => {
    return cy.task("getRandomTradeId");
});

Cypress.Commands.add("saveProductBrandId", (productBrandId) => {
    cy.task("saveProductBrandId", productBrandId);
});

Cypress.Commands.add("getRandomProductBrandId", () => {
    return cy.task("getRandomProductBrandId");
});

Cypress.Commands.add("saveProductNameId", (productNameId) => {
    cy.task("saveProductNameId", productNameId);
});

Cypress.Commands.add("getRandomProductNameId", () => {
    return cy.task("getRandomProductNameId");
});
