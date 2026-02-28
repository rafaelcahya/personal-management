// cypress/types.d.ts

declare module "cypress-dotenv" {
    function plugin(
        config: Cypress.PluginConfigOptions,
    ): Cypress.PluginConfigOptions;
    export = plugin;
}
