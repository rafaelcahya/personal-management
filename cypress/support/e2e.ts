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

import "./common/auth/ui-commands";
import "./common/auth/api-commands";
import "./common/trade/api-commands";
import "./common/trade/db-commands";
import "./common/fee/api-commands";
import "./common/fee/db-commands";
import "./common/event/api-commands";
import "./common/event/db-commands";
import "./common/inventory/product_brand/api-commands";
import "./common/inventory/product_brand/db-commands";
import "./common/inventory/product_name/api-commands";
import "./common/inventory/product_name/db-commands";
import "./common/inventory/product/api-commands";
import "./common/inventory/product/db-commands";
import "./common/inventory/product_stock/api-commands";
import "./common/inventory/product_stock/db-commands";
import "./common/inventory/product_stock_history/api-commands";
import "./common/inventory/product_stock_history/db-commands";
import "./common/running/api/activities/commands";
import "./common/running/db/activities/commands";
import "./common/running/api/dashboard/commands";
import "./common/running/api/gear/commands";
import "./common/running/api/race-log/commands";
import "./common/running/api/goals/commands";
import "./common/running/api/ai-insights/commands";
import "./common/running/api/analytics/commands";
import "./common/running/api/user/commands";
import "./common/running/api/upcoming-races/commands";
import "./common/running/api/injury-ai/commands";
import "./common/running/api/sync/commands";
import "./common/running/api/onboarding/commands";
import "./common/helper";
import "cypress-mochawesome-reporter/register";
import "cypress-real-events";

before(() => {
    cy.task("log", "=== Starting Cypress Test Suite ===");
});

afterEach(function () {
    const testTitle = this.currentTest?.title || "Unknown test";
    const testState = this.currentTest?.state || "unknown";
    cy.task("log", `Test "${testTitle}": ${testState}`);
});
