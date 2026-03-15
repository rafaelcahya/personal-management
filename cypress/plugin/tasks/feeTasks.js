import {
    getSingleFeeFromDb,
    getFeesFromDb,
    getTotalFeesFromDb,
    getTotalFeesPaidFromDb,
} from "../../support/db/trading/fee/feeDb.js";

export const feeTasks = (supabaseAdmin) => ({
    async getSingleFeeFromDb({ feeId, userId }) {
        return getSingleFeeFromDb(supabaseAdmin, feeId, userId);
    },

    async getFeesFromDb({ userId }) {
        return getFeesFromDb(supabaseAdmin, userId);
    },

    async getTotalFeesFromDb({ userId }) {
        return getTotalFeesFromDb(supabaseAdmin, userId);
    },

    async getTotalFeesPaidFromDb({ userId }) {
        return getTotalFeesPaidFromDb(supabaseAdmin, userId);
    },
});
