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
import { getFeeFromDb } from "./cypress/support/db/fee/getFeeFromDb";
import { getEventFromDb } from "./cypress/support/db/event/getEventFromDb";
import {
    getRandomTradeId,
    saveTradeId,
    getRandomFeeId,
    saveFeeId,
    getRandomEventId,
    saveEventId,
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
                async getProgressOverviewSummaryFromDb(metric) {
                    const progressOverviews =
                        await getProgressOverviewSummaryFromDb(
                            supabase,
                            metric
                        );
                    return progressOverviews;
                },
                async getTotalStockTypeFromDb(stockType) {
                    const stockTypes = await getTotalStockTypeFromDb(
                        supabase,
                        stockType
                    );
                    return stockTypes;
                },
                async getTotalEntrySessionFromDb(entrySession) {
                    const entrySessions = await getTotalEntrySessionFromDb(
                        supabase,
                        entrySession
                    );
                    return entrySessions;
                },
                async getTotalEntryOccasionFromDb(entryOccasion) {
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
                async getEventFromDbTask(eventId) {
                    const event = await getEventFromDb(supabase, eventId);
                    return event ? JSON.parse(JSON.stringify(event)) : null;
                },
                saveTradeId(tradeId) {
                    return saveTradeId(tradeId);
                },
                getRandomTradeId() {
                    return getRandomTradeId();
                },
                saveFeeId(feeId) {
                    return saveFeeId(feeId);
                },
                getRandomFeeId() {
                    return getRandomFeeId();
                },
                saveEventId(eventId) {
                    return saveEventId(eventId);
                },
                getRandomEventId() {
                    return getRandomEventId();
                },
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
