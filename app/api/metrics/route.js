import { NextResponse } from "next/server";
import { getListTrade } from "@/lib/services/trade/getListTrade";
import { getListSettings } from "@/lib/services/settings/getListSettings";
import { toast } from "sonner";
import calcChange from "@/lib/utils/calcChange";
import calcChangePercent from "@/lib/utils/calcChange";

export async function GET() {
    try {
        // =========================
        // 1. Fetch Settings
        // =========================
        const settingsData = await getListSettings();
        const initialMargin = Number(settingsData.initial_margin || 0);
        const biSharpeRatio = Number(settingsData.bi_risk_free_rate || 0);
        const personalSharpeRatio = Number(
            settingsData.personal_risk_free_rate || 0
        );

        // =========================
        // 2. Fetch Trades
        // =========================
        const trades = await getListTrade();

        // =========================
        // 3. Core PNL & Trade Stats
        // =========================
        let pnl = 0; // total PNL across all trades
        let winCount = 0;
        let loseCount = 0;
        const profits = []; // store positive trades
        const losses = []; // store negative trades
        const realizedGains = []; // all trade results for std dev

        trades.forEach((t) => {
            const realizedGain = Number(t.realized_gain || 0);
            pnl += realizedGain;
            realizedGains.push(realizedGain);

            if (realizedGain > 0) {
                winCount++;
                profits.push(realizedGain);
            } else if (realizedGain < 0) {
                loseCount++;
                losses.push(realizedGain);
            }
        });

        const totalTrade = trades.length;
        const avgPnl =
            totalTrade > 0 ? parseFloat((pnl / totalTrade).toFixed(2)) : 0;
        const winRate =
            totalTrade > 0
                ? parseFloat(((winCount / totalTrade) * 100).toFixed(2))
                : 0;
        const loseRate =
            totalTrade > 0
                ? parseFloat(((loseCount / totalTrade) * 100).toFixed(2))
                : 0;

        // =========================
        // 4. Balance & Growth
        // =========================
        const tradingBalance = initialMargin + pnl;

        // Find the most recent trade date
        const tradeDates = trades.map((t) => new Date(t.trade_date));
        const latestDate = tradeDates.length
            ? new Date(Math.max(...tradeDates))
            : null;

        // Apakah ada trade di "hari ini"
        const today = new Date();
        const hasTodayTrade = trades.some(
            (t) =>
                new Date(t.trade_date).toDateString() === today.toDateString()
        );

        // Calculate balance until yesterday (exclude today’s trades)
        let prevBalance = initialMargin;
        let prevPnlTotal = 0;
        let prevAvgPnl = 0;

        if (latestDate) {
            const tradesUntilYesterday = trades.filter(
                (t) =>
                    new Date(t.trade_date).toDateString() !==
                    latestDate.toDateString()
            );

            prevPnlTotal = tradesUntilYesterday.reduce(
                (acc, t) => acc + Number(t.realized_gain || 0),
                0
            );
            prevBalance = initialMargin + prevPnlTotal;
            prevAvgPnl =
                tradesUntilYesterday.length > 0
                    ? prevPnlTotal / tradesUntilYesterday.length
                    : 0;
        }

        // =========================
        // 4b. Change Percent (hanya valid kalau ada trade hari ini)
        // =========================
        const balanceChangePercent = calcChangePercent(
            prevBalance,
            tradingBalance,
            hasTodayTrade
        );
        const pnlChangePercent = calcChangePercent(
            prevPnlTotal,
            pnl,
            hasTodayTrade
        );
        const avgPnlChangePercent = calcChangePercent(
            prevAvgPnl,
            avgPnl,
            hasTodayTrade
        );

        // Portfolio growth since initial margin
        const portfolioGrowth =
            initialMargin > 0
                ? Math.ceil(
                      ((tradingBalance - initialMargin) / initialMargin) *
                          100 *
                          100
                  ) / 100
                : 0;

        // =========================
        // 5. Average Return (only positive trades)
        // =========================
        const positiveReturnTrades = trades.filter(
            (t) => parseFloat(t.return_percent?.replace("%", "")) > 0
        );
        const avgReturn =
            positiveReturnTrades.length > 0
                ? positiveReturnTrades.reduce(
                      (acc, t) =>
                          acc + parseFloat(t.return_percent.replace("%", "")),
                      0
                  ) / positiveReturnTrades.length
                : 0;

        // =========================
        // 6. Profit & Loss Breakdown
        // =========================
        const biggestProfit = profits.length > 0 ? Math.max(...profits) : 0;
        const lowestProfit = profits.length > 0 ? Math.min(...profits) : 0;
        const totalProfit = profits.reduce((a, b) => a + b, 0);
        const avgProfit =
            profits.length > 0
                ? parseFloat((totalProfit / profits.length).toFixed(2))
                : 0;

        const biggestLoss =
            losses.length > 0 ? Math.abs(Math.min(...losses)) : 0;
        const lowestLoss =
            losses.length > 0 ? Math.abs(Math.max(...losses)) : 0;
        const totalLoss =
            losses.length > 0 ? Math.abs(losses.reduce((a, b) => a + b, 0)) : 0;
        const avgLoss =
            losses.length > 0
                ? Math.abs(parseFloat((totalLoss / losses.length).toFixed(2)))
                : 0;

        // =========================
        // 7. Profit Factor (Profit ÷ Loss)
        // =========================
        const profitFactor =
            totalLoss !== 0
                ? totalProfit / Math.abs(totalLoss)
                : totalProfit > 0
                ? Infinity
                : 0;
        let profitFactorComment = "";
        if (profitFactor < 1)
            profitFactorComment =
                "❌ Your losses are bigger than your profits (PF < 1)";
        else if (profitFactor < 1.5)
            profitFactorComment =
                "⚠️ You are making profit, but not strong yet (PF 1.0–1.5)";
        else
            profitFactorComment =
                "✅ Great! Your profits are much bigger than your losses (PF ≥ 1.5 🚀)";

        // =========================
        // 8. Payoff Ratio (Avg Profit ÷ Avg Loss)
        // =========================
        const payoffRatio = avgProfit / avgLoss;
        let payoffComment = "";
        if (payoffRatio >= 2)
            payoffComment =
                "🔥 Excellent! Your average profit is more than 2x your average loss (healthy risk-reward).";
        else if (payoffRatio >= 1)
            payoffComment =
                "✅ Good! Average profit per win is higher than average loss per loss. Keep it consistent.";
        else
            payoffComment =
                "⚠️ Caution! Average profit per win is smaller than average loss per loss. Review your strategy.";

        // =========================
        // 9. Expectation & Standard Deviation
        // =========================
        const avgExpectation =
            realizedGains.length > 0
                ? realizedGains.reduce((acc, g) => acc + g, 0) /
                  realizedGains.length
                : 0;

        // Helper: Standard deviation (population)
        function stdDev(values) {
            if (!values.length) return 0;
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance =
                values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
                values.length;
            return Math.sqrt(variance);
        }

        const stdDeviation = stdDev(realizedGains);
        const stdDeviationRatio = avgPnl !== 0 ? stdDeviation / avgPnl : 0;
        const stdDeviationComment =
            stdDeviationRatio > 1
                ? `⚠️ Std Dev is ${stdDeviationRatio.toFixed(
                      2
                  )}x higher than average PNL. Reduce it ≤ 1 for consistency.`
                : `✅ Stable! Std Dev/Mean = ${stdDeviationRatio.toFixed(
                      2
                  )}x. Keep consistency.`;

        // =========================
        // 10. Sharpe Ratio
        // =========================
        const sharpeBI =
            stdDeviation > 0
                ? (avgReturn - biSharpeRatio / 100) / stdDeviationRatio
                : 0;
        const sharpePersonal =
            stdDeviation > 0
                ? (avgReturn - personalSharpeRatio / 100) / stdDeviationRatio
                : 0;
        const sharpeComment = (ratio) => {
            if (ratio < 1) return "⚠️ Not efficient (Sharpe < 1)";
            if (ratio < 2) return "✅ Decent (Sharpe 1-2)";
            return "🚀 Excellent (Sharpe > 2)";
        };

        // =========================
        // X. Compare Latest vs Previous Trade
        // =========================

        // Sort trades by date ascending
        const sortedTrades = trades.sort(
            (a, b) => new Date(a.trade_date) - new Date(b.trade_date)
        );

        let prevTrade = null;
        let latestTrade = null;

        if (sortedTrades.length >= 2) {
            prevTrade = sortedTrades[sortedTrades.length - 2];
            latestTrade = sortedTrades[sortedTrades.length - 1];
        }

        let balanceComparePercent = 0;
        let pnlComparePercent = 0;
        let avgPnlComparePercent = 0;

        if (prevTrade && latestTrade) {
            // Hitung total PNL sampai prev & latest
            const pnlUntilPrev = trades
                .filter(
                    (t) =>
                        new Date(t.trade_date) <= new Date(prevTrade.trade_date)
                )
                .reduce((acc, t) => acc + Number(t.realized_gain || 0), 0);

            const pnlUntilLatest = trades
                .filter(
                    (t) =>
                        new Date(t.trade_date) <=
                        new Date(latestTrade.trade_date)
                )
                .reduce((acc, t) => acc + Number(t.realized_gain || 0), 0);

            const balanceAtPrev = initialMargin + pnlUntilPrev;
            const balanceAtLatest = initialMargin + pnlUntilLatest;

            const tradesUntilPrev = trades.filter(
                (t) => new Date(t.trade_date) <= new Date(prevTrade.trade_date)
            );
            const tradesUntilLatest = trades.filter(
                (t) =>
                    new Date(t.trade_date) <= new Date(latestTrade.trade_date)
            );

            const avgPnlAtPrev =
                tradesUntilPrev.length > 0
                    ? pnlUntilPrev / tradesUntilPrev.length
                    : 0;
            const avgPnlAtLatest =
                tradesUntilLatest.length > 0
                    ? pnlUntilLatest / tradesUntilLatest.length
                    : 0;

            // % Compare (latest vs prev)
            balanceComparePercent =
                balanceAtPrev > 0
                    ? parseFloat(
                          (
                              ((balanceAtLatest - balanceAtPrev) /
                                  balanceAtPrev) *
                              100
                          ).toFixed(2)
                      )
                    : 0;

            pnlComparePercent =
                pnlUntilPrev !== 0
                    ? parseFloat(
                          (
                              ((pnlUntilLatest - pnlUntilPrev) /
                                  Math.abs(pnlUntilPrev)) *
                              100
                          ).toFixed(2)
                      )
                    : 0;

            avgPnlComparePercent =
                avgPnlAtPrev !== 0
                    ? parseFloat(
                          (
                              ((avgPnlAtLatest - avgPnlAtPrev) /
                                  Math.abs(avgPnlAtPrev)) *
                              100
                          ).toFixed(2)
                      )
                    : 0;
        }

        // =========================
        // Comfort Zone
        // =========================

        const moe = Number(settingsData.margin_of_error || 0);

        const suggestedSL = avgLoss;
        const suggestedTP = avgLoss * Math.max(1.5, payoffRatio);

        const adjustedSL = suggestedSL - suggestedSL * (moe / 100);
        const adjustedTP = suggestedTP - suggestedTP * (moe / 100);

        const timesToZeroAdjusted =
            pnl > 0 && adjustedSL > 0 ? Math.floor(pnl / adjustedSL) : 0;

        const timesToZeroSuggested =
            pnl > 0 && suggestedSL > 0 ? Math.floor(pnl / suggestedSL) : 0;

        // =========================
        // Comfort Zone Compare & Change
        // =========================
        let suggestedSLCompare = 0;
        let adjustedSLCompare = 0;
        let suggestedTPCompare = 0;
        let adjustedTPCompare = 0;
        let timesToZeroSuggestedCompare = 0;
        let timesToZeroAdjustedCompare = 0;

        if (prevTrade) {
            // Hitung avgLoss, payoffRatio, dll sampai prevTrade
            const tradesUntilPrev = trades.filter(
                (t) => new Date(t.trade_date) <= new Date(prevTrade.trade_date)
            );

            const prevLosses = tradesUntilPrev
                .map((t) => Number(t.realized_gain || 0))
                .filter((g) => g < 0);
            const prevAvgLoss =
                prevLosses.length > 0
                    ? Math.abs(
                          prevLosses.reduce((a, b) => a + b, 0) /
                              prevLosses.length
                      )
                    : 0;

            const prevProfits = tradesUntilPrev
                .map((t) => Number(t.realized_gain || 0))
                .filter((g) => g > 0);
            const prevAvgProfit =
                prevProfits.length > 0
                    ? prevProfits.reduce((a, b) => a + b, 0) /
                      prevProfits.length
                    : 0;

            const prevPayoffRatio =
                prevAvgLoss > 0 ? prevAvgProfit / prevAvgLoss : 0;

            suggestedSLCompare = parseFloat(prevAvgLoss.toFixed(2));
            suggestedTPCompare = parseFloat(
                (prevAvgLoss * Math.max(1.5, prevPayoffRatio)).toFixed(2)
            );
            adjustedSLCompare = parseFloat(
                (suggestedSLCompare - suggestedSLCompare * (moe / 100)).toFixed(
                    2
                )
            );
            adjustedTPCompare = parseFloat(
                (suggestedTPCompare - suggestedTPCompare * (moe / 100)).toFixed(
                    2
                )
            );

            const prevPnlTotal = tradesUntilPrev.reduce(
                (acc, t) => acc + Number(t.realized_gain || 0),
                0
            );

            timesToZeroSuggestedCompare =
                prevPnlTotal > 0 && suggestedSLCompare > 0
                    ? Math.floor(prevPnlTotal / suggestedSLCompare)
                    : 0;

            timesToZeroAdjustedCompare =
                prevPnlTotal > 0 && adjustedSLCompare > 0
                    ? Math.floor(prevPnlTotal / adjustedSLCompare)
                    : 0;
        }

        const suggestedSLChange = calcChange(
            suggestedSLCompare,
            suggestedSL,
            hasTodayTrade
        );
        const adjustedSLChange = calcChange(
            adjustedSLCompare,
            adjustedSL,
            hasTodayTrade
        );
        const suggestedTPChange = calcChange(suggestedTPCompare, suggestedTP);
        const adjustedTPChange = calcChange(adjustedTPCompare, adjustedTP);
        const timesToZeroSuggestedChange = calcChange(
            timesToZeroSuggestedCompare,
            timesToZeroSuggested
        );
        const timesToZeroAdjustedChange = calcChange(
            timesToZeroAdjustedCompare,
            timesToZeroAdjusted
        );

        // =========================
        // 11. Return Data (JSON)
        // =========================
        return NextResponse.json({
            success: true,
            data: {
                // Settings
                initialMargin,
                biSharpeRatio,
                personalSharpeRatio,

                // Balance & PNL
                tradingBalance,
                balanceChangePercent,
                balanceComparePercent,
                pnl,
                pnlChangePercent,
                pnlComparePercent,
                avgPnl,
                avgPnlChangePercent,
                avgPnlComparePercent,
                portfolioGrowth,

                // Trade Stats
                avgReturn,
                totalTrade,
                winCount,
                loseCount,
                winRate,
                loseRate,

                // Profit & Loss Breakdown
                biggestProfit,
                lowestProfit,
                totalProfit,
                avgProfit,
                biggestLoss,
                lowestLoss,
                totalLoss,
                avgLoss,

                // Profitability Ratios
                profitFactor,
                profitFactorComment,
                payoffRatio,
                payoffComment,

                // Risk & Expectation
                avgExpectation,
                stdDeviation,
                stdDeviationRatio,
                stdDeviationComment,

                // Sharpe Ratios
                sharpeBI,
                sharpeBIComment: sharpeComment(sharpeBI),
                sharpePersonal,
                sharpePersonalComment: sharpeComment(sharpePersonal),

                // Comfort Zone
                suggestedSL,
                suggestedSLCompare,
                suggestedSLChange,
                suggestedTP,
                suggestedTPCompare,
                suggestedTPChange,
                adjustedSL,
                adjustedSLCompare,
                adjustedSLChange,
                adjustedTP,
                adjustedTPCompare,
                adjustedTPChange,
                timesToZeroSuggested,
                timesToZeroSuggestedCompare,
                timesToZeroSuggestedChange,
                timesToZeroAdjusted,
                timesToZeroAdjustedCompare,
                timesToZeroAdjustedChange,
            },
        });
    } catch (err) {
        toast.error("Error fetching metrics:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
