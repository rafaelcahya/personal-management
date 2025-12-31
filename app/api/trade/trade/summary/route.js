import { NextResponse } from "next/server";
import { getListTrade } from "@/lib/services/trade/getListTrade";

import { stringToNumber } from "@/lib/utils/common";

export async function GET() {
    try {
        const trades = await getListTrade();

        const totalTrades = Array.isArray(trades) ? trades.length : 0;

        const realizedGains = Array.isArray(trades)
            ? trades.map((trade) => stringToNumber(trade.realized_gain))
            : [];

        const profitsArr = realizedGains.filter((g) => g > 0);

        const totalWins = profitsArr.length;

        const lossesArr = realizedGains.filter((g) => g < 0);

        const totalLosses = lossesArr.length;

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

        return NextResponse.json({
            success: true,
            data: {
                totalTrades,
                totalWins,
                totalLosses,
                stockTypeSummary,
                entrySessionSummary,
                entryOccasionSummary,
            },
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err?.message || String(err) },
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
