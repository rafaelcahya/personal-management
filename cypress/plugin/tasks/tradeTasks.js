import {
    getSingleTradeFromDb,
    getTradesFromDb,
    getTotalTradesFromDb,
    getTotalWinsFromDb,
    getTotalLossesFromDb,
    getStockTypeSummaryFromDb,
    getEntrySessionSummaryFromDb,
    getEntryOccasionSummaryFromDb,
} from "../../support/db/trading/trade/tradeDb.js";
import {
    getBuyReasonOptionsFromDb,
    getEntryOccasionOptionsFromDb,
    getEntrySessionOptionsFromDb,
    getStockTypeOptionsFromDb,
    getSellReasonOptionsFromDb,
} from "../../support/db/trading/trade/optionDb.js";

export const tradeTasks = (supabaseAdmin) => ({
    async getSingleTradeFromDb({ tradeId, userId }) {
        return getSingleTradeFromDb(supabaseAdmin, tradeId, userId);
    },

    async getTradesFromDb({ userId }) {
        return getTradesFromDb(supabaseAdmin, userId);
    },

    async getTotalTradesFromDb({ userId }) {
        return getTotalTradesFromDb(supabaseAdmin, userId);
    },

    async getTotalWinsFromDb({ userId }) {
        return getTotalWinsFromDb(supabaseAdmin, userId);
    },

    async getTotalLossesFromDb({ userId }) {
        return getTotalLossesFromDb(supabaseAdmin, userId);
    },

    async getStockTypeSummaryFromDb({ userId }) {
        return getStockTypeSummaryFromDb(supabaseAdmin, userId);
    },

    async getEntrySessionSummaryFromDb({ userId }) {
        return getEntrySessionSummaryFromDb(supabaseAdmin, userId);
    },

    async getEntryOccasionSummaryFromDb({ userId }) {
        return getEntryOccasionSummaryFromDb(supabaseAdmin, userId);
    },

    async getOptionFromDbTask({ optionType, optionId, userId }) {
        const handlers = {
            buyReason: () => getBuyReasonOptionsFromDb(userId, optionId),
            entryOccasion: () =>
                getEntryOccasionOptionsFromDb(userId, optionId),
            entrySession: () => getEntrySessionOptionsFromDb(userId, optionId),
            stockType: () => getStockTypeOptionsFromDb(userId, optionId),
            sellReason: () => getSellReasonOptionsFromDb(userId, optionId),
        };

        if (!handlers[optionType])
            throw new Error(`Unknown option type: ${optionType}`);

        const result = await handlers[optionType]();
        return result ? JSON.parse(JSON.stringify(result)) : null;
    },
});
