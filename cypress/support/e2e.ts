// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./common/commands";
import "./common/auth/ui-commands";
import "./common/auth/api-commands";
import "./common/trade/api-commands";
import "./common/trade/db-commands";
import "./common/fee/commands";
import "./common/event/commands";
import "./common/inventory/product/commands";
import "./common/inventory/product/brand/commands";
import "./common/inventory/product/name/commands";
import "./common/helper";

beforeEach(() => {
    Cypress.session.clearAllSavedSessions();
});

before(() => {
    cy.task("log", "=== Starting Cypress Test Suite ===");
});

afterEach(function () {
    const testTitle = this.currentTest?.title || "Unknown test";
    const testState = this.currentTest?.state || "unknown";
    cy.task("log", `Test "${testTitle}": ${testState}`);
});

