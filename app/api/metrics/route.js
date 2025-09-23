import { NextResponse } from "next/server";
import { getListSettings } from "@/lib/services/settings/getListSettings";
import { getListTrade } from "@/lib/services/trade/getListTrade";
import { sum, getPercentageChange } from "@/lib/utils/metrics";
import { stringToNumber } from "@/lib/utils/common";
import { calculateAccountMetrics } from "@/lib/utils/accountValueMetricsDetails";
import { calculateProfitFactor } from "./component/profitFactor";
import { calculatePayOffRatio } from "./component/payOffRatio";
import { calculateSharpeRatio } from "./component/sharpeRatio";
import { calculateStandardDeviation } from "./component/standardDeviation";
import {
    safeZoneMean,
    safeZoneAvgProfit,
    safeZoneAvgLoss,
} from "./component/safeZone";

export async function GET() {
    try {
        const settingsData = await getListSettings();
        const trades = await getListTrade();
        const initialMargin = Number(settingsData.initial_margin || 0);
        const biSharpeRatio = Number(settingsData.bi_risk_free_rate || 0);
        const moe = Number(settingsData.margin_of_error || 0);
        const personalSharpeRatio = Number(
            settingsData.personal_risk_free_rate || 0
        );

        const realizedGains = Array.isArray(trades)
            ? trades.map((trade) => stringToNumber(trade.realized_gain))
            : [];

        const pnl = sum(realizedGains);

        const accountValue = initialMargin + pnl;

        const portfolioGrowth =
            initialMargin !== 0
                ? parseFloat(((pnl / initialMargin) * 100).toFixed(2))
                : 0;

        const totalTrades = Array.isArray(trades) ? trades.length : 0;

        const averagePnL =
            totalTrades > 0 ? parseFloat((pnl / totalTrades).toFixed(2)) : 0;

        const profitsArr = realizedGains.filter((g) => g > 0);
        const winCount = profitsArr.length;

        const lossesArr = realizedGains.filter((g) => g < 0);
        const loseCount = lossesArr.length;

        const winRate =
            totalTrades > 0
                ? parseFloat(((winCount / totalTrades) * 100).toFixed(2))
                : 0;
        const loseRate =
            totalTrades > 0
                ? parseFloat(((loseCount / totalTrades) * 100).toFixed(2))
                : 0;

        // =========================
        // Profit & Loss Breakdown
        // =========================
        const biggestProfit =
            profitsArr.length > 0 ? Math.max(...profitsArr) : 0;
        const lowestProfit =
            profitsArr.length > 0 ? Math.min(...profitsArr) : 0;
        const totalProfit = profitsArr.reduce((a, b) => a + b, 0);
        const avgProfit =
            profitsArr.length > 0
                ? parseFloat((totalProfit / profitsArr.length).toFixed(2))
                : 0;

        const biggestLoss =
            lossesArr.length > 0 ? Math.abs(Math.min(...lossesArr)) : 0;
        const lowestLoss =
            lossesArr.length > 0 ? Math.abs(Math.max(...lossesArr)) : 0;
        const totalLoss =
            lossesArr.length > 0
                ? Math.abs(lossesArr.reduce((a, b) => a + b, 0))
                : 0;
        const avgLoss =
            lossesArr.length > 0
                ? Math.abs(
                      parseFloat((totalLoss / lossesArr.length).toFixed(2))
                  )
                : 0;

        const {
            accountValueChangePercent,
            accountValueComparePercent,
            pnlChangePercent,
            pnlComparePercent,
            avgPnLChangePercent,
            avgPnLComparePercent,
        } = calculateAccountMetrics(trades, initialMargin);

        const { profitFactor, profitFactorComment } = calculateProfitFactor(
            totalProfit,
            totalLoss
        );

        const { payoffRatio, payoffComment } = calculatePayOffRatio(
            avgProfit,
            avgLoss
        );

        const returnPercents = trades.map((trade) =>
            stringToNumber(trade.return_percent)
        );

        const {
            sharpeBI,
            sharpeBIComment,
            sharpePersonal,
            sharpePersonalComment,
        } = calculateSharpeRatio(
            returnPercents,
            biSharpeRatio,
            personalSharpeRatio
        );

        const { stdDevRupiah, stdDevRatio, stdDevComment } =
            calculateStandardDeviation(realizedGains);

        const { safeZoneWithoutMoe, safeZoneWithMoe } = safeZoneMean(
            realizedGains,
            stdDevRupiah,
            moe
        );

        const { safeZoneAvgProfitWithoutMoe, safeZoneAvgProfitWithMoe } = safeZoneAvgProfit(
            avgProfit,
            moe
        );

        const { safeZoneAvgLossWithoutMoe, safeZoneAvgLossWithMoe } = safeZoneAvgLoss(
            avgLoss,
            moe
        );

        const timesToZeroWithoutMoe = pnl / safeZoneAvgLossWithoutMoe;
        const timesToZeroWithMoe = pnl / safeZoneAvgLossWithMoe;

        // =========================
        // Return JSON
        // =========================
        return NextResponse.json({
            success: true,
            data: {
                initialMargin,
                biSharpeRatio,
                personalSharpeRatio,
                pnl,
                accountValue,
                portfolioGrowth,
                averagePnL,
                accountValueChangePercent,
                accountValueComparePercent,
                pnlChangePercent,
                pnlComparePercent,
                avgPnLChangePercent,
                avgPnLComparePercent,
                totalTrades,
                winCount,
                loseCount,
                winRate,
                loseRate,
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
                sharpeBI,
                sharpeBIComment,
                sharpePersonal,
                sharpePersonalComment,
                stdDevRupiah,
                stdDevRatio,
                stdDevComment,
                safeZoneWithoutMoe,
                safeZoneWithMoe,
                safeZoneAvgProfitWithoutMoe,
                safeZoneAvgProfitWithMoe,
                safeZoneAvgLossWithoutMoe,
                safeZoneAvgLossWithMoe,
                timesToZeroWithoutMoe: timesToZeroWithoutMoe.toFixed(2),
                timesToZeroWithMoe: timesToZeroWithMoe.toFixed(2),
            },
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err?.message || String(err) },
            { status: 500 }
        );
    }
}
