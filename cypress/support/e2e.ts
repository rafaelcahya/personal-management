// ***********************************************************
// This example support/e2e.js is processed and
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

import "./common/commands";
import "./common/auth/ui-commands";
import "./common/auth/api-commands";
import "./common/trade/api-commands";
import "./common/trade/db-commands";
import "./common/fee/api-commands";
import "./common/fee/db-commands";
import "./common/event/api-commands";
import "./common/event/db-commands";
import "./common/product_brand/api-commands";
import "./common/product_brand/db-commands";
import "./common/helper";
import "cypress-mochawesome-reporter/register";

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
