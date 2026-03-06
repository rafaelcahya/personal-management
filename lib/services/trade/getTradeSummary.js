import { createClient } from "@/lib/supabase/server";
import { getTradeList } from "@/lib/services/trade/getTradeList";
import { stringToNumber } from "@/lib/utils/common";

export async function getTradeSummary(userId) {
    if (!userId) throw new Error("User ID is required");

    const trades = await getTradeList(userId);

    const totalTrades = Array.isArray(trades) ? trades.length : 0;

    const realizedGains = Array.isArray(trades)
        ? trades.map((trade) => stringToNumber(trade.realized_gain))
        : [];

    const totalWins = realizedGains.filter((g) => g > 0).length;
    const totalLosses = realizedGains.filter((g) => g < 0).length;

    const stockTypeSummary = trades.reduce((acc, trade) => {
        const type = trade.stock_type_option;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const entrySessionSummary = trades.reduce((acc, trade) => {
        const type = trade.entry_session_option;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    const entryOccasionSummary = trades.reduce((acc, trade) => {
        const type = trade.entry_occasion_option;
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {});

    return {
        totalTrades,
        totalWins,
        totalLosses,
        stockTypeSummary,
        entrySessionSummary,
        entryOccasionSummary,
    };
}
