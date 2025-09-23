import { sum, getPercentageChange } from "@/lib/utils/metrics";
import { stringToNumber } from "@/lib/utils/common";

/**
 * Hitung metrik perubahan untuk Account Value, PNL & Average PNL
 * @param {Array} trades - list trade (unsorted)
 * @param {number} initialMargin - modal awal
 * @returns {Object}
 * {
 *   accountValueChangePercent, accountValueComparePercent,
 *   pnlChangePercent, pnlComparePercent,
 *   avgPnLChangePercent, avgPnLComparePercent
 * }
 */
export function calculateAccountMetrics(trades, initialMargin) {
    if (!Array.isArray(trades) || trades.length <= 1) {
        return {
            accountValueChangePercent: 0,
            accountValueComparePercent: 0,
            pnlChangePercent: 0,
            pnlComparePercent: 0,
            avgPnLChangePercent: 0,
            avgPnLComparePercent: 0,
        };
    }

    // Sort trades by trade_date
    const sortedTrades = [...trades].sort(
        (a, b) => new Date(a.trade_date) - new Date(b.trade_date)
    );

    const latestTrade = sortedTrades[sortedTrades.length - 1];

    // ==== Hitung PNL total ====
    const realizedGains = sortedTrades.map((t) =>
        stringToNumber(t.realized_gain)
    );

    const latestPnL = sum(realizedGains);
    const prevPnL = sum(realizedGains.slice(0, -1));

    // ==== Hitung Average PNL ====
    const latestAvgPnL =
        realizedGains.length > 0
            ? parseFloat((latestPnL / realizedGains.length).toFixed(2))
            : 0;
    const prevAvgPnL =
        realizedGains.length > 1
            ? parseFloat((prevPnL / (realizedGains.length - 1)).toFixed(2))
            : 0;

    // ==== Hitung Account Value ====
    const latestAccountValue = initialMargin + latestPnL;
    const prevAccountValue = initialMargin + prevPnL;

    // Perubahan langsung setelah trade terakhir
    const accountValueChangePercent = getPercentageChange(
        latestAccountValue,
        prevAccountValue
    );
    const pnlChangePercent = getPercentageChange(latestPnL, prevPnL);
    const avgPnLChangePercent = getPercentageChange(latestAvgPnL, prevAvgPnL);

    // ==== Compare % (bandingkan hari sebelum latest dengan hari latest) ====
    let accountValueComparePercent = 0;
    let pnlComparePercent = 0;
    let avgPnLComparePercent = 0;

    const prevTradeDayIndex = [...sortedTrades]
        .reverse()
        .findIndex(
            (t) =>
                new Date(t.trade_date).toDateString() !==
                new Date(latestTrade.trade_date).toDateString()
        );

    if (prevTradeDayIndex !== -1) {
        const prevDayTrades = sortedTrades.slice(
            0,
            sortedTrades.length - prevTradeDayIndex
        );

        const prevDayRealized = prevDayTrades.map((t) =>
            stringToNumber(t.realized_gain)
        );

        const prevDayPnL = sum(prevDayRealized);
        const prevDayAccountValue = initialMargin + prevDayPnL;
        const prevDayAvgPnL =
            prevDayRealized.length > 0
                ? parseFloat((prevDayPnL / prevDayRealized.length).toFixed(2))
                : 0;

        accountValueComparePercent = getPercentageChange(
            latestAccountValue,
            prevDayAccountValue
        );
        pnlComparePercent = getPercentageChange(latestPnL, prevDayPnL);
        avgPnLComparePercent = getPercentageChange(latestAvgPnL, prevDayAvgPnL);
    }

    return {
        accountValueChangePercent,
        accountValueComparePercent,
        pnlChangePercent,
        pnlComparePercent,
        avgPnLChangePercent,
        avgPnLComparePercent,
    };
}
