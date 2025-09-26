import * as dotenv from "dotenv";
import { defineConfig } from "cypress";
import { createEngine } from "./cypress/support/engine/createEngine";
import { getUserFromDb } from "./cypress/support/db/users/getUserFromDb";

dotenv.config({ path: ".env.local" });

export default defineConfig({
    e2e: {
        setupNodeEvents(on, config) {
            const supabase = createEngine(
                process.env.SUPABASE_URL || config.env.SUPABASE_URL,
                process.env.SUPABASE_SERVICE_ROLE_KEY ||
                    config.env.SUPABASE_SERVICE_ROLE_KEY
            );
            on("task", {
                async getUserFromDbTask(userId) {
                    return await getUserFromDb(supabase, userId);
                },
            });
            return config;
        },
        baseUrl: "http://localhost:3000/",
        env: {
            SUPABASE_URL: process.env.SUPABASE_URL,
            SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
    },
});
