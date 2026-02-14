"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Shield,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    TrendingUpDown,
    Target,
    Activity,
    Gauge,
} from "lucide-react";
import { toast } from "sonner";
import MetricCard from "./component/MetricCard";
import RiskGauge from "./component/RiskGauge";
import SkeletonGrid from "../../../../../components/ui/common/SkeletonGrid";
import RiskStatCard from "./component/RiskStatCard";
import ComparisonCard from "./component/ComparisonCard";
import { getTradeSettings } from "@/lib/api/tradeSettings";

export default function RiskSection({ metrics, loading }) {
    const [config, setConfig] = useState({
        margin_of_error: 10,
    });
    const [configLoading, setConfigLoading] = useState(true);

    useEffect(() => {
        async function fetchConfig() {
            try {
                const settings = await getTradeSettings();
                setConfig({
                    margin_of_error: parseFloat(settings.margin_of_error) || 10,
                });
            } catch (err) {
                console.error("Failed to fetch config:", err);
                toast.error("Failed to load settings");
            } finally {
                setConfigLoading(false);
            }
        }
        fetchConfig();
    }, []);

    if (loading || configLoading) {
        return <SkeletonGrid count={2} />;
    }

    if (!metrics || metrics.totalTrades === 0) {
        return (
            <Card className="border-0 shadow-md shadow-slate-200/50">
                <CardContent className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <Shield className="size-8 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-base mb-1">
                                No Risk Data Available
                            </h3>
                            <p className="text-sm text-slate-500">
                                Add more trades to see risk analysis and
                                suggestions
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const {
        safeZoneAvgProfitWithoutMoe,
        safeZoneAvgProfitWithMoe,
        safeZoneAvgLossWithoutMoe,
        safeZoneAvgLossWithMoe,
        timesToZeroWithoutMoe,
        timesToZeroWithMoe,
        stdDevRupiah,
        stdDevComment,
        accountValue,
        avgProfit,
        avgLoss,
        winRate,
    } = metrics;

    // Calculate additional risk metrics
    const riskPerTrade = Math.abs(safeZoneAvgLossWithMoe);
    const rewardPerTrade = safeZoneAvgProfitWithMoe;
    const riskRewardRatio =
        riskPerTrade > 0 ? (rewardPerTrade / riskPerTrade).toFixed(2) : 0;
    const riskPercentage =
        accountValue > 0 ? ((riskPerTrade / accountValue) * 100).toFixed(2) : 0;
    const maxRiskCapital =
        accountValue > 0 ? Math.floor(accountValue * 0.02) : 0;
    const positionSizing =
        maxRiskCapital > 0 && riskPerTrade > 0
            ? Math.floor(maxRiskCapital / riskPerTrade)
            : 0;

    // Expected value calculation
    const expectedValue =
        (winRate / 100) * avgProfit + ((100 - winRate) / 100) * avgLoss;

    return (
        <div className="space-y-4">
            {/* Risk Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <RiskStatCard
                    label="Risk/Trade"
                    value={`${riskPercentage}%`}
                    subtitle={`Rp ${Math.floor(riskPerTrade).toLocaleString("id-ID")}`}
                    color="red"
                    icon={<AlertTriangle className="size-4" />}
                />
                <RiskStatCard
                    label="R:R Ratio"
                    value={`1:${riskRewardRatio}`}
                    subtitle="Risk vs Reward"
                    color="blue"
                    icon={<Target className="size-4" />}
                />
                <RiskStatCard
                    label="Safe Buffer"
                    value={`${timesToZeroWithMoe}x`}
                    subtitle="Consecutive losses"
                    color="violet"
                    icon={<Shield className="size-4" />}
                />
                <RiskStatCard
                    label="Volatility"
                    value={stdDevComment}
                    subtitle={`σ: Rp ${Math.floor(stdDevRupiah).toLocaleString("id-ID")}`}
                    color="amber"
                    icon={<Activity className="size-4" />}
                />
            </div>

            {/* Risk Overview with Gauge */}
            <Card className="border border-slate-200/50 shadow-slate-100">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 rounded-lg">
                                <Shield className="size-4 text-slate-700" />
                            </div>
                            Risk Assessment
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                            MoE: {config.margin_of_error}%
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <RiskGauge
                        stdDev={stdDevRupiah}
                        comment={stdDevComment}
                        timesToZero={timesToZeroWithMoe}
                    />
                </CardContent>
            </Card>

            {/* TP/SL Suggestions - Compact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Take Profit Card */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <div className="p-1.5 bg-green-100 rounded-lg">
                                    <ArrowUpRight className="size-4 text-green-600" />
                                </div>
                                Take Profit Targets
                            </CardTitle>
                            <Badge variant="success" className="text-xs">
                                Reward
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <MetricCard
                            label="Suggested TP"
                            value={safeZoneAvgProfitWithoutMoe}
                            format="currency"
                            description="Based on average profit"
                            color="green"
                        />
                        <MetricCard
                            label="Conservative TP"
                            value={safeZoneAvgProfitWithMoe}
                            format="currency"
                            description={`With ${config.margin_of_error}% buffer`}
                            color="green"
                            badge="Recommended"
                        />
                        <Separator />
                        <div className="pt-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 font-medium">
                                    Expected Gain
                                </span>
                                <span className="font-bold text-green-600">
                                    +
                                    {(
                                        (rewardPerTrade / accountValue) *
                                        100
                                    ).toFixed(2)}
                                    %
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Stop Loss Card */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <div className="p-1.5 bg-red-100 rounded-lg">
                                    <ArrowDownRight className="size-4 text-red-600" />
                                </div>
                                Stop Loss Levels
                            </CardTitle>
                            <Badge variant="destructive" className="text-xs">
                                Risk
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <MetricCard
                            label="Suggested SL"
                            value={safeZoneAvgLossWithoutMoe}
                            format="currency"
                            description="Based on average loss"
                            color="red"
                        />
                        <MetricCard
                            label="Conservative SL"
                            value={safeZoneAvgLossWithMoe}
                            format="currency"
                            description={`With ${config.margin_of_error}% buffer`}
                            color="red"
                            badge="Recommended"
                        />
                        <Separator />
                        <div className="pt-1">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 font-medium">
                                    Max Risk/Trade
                                </span>
                                <span className="font-bold text-red-600">
                                    -{riskPercentage}%
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Risk Management Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Capital Protection */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <div className="bg-slate-100 p-1.5 rounded-lg">
                                <Shield className="size-4 text-slate-700" />
                            </div>
                            Capital Protection
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between items-center p-2.5 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-lg">
                            <span className="text-xs text-slate-600">
                                Current Capital
                            </span>
                            <span className="text-sm font-bold text-slate-900">
                                Rp{" "}
                                {Math.floor(accountValue).toLocaleString(
                                    "id-ID",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-lg">
                            <span className="text-xs text-slate-600">
                                Max Risk (2% Rule)
                            </span>
                            <span className="text-sm font-bold text-amber-600">
                                Rp {maxRiskCapital.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-lg">
                            <span className="text-xs text-slate-600">
                                Risk per Trade
                            </span>
                            <span className="text-sm font-bold text-red-600">
                                Rp{" "}
                                {Math.floor(riskPerTrade).toLocaleString(
                                    "id-ID",
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-2.5 bg-slate-50 hover:bg-slate-100/80 transition-colors rounded-lg">
                            <span className="text-xs text-slate-600">
                                Suggested Position Size
                            </span>
                            <span className="text-sm font-bold text-blue-600">
                                {positionSizing} lots
                            </span>
                        </div>
                    </CardContent>
                </Card>

                {/* Risk Tolerance */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <div className="bg-slate-100 rounded-lg p-1.5">
                                <Gauge className="size-4 text-slate-700" />
                            </div>
                            Risk Tolerance
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="p-2.5 bg-slate-50 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-slate-600">
                                    Standard Deviation
                                </span>
                                <Badge variant="secondary" className="text-xs">
                                    {stdDevComment}
                                </Badge>
                            </div>
                            <p className="text-sm font-bold text-slate-900">
                                Rp{" "}
                                {Math.floor(stdDevRupiah).toLocaleString(
                                    "id-ID",
                                )}
                            </p>
                        </div>
                        <div className="p-2.5 bg-slate-50 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-slate-600">
                                    Lose Streak Buffer (Base)
                                </span>
                            </div>
                            <p className="text-sm font-bold text-slate-900">
                                {timesToZeroWithoutMoe}x consecutive losses
                            </p>
                        </div>
                        <div className="p-2.5 bg-slate-100 rounded-lg">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-xs text-slate-700 font-medium">
                                    Safe Buffer (Adjusted)
                                </span>
                                <Badge variant="default" className="text-xs">
                                    +{config.margin_of_error}% MoE
                                </Badge>
                            </div>
                            <p className="text-sm font-bold text-slate-900">
                                {timesToZeroWithMoe}x consecutive losses
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Risk vs Reward Comparison */}
            <Card className="border border-slate-200/50 shadow-slate-100">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <div className="bg-slate-100 rounded-lg p-1.5">
                            <TrendingUpDown className="size-4 text-slate-700" />
                        </div>
                        Risk vs Reward Analysis
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {/* Visual R:R Bar */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs text-slate-600">
                                <span>Risk</span>
                                <span className="font-bold text-slate-900">
                                    1:{riskRewardRatio} R:R
                                </span>
                                <span>Reward</span>
                            </div>
                            <div className="h-8 bg-slate-100 rounded-lg overflow-hidden flex">
                                <div
                                    className="bg-red-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: "33.33%" }}
                                >
                                    Risk
                                </div>
                                <div
                                    className="bg-green-500 flex items-center justify-center text-white text-xs font-bold"
                                    style={{ width: "66.67%" }}
                                >
                                    Reward
                                </div>
                            </div>
                        </div>

                        {/* Comparison Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            <ComparisonCard
                                label="Risk/Trade"
                                value={`Rp ${Math.floor(riskPerTrade).toLocaleString("id-ID")}`}
                                percentage={`${riskPercentage}%`}
                                color="red"
                            />
                            <ComparisonCard
                                label="Reward/Trade"
                                value={`Rp ${Math.floor(rewardPerTrade).toLocaleString("id-ID")}`}
                                percentage={`${((rewardPerTrade / accountValue) * 100).toFixed(2)}%`}
                                color="green"
                            />
                            <ComparisonCard
                                label="Win Rate"
                                value={`${winRate}%`}
                                percentage={`${riskRewardRatio} R:R`}
                                color="blue"
                            />
                        </div>

                        {/* Expectancy Calculation */}
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-slate-700 font-medium mb-1">
                                        Expected Value per Trade
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        (Win% × Avg Win) - (Loss% × Avg Loss)
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p
                                        className={`text-lg font-bold ${
                                            expectedValue >= 0
                                                ? "text-green-600"
                                                : "text-red-600"
                                        }`}
                                    >
                                        {expectedValue >= 0 ? "+" : ""}
                                        Rp{" "}
                                        {Math.floor(
                                            expectedValue,
                                        ).toLocaleString("id-ID")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
