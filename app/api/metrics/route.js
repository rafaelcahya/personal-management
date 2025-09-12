import { NextResponse } from "next/server";
import { getListTrade } from "@/lib/services/trade/getListTrade";
import { getListSettings } from "@/lib/services/settings/getListSettings";
import { toast } from "sonner";

export async function GET() {
    try {
        // Get initial margin
        const settingsData = await getListSettings();
        const initialMargin = Number(settingsData.initial_margin || 0);
        const biSharpeRatio = Number(settingsData.bi_risk_free_rate || 0);
        const personalSharpeRatio = Number(
            settingsData.personal_risk_free_rate || 0
        );

        // Get all trades
        const trades = await getListTrade();

        // Metrics calculation
        let pnl = 0;
        let winCount = 0;
        let loseCount = 0;
        const profits = [];
        const losses = [];
        const realizedGains = []; // for std dev

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

        // Trading balance and portfolio growth
        const tradingBalance = initialMargin + pnl;
        const portfolioGrowth =
            initialMargin > 0
                ? Math.ceil(
                      ((tradingBalance - initialMargin) / initialMargin) *
                          100 *
                          100
                  ) / 100
                : 0;

        // Only consider trades with positive return percent
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

        // Profit & Loss Breakdown
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

        // Profit Factor
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

        // Payoff Ratio
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

        // --- Average Expectation per Trade ---
        const avgExpectation =
            realizedGains.length > 0
                ? realizedGains.reduce((acc, g) => acc + g, 0) /
                  realizedGains.length
                : 0;

        // --- Standard Deviation calculations ---
        function stdDev(values) {
            if (!values.length) return 0;
            const mean = values.reduce((a, b) => a + b, 0) / values.length;
            const variance =
                values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
                values.length; // population
            return Math.sqrt(variance);
        }

        const stdDeviation = stdDev(realizedGains);
        const stdDeviationRatio = stdDeviation / avgPnl;
        const stdDeviationComment =
            stdDeviationRatio > 1
                ? `⚠️ Standard Deviation is ${stdDeviationRatio.toFixed(
                      2
                  )}x higher than the average profit. Reduce this ratio to ≤ 1 for more consistent trading results.`
                : `✅ Stable ratio! Std Dev/Mean = ${stdDeviationRatio.toFixed(
                      2
                  )}x. Keep maintaining trading consistency.`;

        // Sharpe Ratio formula: (Average Return - Risk-Free Rate) / Std Dev
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
        return NextResponse.json({
            success: true,
            data: {
                initialMargin,
                biSharpeRatio,
                personalSharpeRatio,
                tradingBalance,
                pnl,
                portfolioGrowth,
                avgReturn,
                totalTrade,
                winCount,
                loseCount,
                winRate,
                loseRate,
                avgPnl,
                biggestProfit,
                lowestProfit,
                totalProfit,
                avgProfit,
                biggestLoss,
                lowestLoss,
                totalLoss,
                avgLoss,
                profitFactor,
                profitFactorComment,
                payoffRatio,
                payoffComment,
                avgExpectation,
                stdDeviation,
                stdDeviationRatio,
                stdDeviationComment,
                sharpeBI,
                sharpeBIComment: sharpeComment(sharpeBI),
                sharpePersonal,
                sharpePersonalComment: sharpeComment(sharpePersonal),
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
