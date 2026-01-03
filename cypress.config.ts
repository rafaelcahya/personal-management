import * as dotenv from "dotenv";
import { defineConfig } from "cypress";
import { createEngine } from "./cypress/support/engine/createEngine";
import { getUserFromDb } from "./cypress/support/db/users/getUserFromDb";
import {
    getProgressOverviewSummaryFromDb,
    getTotalEntryOccasionFromDb,
    getTotalEntrySessionFromDb,
    getTotalStockTypeFromDb,
    getTradeFromDb,
} from "./cypress/support/db/trade/getTradeFromDb";
import {
    getFeeFromDb,
    getTotalFeeFromDb,
    getTotalTransactionsFromDb,
} from "./cypress/support/db/fee/getFeeFromDb";
import { getEventFromDb } from "./cypress/support/db/event/getEventFromDb";
import {
    getProductListFromDb,
    getTotalProductSummaryFromDb,
} from "./cypress/support/db/inventory/product/getProductListFromDb";
import {
    getProductBrandListFromDb,
    getProductBrandSummaryFromDb,
} from "./cypress/support/db/inventory/product/brand/getProductBrandListFromDb";
import { getProductNameListFromDb } from "./cypress/support/db/inventory/product/name/getProductNameListFromDb";
import {
    saveFixture,
    getRandomFixture,
    clearFixtureFile,
} from "./cypress/support/common/helper";
import { decryptPassword } from "./lib/utils/decryptedPassword";

dotenv.config({ path: ".env.local" });

export default defineConfig({
    projectId: "wjf13y",
    e2e: {
        setupNodeEvents(on, config) {
            const supabase = createEngine(
                process.env.SUPABASE_URL || config.env.SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY ||
                    config.env.SUPABASE_SERVICE_ROLE_KEY
            );
            on("task", {
                decryptPasswordTask(encrypted) {
                    return decryptPassword(encrypted);
                },
                async getUserFromDbTask(userId) {
                    return await getUserFromDb(supabase, userId);
                },
                async getTradeFromDbTask(tradeId) {
                    const trade = await getTradeFromDb(supabase, tradeId);
                    return trade ? JSON.parse(JSON.stringify(trade)) : null;
                },
                async getProgressOverviewSummaryFromDbTask(metric) {
                    const progressOverviews =
                        await getProgressOverviewSummaryFromDb(
                            supabase,
                            metric
                        );
                    return progressOverviews;
                },
                async getTotalStockTypeFromDbTask(stockType) {
                    const stockTypes = await getTotalStockTypeFromDb(
                        supabase,
                        stockType
                    );
                    return stockTypes;
                },
                async getTotalEntrySessionFromDbTask(entrySession) {
                    const entrySessions = await getTotalEntrySessionFromDb(
                        supabase,
                        entrySession
                    );
                    return entrySessions;
                },
                async getTotalEntryOccasionFromDbTask(entryOccasion) {
                    const entryOccasions = await getTotalEntryOccasionFromDb(
                        supabase,
                        entryOccasion
                    );
                    return entryOccasions;
                },
                async getFeeFromDbTask(feeId) {
                    const fee = await getFeeFromDb(supabase, feeId);
                    return fee ? JSON.parse(JSON.stringify(fee)) : null;
                },
                async getTotalTransactionsFromDbTask() {
                    const totalTransactions = await getTotalTransactionsFromDb(
                        supabase
                    );
                    return totalTransactions;
                },
                async getTotalFeeFromDbTask() {
                    const totalFee = await getTotalFeeFromDb(supabase);
                    return totalFee;
                },
                async getEventFromDbTask(eventId) {
                    const event = await getEventFromDb(supabase, eventId);
                    return event ? JSON.parse(JSON.stringify(event)) : null;
                },
                async getProductListFromDbTask(productId) {
                    const productList = await getProductListFromDb(
                        supabase,
                        productId
                    );
                    return productList
                        ? JSON.parse(JSON.stringify(productList))
                        : null;
                },
                async getTotalProductSummaryFromDbTask(metric) {
                    const totalProdicts = await getTotalProductSummaryFromDb(
                        supabase,
                        metric
                    );
                    return totalProdicts;
                },
                async getProductBrandListFromDbTask(productBrandId) {
                    const productBrandList = await getProductBrandListFromDb(
                        supabase,
                        productBrandId
                    );
                    return productBrandList
                        ? JSON.parse(JSON.stringify(productBrandList))
                        : null;
                },
                async getProductBrandSummaryFromDbTask() {
                    const productBrandList = await getProductBrandSummaryFromDb(
                        supabase
                    );
                    return productBrandList
                        ? JSON.parse(JSON.stringify(productBrandList))
                        : null;
                },
                async getProductNameListFromDbTask(productNameId) {
                    const productNameList = await getProductNameListFromDb(
                        supabase,
                        productNameId
                    );
                    return productNameList
                        ? JSON.parse(JSON.stringify(productNameList))
                        : null;
                },
                saveFixture: (args) => saveFixture(args.filename, args.data),
                getRandomFixture: (filename) => getRandomFixture(filename),
                saveFeeId: (feeId) => saveFixture("feeIds.json", feeId),
                getRandomFeeId: () => getRandomFixture("feeIds.json"),
                saveTradeId: (tradeId) => saveFixture("tradeIds.json", tradeId),
                getRandomTradeId: () => getRandomFixture("tradeIds.json"),
                saveEventId: (eventId) => saveFixture("eventIds.json", eventId),
                getRandomEventId: () => getRandomFixture("eventIds.json"),
                saveProductId: (productId) =>
                    saveFixture("productIds.json", productId),
                getRandomProductId: () => getRandomFixture("productIds.json"),
                saveProductBrandId: (productBrandId) =>
                    saveFixture("productBrandIds.json", productBrandId),
                getRandomProductNameId: () =>
                    getRandomFixture("productNameIds.json"),
                saveProductNameId: (productNameId) =>
                    saveFixture("productNameIds.json", productNameId),
                getRandomProductBrandId: () =>
                    getRandomFixture("productBrandIds.json"),
                clearFixtureFile,
            });
            return config;
        },
        baseUrl: "http://localhost:3000",
        env: {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
    },
});
