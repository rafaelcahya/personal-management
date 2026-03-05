import { createClient } from "@/lib/supabase/server";

export async function getDashboardMetrics() {
    const supabase = await createClient();

    try {
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            throw new Error("User not authenticated");
        }

        const [tradesResult, settingsResult] = await Promise.all([
            supabase
                .from("trade_list")
                .select("*")
                .eq("user_id", user.id)
                .is("deleted_at", null)
                .order("trade_date", { ascending: true }),
            supabase
                .from("settings")
                .select("*")
                .eq("user_id", user.id)
                .single(),
        ]);

        if (tradesResult.error) throw tradesResult.error;

        const settings = settingsResult.error
            ? {
                  initial_margin: 0,
                  bi_risk_free_rate: 6,
                  personal_risk_free_rate: 10,
                  margin_of_error: 10,
              }
            : settingsResult.data;

        const initialMargin = Number(settings.initial_margin) || 0;

        const trades = tradesResult.data || [];

        if (trades.length === 0) {
            return getEmptyMetrics(initialMargin, settings);
        }

        const metrics = calculateMetrics(trades, initialMargin, settings);

        return metrics;
    } catch (error) {
        console.error("Failed to fetch dashboard metrics:", error);
        throw new Error(error.message);
    }
}

function calculateMetrics(trades, initialMargin, settings) {
    const totalTrades = trades.length;
    const wins = trades.filter((t) => Number(t.realized_gain) > 0);
    const losses = trades.filter((t) => Number(t.realized_gain) < 0);

    const winCount = wins.length;
    const loseCount = losses.length;
    const winRate =
        totalTrades > 0 ? ((winCount / totalTrades) * 100).toFixed(1) : 0;
    const loseRate =
        totalTrades > 0 ? ((loseCount / totalTrades) * 100).toFixed(1) : 0;

    const profits = wins.map((t) => Number(t.realized_gain));
    const totalProfit = profits.reduce((sum, val) => sum + val, 0);
    const avgProfit = winCount > 0 ? totalProfit / winCount : 0;
    const biggestProfit = profits.length > 0 ? Math.max(...profits) : 0;
    const lowestProfit = profits.length > 0 ? Math.min(...profits) : 0;

    const lossValues = losses.map((t) => Number(t.realized_gain));
    const totalLoss = lossValues.reduce((sum, val) => sum + val, 0);
    const avgLoss = loseCount > 0 ? totalLoss / loseCount : 0;
    const biggestLoss = lossValues.length > 0 ? Math.min(...lossValues) : 0;
    const lowestLoss = lossValues.length > 0 ? Math.max(...lossValues) : 0;

    const pnl = trades.reduce(
        (sum, t) => sum + Number(t.realized_gain || 0),
        0,
    );
    const accountValue = initialMargin + pnl;
    const portfolioGrowth =
        initialMargin > 0 ? ((pnl / initialMargin) * 100).toFixed(2) : 0;
    const averagePnL = totalTrades > 0 ? pnl / totalTrades : 0;

    const profitFactor =
        Math.abs(totalLoss) > 0
            ? (totalProfit / Math.abs(totalLoss)).toFixed(2)
            : 0;
    const payoffRatio =
        Math.abs(avgLoss) > 0 ? (avgProfit / Math.abs(avgLoss)).toFixed(2) : 0;

    const biSharpeRatio = Number(settings.bi_risk_free_rate) || 6;
    const personalSharpeRatio = Number(settings.personal_risk_free_rate) || 10;

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

    const marginOfError = (Number(settings.margin_of_error) || 10) / 100;
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

function getEmptyMetrics(initialMargin, settings) {
    return {
        initialMargin: initialMargin || 0,
        accountValue: initialMargin || 0,
        biSharpeRatio: Number(settings.bi_risk_free_rate) || 6,
        personalSharpeRatio: Number(settings.personal_risk_free_rate) || 10,
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
