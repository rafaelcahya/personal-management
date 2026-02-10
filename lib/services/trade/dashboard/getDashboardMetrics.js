import { createClient } from "@/lib/supabase/server";

export async function getDashboardMetrics() {
    const supabase = await createClient();

    try {
        // Get user trades
        const { data: trades, error: tradesError } = await supabase
            .from("trade_list")
            .select("*")
            .order("trade_date", { ascending: true });

        if (tradesError) throw tradesError;

        if (!trades || trades.length === 0) {
            return getEmptyMetrics();
        }

        // Calculate all metrics
        const metrics = calculateMetrics(trades);

        return metrics;
    } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
        throw new Error(error.message);
    }
}

function calculateMetrics(trades) {
    const totalTrades = trades.length;
    const wins = trades.filter((t) => Number(t.realized_gain) > 0);
    const losses = trades.filter((t) => Number(t.realized_gain) < 0);

    const winCount = wins.length;
    const loseCount = losses.length;
    const winRate =
        totalTrades > 0 ? ((winCount / totalTrades) * 100).toFixed(1) : 0;
    const loseRate =
        totalTrades > 0 ? ((loseCount / totalTrades) * 100).toFixed(1) : 0;

    // Calculate profits
    const profits = wins.map((t) => Number(t.realized_gain));
    const totalProfit = profits.reduce((sum, val) => sum + val, 0);
    const avgProfit = winCount > 0 ? totalProfit / winCount : 0;
    const biggestProfit = profits.length > 0 ? Math.max(...profits) : 0;
    const lowestProfit = profits.length > 0 ? Math.min(...profits) : 0;

    // Calculate losses
    const lossValues = losses.map((t) => Number(t.realized_gain));
    const totalLoss = lossValues.reduce((sum, val) => sum + val, 0);
    const avgLoss = loseCount > 0 ? totalLoss / loseCount : 0;
    const biggestLoss = lossValues.length > 0 ? Math.min(...lossValues) : 0;
    const lowestLoss = lossValues.length > 0 ? Math.max(...lossValues) : 0;

    // Portfolio metrics
    const initialMargin = Number(trades[0]?.margin || 0);
    const pnl = trades.reduce(
        (sum, t) => sum + Number(t.realized_gain || 0),
        0,
    );
    const accountValue = initialMargin + pnl;
    const portfolioGrowth =
        initialMargin > 0 ? ((pnl / initialMargin) * 100).toFixed(2) : 0;
    const averagePnL = totalTrades > 0 ? pnl / totalTrades : 0;

    // Risk metrics
    const profitFactor =
        Math.abs(totalLoss) > 0
            ? (totalProfit / Math.abs(totalLoss)).toFixed(2)
            : 0;
    const payoffRatio =
        Math.abs(avgLoss) > 0 ? (avgProfit / Math.abs(avgLoss)).toFixed(2) : 0;

    // Sharpe ratios (simplified - customize based on your formula)
    const biSharpeRatio = 6; // BI rate assumption
    const personalSharpeRatio = 10; // Personal target

    const returns = trades.map((t) => Number(t.realized_gain));
    const avgReturn =
        returns.reduce((sum, val) => sum + val, 0) / returns.length;
    const variance =
        returns.reduce((sum, val) => sum + Math.pow(val - avgReturn, 2), 0) /
        returns.length;
    const stdDevRupiah = Math.sqrt(variance);

    const sharpeBI =
        stdDevRupiah > 0
            ? (
                  (avgReturn - (biSharpeRatio / 100) * avgReturn) /
                  stdDevRupiah
              ).toFixed(2)
            : 0;
    const sharpePersonal =
        stdDevRupiah > 0
            ? (
                  (avgReturn - (personalSharpeRatio / 100) * avgReturn) /
                  stdDevRupiah
              ).toFixed(2)
            : 0;

    // Safe zones (TP/SL suggestions)
    const marginOfError = 0.1; // 10% margin
    const safeZoneAvgProfitWithoutMoe = avgProfit;
    const safeZoneAvgProfitWithMoe = avgProfit * (1 + marginOfError);
    const safeZoneAvgLossWithoutMoe = avgLoss;
    const safeZoneAvgLossWithMoe = avgLoss * (1 - marginOfError);

    const timesToZeroWithoutMoe =
        safeZoneAvgLossWithoutMoe !== 0
            ? Math.abs(Math.floor(accountValue / safeZoneAvgLossWithoutMoe))
            : 0;
    const timesToZeroWithMoe =
        safeZoneAvgLossWithMoe !== 0
            ? Math.abs(Math.floor(accountValue / safeZoneAvgLossWithMoe))
            : 0;

    // Comments
    const profitFactorComment = getProfitFactorComment(profitFactor);
    const payoffComment = getPayoffComment(payoffRatio);
    const sharpeBIComment = getSharpeComment(sharpeBI);
    const sharpePersonalComment = getSharpeComment(sharpePersonal);
    const stdDevComment = getStdDevComment(stdDevRupiah);

    return {
        initialMargin,
        accountValue,
        biSharpeRatio,
        personalSharpeRatio,
        portfolioGrowth: Number(portfolioGrowth),
        pnl,
        averagePnL,
        totalTrades,
        winCount,
        loseCount,
        winRate: Number(winRate),
        loseRate: Number(loseRate),
        biggestProfit,
        lowestProfit,
        totalProfit,
        avgProfit,
        biggestLoss,
        lowestLoss,
        totalLoss,
        avgLoss,
        profitFactor: Number(profitFactor),
        profitFactorComment,
        payoffRatio: Number(payoffRatio),
        payoffComment,
        sharpeBI: Number(sharpeBI),
        sharpePersonal: Number(sharpePersonal),
        sharpeBIComment,
        sharpePersonalComment,
        avgReturn,
        stdDevRupiah,
        stdDevComment,
        safeZoneAvgProfitWithoutMoe,
        safeZoneAvgProfitWithMoe,
        safeZoneAvgLossWithoutMoe,
        safeZoneAvgLossWithMoe,
        timesToZeroWithoutMoe,
        timesToZeroWithMoe,
    };
}

function getProfitFactorComment(value) {
    if (value >= 2) return "Excellent";
    if (value >= 1.5) return "Good";
    if (value >= 1) return "Acceptable";
    return "Needs Improvement";
}

function getPayoffComment(value) {
    if (value >= 2) return "Strong";
    if (value >= 1.5) return "Good";
    if (value >= 1) return "Fair";
    return "Weak";
}

function getSharpeComment(value) {
    if (value >= 2) return "Excellent";
    if (value >= 1) return "Good";
    if (value >= 0) return "Fair";
    return "Poor";
}

function getStdDevComment(value) {
    if (value < 100000) return "Low Volatility";
    if (value < 500000) return "Moderate Volatility";
    return "High Volatility";
}

function getEmptyMetrics() {
    return {
        initialMargin: 0,
        accountValue: 0,
        biSharpeRatio: 6,
        personalSharpeRatio: 10,
        portfolioGrowth: 0,
        pnl: 0,
        averagePnL: 0,
        totalTrades: 0,
        winCount: 0,
        loseCount: 0,
        winRate: 0,
        loseRate: 0,
        biggestProfit: 0,
        lowestProfit: 0,
        totalProfit: 0,
        avgProfit: 0,
        biggestLoss: 0,
        lowestLoss: 0,
        totalLoss: 0,
        avgLoss: 0,
        profitFactor: 0,
        profitFactorComment: "No Data",
        payoffRatio: 0,
        payoffComment: "No Data",
        sharpeBI: 0,
        sharpePersonal: 0,
        sharpeBIComment: "No Data",
        sharpePersonalComment: "No Data",
        avgReturn: 0,
        stdDevRupiah: 0,
        stdDevComment: "No Data",
        safeZoneAvgProfitWithoutMoe: 0,
        safeZoneAvgProfitWithMoe: 0,
        safeZoneAvgLossWithoutMoe: 0,
        safeZoneAvgLossWithMoe: 0,
        timesToZeroWithoutMoe: 0,
        timesToZeroWithMoe: 0,
    };
}
