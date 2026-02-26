import * as dotenv from "dotenv";
import { defineConfig } from "cypress";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createEngine } from "./cypress/support/engine/createEngine.js";
import {
    getSingleTradeFromDb,
    getTradesFromDb,
    getTotalTradesFromDb,
    getTotalWinsFromDb,
    getTotalLossesFromDb,
    getStockTypeSummaryFromDb,
    getEntrySessionSummaryFromDb,
    getEntryOccasionSummaryFromDb,
} from "./cypress/support/db/trading/trade/tradeDb.js";
import {
    getBuyReasonOptionsFromDb,
    getEntryOccasionOptionsFromDb,
    getEntrySessionOptionsFromDb,
    getStockTypeOptionsFromDb,
    getSellReasonOptionsFromDb,
} from "./cypress/support/db/trading/trade/optionDb.js";
import {
    getFeeFromDb,
    getTotalFeeFromDb,
    getTotalTransactionsFromDb,
} from "./cypress/support/db/trading/fee/getFeeFromDb.js";
import { getEventFromDb } from "./cypress/support/db/trading/event/getEventFromDb.js";
import {
    getProductListFromDb,
    getTotalProductSummaryFromDb,
} from "./cypress/support/db/inventory/product/getProductListFromDb.js";
import {
    getProductBrandListFromDb,
    getProductBrandSummaryFromDb,
} from "./cypress/support/db/inventory/product/brand/getProductBrandListFromDb.js";
import {
    getProductNameListFromDb,
    getProductNameSummaryFromDb,
} from "./cypress/support/db/inventory/product/name/getProductNameListFromDb.js";
import {
    saveFixture,
    getRandomFixture,
    clearFixtureFile,
} from "./cypress/support/common/helper.js";
import { decryptPassword } from "./lib/utils/decryptedPassword.js";

// Load .env.local BEFORE anything else
dotenv.config({ path: ".env.local" });

// Debug log
console.log("\n=== Cypress Environment Check ===");
console.log(
    "CYPRESS_AUTH_SECRET:",
    process.env.CYPRESS_AUTH_SECRET ? "✓ Loaded" : "✗ Missing",
);
console.log(
    "CYPRESS_TEST_EMAIL:",
    process.env.CYPRESS_TEST_EMAIL ? "✓ Loaded" : "✗ Missing",
);
console.log(
    "SUPABASE_URL:",
    process.env.SUPABASE_URL ? "✓ Loaded" : "✗ Missing",
);
console.log("=================================\n");

export default defineConfig({
    projectId: process.env.CYPRESS_PROJECT_ID,

    e2e: {
        setupNodeEvents(on, config) {
            const supabase = createEngine(
                process.env.SUPABASE_URL || config.env.SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY ||
                    config.env.SUPABASE_SERVICE_ROLE_KEY,
            );

            const supabaseAdmin: SupabaseClient = createClient(
                process.env.SUPABASE_URL || config.env.SUPABASE_URL || "",
                process.env.SUPABASE_SERVICE_ROLE_KEY ||
                    config.env.SUPABASE_SERVICE_ROLE_KEY ||
                    "",
                {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false,
                    },
                },
            );

            on("task", {
                // ============ AUTHENTICATION TASKS ============
                async getSupabaseSession({
                    email,
                    password,
                }: {
                    email: string;
                    password: string;
                }) {
                    try {
                        console.log(`[Auth] Attempting to sign in: ${email}`);

                        const { data, error } =
                            await supabaseAdmin.auth.signInWithPassword({
                                email,
                                password,
                            });

                        if (error) {
                            console.error(
                                "[Auth] Supabase auth error:",
                                error.message,
                            );
                            return null;
                        }

                        if (!data.session) {
                            console.error("[Auth] No session returned");
                            return null;
                        }

                        console.log("[Auth] Session obtained successfully");
                        return data.session;
                    } catch (err: any) {
                        console.error("[Auth] Task failed:", err.message);
                        return null;
                    }
                },

                async createTestUser({
                    email,
                    password,
                    metadata = {},
                }: {
                    email: string;
                    password: string;
                    metadata?: Record<string, any>;
                }) {
                    try {
                        console.log(`[Auth] Creating/checking user: ${email}`);

                        const { data: existingUsers, error: listError } =
                            await supabaseAdmin.auth.admin.listUsers();

                        if (listError) {
                            console.error(
                                "[Auth] List users error:",
                                listError.message,
                            );
                            return null;
                        }

                        const existingUser = existingUsers?.users.find(
                            (u) => u.email === email,
                        );

                        if (existingUser) {
                            console.log(
                                `[Auth] User already exists: ${existingUser.id}`,
                            );
                            return existingUser;
                        }

                        const { data, error } =
                            await supabaseAdmin.auth.admin.createUser({
                                email,
                                password,
                                email_confirm: true,
                                user_metadata: metadata,
                            });

                        if (error) {
                            console.error(
                                "[Auth] Create user error:",
                                error.message,
                            );
                            return null;
                        }

                        console.log(`[Auth] User created: ${data.user?.id}`);
                        return data.user;
                    } catch (err: any) {
                        console.error(
                            "[Auth] Create user failed:",
                            err.message,
                        );
                        return null;
                    }
                },

                log(message: string) {
                    console.log(`[Cypress] ${message}`);
                    return null;
                },

                decryptPasswordTask(encrypted: string) {
                    return decryptPassword(encrypted);
                },

                // ============ DATABASE TASKS ============ //
                // Trading - Trade
                async getSingleTradeFromDb(params: {
                    tradeId: string;
                    userId: string;
                }) {
                    const { tradeId, userId } = params;
                    const trade = await getSingleTradeFromDb(
                        supabaseAdmin,
                        tradeId,
                        userId,
                    );
                    return trade;
                },

                async getTradesFromDb(userId: string) {
                    const trades = await getTradesFromDb(supabaseAdmin, userId);
                    return trades;
                },

                async getTotalTradesFromDb(userId: string) {
                    const total = await getTotalTradesFromDb(
                        supabaseAdmin,
                        userId,
                    );
                    return total;
                },

                async getTotalWinsFromDb(userId: string) {
                    const total = await getTotalWinsFromDb(
                        supabaseAdmin,
                        userId,
                    );
                    return total;
                },

                async getTotalLossesFromDb(userId: string) {
                    const total = await getTotalLossesFromDb(
                        supabaseAdmin,
                        userId,
                    );
                    return total;
                },

                async getStockTypeSummaryFromDb(userId: string) {
                    const summary = await getStockTypeSummaryFromDb(
                        supabaseAdmin,
                        userId,
                    );
                    return summary;
                },

                async getEntrySessionSummaryFromDb(userId: string) {
                    const summary = await getEntrySessionSummaryFromDb(
                        supabaseAdmin,
                        userId,
                    );
                    return summary;
                },

                async getEntryOccasionSummaryFromDb(userId: string) {
                    const summary = await getEntryOccasionSummaryFromDb(
                        supabaseAdmin,
                        userId,
                    );
                    return summary;
                },

                async getOptionFromDbTask(params: {
                    optionType: string;
                    optionId: string;
                    userId: string;
                }) {
                    const { optionType, optionId, userId } = params;

                    let optionData = null;

                    switch (optionType) {
                        case "buyReason":
                            optionData = await getBuyReasonOptionsFromDb(
                                userId,
                                optionId,
                            );
                            break;
                        case "entryOccasion":
                            optionData = await getEntryOccasionOptionsFromDb(
                                userId,
                                optionId,
                            );
                            break;
                        case "entrySession":
                            optionData = await getEntrySessionOptionsFromDb(
                                userId,
                                optionId,
                            );
                            break;
                        case "stockType":
                            optionData = await getStockTypeOptionsFromDb(
                                userId,
                                optionId,
                            );
                            break;
                        case "sellReason":
                            optionData = await getSellReasonOptionsFromDb(
                                userId,
                                optionId,
                            );
                            break;
                        default:
                            throw new Error(
                                `Unknown option type: ${optionType}`,
                            );
                    }

                    return optionData
                        ? JSON.parse(JSON.stringify(optionData))
                        : null;
                },

                async getFeeFromDbTask(feeId: string) {
                    const fee = await getFeeFromDb(supabase, feeId);
                    return fee ? JSON.parse(JSON.stringify(fee)) : null;
                },
                async getTotalTransactionsFromDbTask() {
                    const totalTransactions =
                        await getTotalTransactionsFromDb(supabase);
                    return totalTransactions;
                },
                async getTotalFeeFromDbTask() {
                    const totalFee = await getTotalFeeFromDb(supabase);
                    return totalFee;
                },
                async getEventFromDbTask(eventId: string) {
                    const event = await getEventFromDb(supabase, eventId);
                    return event ? JSON.parse(JSON.stringify(event)) : null;
                },
                async getProductListFromDbTask(productId: string) {
                    const productList = await getProductListFromDb(
                        supabase,
                        productId,
                    );
                    return productList
                        ? JSON.parse(JSON.stringify(productList))
                        : null;
                },
                async getTotalProductSummaryFromDbTask(metric: string) {
                    const totalProdicts = await getTotalProductSummaryFromDb(
                        supabase,
                        metric,
                    );
                    return totalProdicts;
                },
                async getProductBrandListFromDbTask(productBrandId: string) {
                    const productBrandList = await getProductBrandListFromDb(
                        supabase,
                        productBrandId,
                    );
                    return productBrandList
                        ? JSON.parse(JSON.stringify(productBrandList))
                        : null;
                },
                async getProductBrandSummaryFromDbTask() {
                    const productBrandList =
                        await getProductBrandSummaryFromDb(supabase);
                    return productBrandList
                        ? JSON.parse(JSON.stringify(productBrandList))
                        : null;
                },
                async getProductNameListFromDbTask(productNameId: string) {
                    const productNameList = await getProductNameListFromDb(
                        supabase,
                        productNameId,
                    );
                    return productNameList
                        ? JSON.parse(JSON.stringify(productNameList))
                        : null;
                },
                async getProductNameSummaryFromDbTask() {
                    const productBrandList =
                        await getProductNameSummaryFromDb(supabase);
                    return productBrandList
                        ? JSON.parse(JSON.stringify(productBrandList))
                        : null;
                },
                saveFixture: (args: { filename: string; data: any }) =>
                    saveFixture(args.filename, args.data),
                getRandomFixture: (filename: string) =>
                    getRandomFixture(filename),
                saveFeeId: (feeId: string) => saveFixture("feeIds.json", feeId),
                getRandomFeeId: () => getRandomFixture("feeIds.json"),
                saveTradeId: (tradeId: string) =>
                    saveFixture("tradeIds.json", tradeId),
                getRandomTradeId: () => getRandomFixture("tradeIds.json"),
                saveEventId: (eventId: string) =>
                    saveFixture("eventIds.json", eventId),
                getRandomEventId: () => getRandomFixture("eventIds.json"),
                saveProductId: (productId: string) =>
                    saveFixture("productIds.json", productId),
                getRandomProductId: () => getRandomFixture("productIds.json"),
                saveProductBrandId: (productBrandId: string) =>
                    saveFixture("productBrandIds.json", productBrandId),
                getRandomProductNameId: () =>
                    getRandomFixture("productNameIds.json"),
                saveProductNameId: (productNameId: string) =>
                    saveFixture("productNameIds.json", productNameId),
                getRandomProductBrandId: () =>
                    getRandomFixture("productBrandIds.json"),
                clearFixtureFile,
            });

            // IMPORTANT: Merge env vars from process.env to config.env
            config.env = {
                ...config.env,
                SUPABASE_URL: process.env.SUPABASE_URL,
                SUPABASE_SERVICE_ROLE_KEY:
                    process.env.SUPABASE_SERVICE_ROLE_KEY,
                SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                SUPABASE_PROJECT_REF: process.env.SUPABASE_URL
                    ? new URL(process.env.SUPABASE_URL).hostname.split(".")[0]
                    : "",
                TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL,
                TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD,
                CYPRESS_AUTH_SECRET: process.env.CYPRESS_AUTH_SECRET,
            };

            return config;
        },
        baseUrl: "http://localhost:3000",
        env: {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
            SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
            SUPABASE_PROJECT_REF: process.env.SUPABASE_URL
                ? new URL(process.env.SUPABASE_URL).hostname.split(".")[0]
                : "",
            TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL,
            TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD,
            CYPRESS_AUTH_SECRET: process.env.CYPRESS_AUTH_SECRET,
        },
    },

    component: {
        devServer: {
            framework: "next",
            bundler: "webpack",
        },
    },
});
