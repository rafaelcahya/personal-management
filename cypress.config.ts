import * as dotenv from "dotenv";
import { defineConfig } from "cypress";
import { createEngine } from "./cypress/support/engine/createEngine";
import { getUserFromDb } from "./cypress/support/db/users/getUserFromDb";
import { getTradeFromDb } from "./cypress/support/db/trade/getTradeFromDb";
import { getRandomTradeId, saveTradeId } from "./cypress/support/common/helper";
import { decryptPassword } from "./lib/utils/decryptedPassword"

dotenv.config({ path: ".env.local" });

export default defineConfig({
    projectId: 'wjf13y',
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
                saveTradeId(tradeId) {
                    return saveTradeId(tradeId);
                },
                getRandomTradeId() {
                    return getRandomTradeId();
                },
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
