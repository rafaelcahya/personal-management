import { defineConfig } from "cypress";
import cypressDotenv from "cypress-dotenv";
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

export default defineConfig({
    projectId: process.env.CYPRESS_PROJECT_ID,

    e2e: {
        setupNodeEvents(on, config) {
            // 1. Load env via cypress-dotenv
            // Di GitHub Actions: baca .env (dibuat dari secrets)
            // Di lokal: baca .env atau .env.local
            const updatedConfig = cypressDotenv(config);

            // 2. Validate env setelah load
            const supabaseUrl = process.env.SUPABASE_URL;
            const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

            console.log("\n=== CYPRESS ENV DEBUG ===");
            console.log(
                "SUPABASE_URL         :",
                supabaseUrl ? "✓" : "✗ MISSING",
            );
            console.log(
                "SERVICE_ROLE_KEY     :",
                serviceKey ? "✓" : "✗ MISSING",
            );
            console.log(
                "NEXT_PUBLIC_SUPABASE :",
                process.env.NEXT_PUBLIC_SUPABASE_URL ? "✓" : "✗ MISSING",
            );
            console.log(
                "CYPRESS_TEST_EMAIL   :",
                process.env.CYPRESS_TEST_EMAIL ? "✓" : "✗ MISSING",
            );
            console.log(
                "CYPRESS_AUTH_SECRET  :",
                process.env.CYPRESS_AUTH_SECRET ? "✓" : "✗ MISSING",
            );
            console.log(
                "CYPRESS_PROJECT_ID   :",
                process.env.CYPRESS_PROJECT_ID ? "✓" : "✗ MISSING",
            );
            console.log("=========================\n");

            if (!supabaseUrl || !serviceKey) {
                throw new Error(
                    `Cypress fail: SUPABASE_URL=${!!supabaseUrl}, SERVICE_ROLE_KEY=${!!serviceKey}`,
                );
            }

            // 3. Init Supabase clients
            const supabase = createEngine(supabaseUrl, serviceKey);

            const supabaseAdmin: SupabaseClient = createClient(
                supabaseUrl,
                serviceKey,
                {
                    auth: {
                        autoRefreshToken: false,
                        persistSession: false,
                    },
                },
            );

            // 4. Register tasks
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
                            console.error("[Auth] Error:", error.message);
                            return null;
                        }
                        if (!data.session) {
                            console.error("[Auth] No session returned");
                            return null;
                        }
                        console.log("[Auth] ✓ Session obtained");
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
                        console.log(`[Auth] ✓ User created: ${data.user?.id}`);
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
                    return await getSingleTradeFromDb(
                        supabaseAdmin,
                        tradeId,
                        userId,
                    );
                },

                async getTradesFromDb(userId: string) {
                    return await getTradesFromDb(supabaseAdmin, userId);
                },

                async getTotalTradesFromDb(userId: string) {
                    return await getTotalTradesFromDb(supabaseAdmin, userId);
                },

                async getTotalWinsFromDb(userId: string) {
                    return await getTotalWinsFromDb(supabaseAdmin, userId);
                },

                async getTotalLossesFromDb(userId: string) {
                    return await getTotalLossesFromDb(supabaseAdmin, userId);
                },

                async getStockTypeSummaryFromDb(userId: string) {
                    return await getStockTypeSummaryFromDb(
                        supabaseAdmin,
                        userId,
                    );
                },

                async getEntrySessionSummaryFromDb(userId: string) {
                    return await getEntrySessionSummaryFromDb(
                        supabaseAdmin,
                        userId,
                    );
                },

                async getEntryOccasionSummaryFromDb(userId: string) {
                    return await getEntryOccasionSummaryFromDb(
                        supabaseAdmin,
                        userId,
                    );
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
                    return await getTotalTransactionsFromDb(supabase);
                },

                async getTotalFeeFromDbTask() {
                    return await getTotalFeeFromDb(supabase);
                },

                async getEventFromDbTask(eventId: string) {
                    const event = await getEventFromDb(supabase, eventId);
                    return event ? JSON.parse(JSON.stringify(event)) : null;
                },

                async getProductListFromDbTask(productId: string) {
                    const result = await getProductListFromDb(
                        supabase,
                        productId,
                    );
                    return result ? JSON.parse(JSON.stringify(result)) : null;
                },

                async getTotalProductSummaryFromDbTask(metric: string) {
                    return await getTotalProductSummaryFromDb(supabase, metric);
                },

                async getProductBrandListFromDbTask(productBrandId: string) {
                    const result = await getProductBrandListFromDb(
                        supabase,
                        productBrandId,
                    );
                    return result ? JSON.parse(JSON.stringify(result)) : null;
                },

                async getProductBrandSummaryFromDbTask() {
                    const result = await getProductBrandSummaryFromDb(supabase);
                    return result ? JSON.parse(JSON.stringify(result)) : null;
                },

                async getProductNameListFromDbTask(productNameId: string) {
                    const result = await getProductNameListFromDb(
                        supabase,
                        productNameId,
                    );
                    return result ? JSON.parse(JSON.stringify(result)) : null;
                },

                async getProductNameSummaryFromDbTask() {
                    const result = await getProductNameSummaryFromDb(supabase);
                    return result ? JSON.parse(JSON.stringify(result)) : null;
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
                getRandomProductBrandId: () =>
                    getRandomFixture("productBrandIds.json"),
                saveProductNameId: (productNameId: string) =>
                    saveFixture("productNameIds.json", productNameId),
                getRandomProductNameId: () =>
                    getRandomFixture("productNameIds.json"),
                clearFixtureFile,
            });

            // 5. Merge env ke config.env
            updatedConfig.env = {
                ...updatedConfig.env,
                SUPABASE_URL: supabaseUrl,
                SUPABASE_SERVICE_ROLE_KEY: serviceKey,
                SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
                SUPABASE_PROJECT_REF: new URL(supabaseUrl).hostname.split(
                    ".",
                )[0],
                TEST_EMAIL: process.env.CYPRESS_TEST_EMAIL,
                TEST_PASSWORD: process.env.CYPRESS_TEST_PASSWORD,
                CYPRESS_AUTH_SECRET: process.env.CYPRESS_AUTH_SECRET,
            };

            return updatedConfig;
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
