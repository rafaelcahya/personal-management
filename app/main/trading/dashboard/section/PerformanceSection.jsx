"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    TrendingUp,
    TrendingDown,
    Target,
    Shield,
    Zap,
    BarChart3,
    Activity,
} from "lucide-react";
import { toast } from "sonner";
import MetricRow from "./component/MetricRow";
import RatioCard from "./component/RatioCard";
import SkeletonGrid from "../../../../../components/ui/common/SkeletonGrid";
import EfficiencyCard from "./component/EfficiencyCard";
import { getTradeSettings } from "@/lib/api/tradeSettings";

export default function PerformanceSection({ metrics, loading }) {
    const [config, setConfig] = useState({
        bi_risk_free_rate: 0,
        personal_risk_free_rate: 0,
        margin_of_error: 10,
    });
    const [configLoading, setConfigLoading] = useState(true);

    useEffect(() => {
        async function fetchConfig() {
            try {
                const settings = await getTradeSettings();
                setConfig({
                    bi_risk_free_rate:
                        parseFloat(settings.bi_risk_free_rate) || 0,
                    personal_risk_free_rate:
                        parseFloat(settings.personal_risk_free_rate) || 0,
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
        return <SkeletonGrid count={3} />;
    }

    if (!metrics || metrics.totalTrades === 0) {
        return (
            <Card className="border-0 shadow-md shadow-slate-200/50">
                <CardContent className="p-8 text-center">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <BarChart3 className="size-8 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-base mb-1">
                                No Performance Data
                            </h3>
                            <p className="text-sm text-slate-500">
                                Add trades to see detailed performance analysis
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const {
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
        sharpePersonal,
        sharpeBIComment,
        sharpePersonalComment,
        winCount,
        loseCount,
        totalTrades,
    } = metrics;

    const profitPerTrade =
        totalTrades > 0 ? Math.floor(totalProfit / totalTrades) : 0;
    const lossPerTrade =
        totalTrades > 0 ? Math.floor(Math.abs(totalLoss) / totalTrades) : 0;
    const profitContribution =
        totalProfit + Math.abs(totalLoss) > 0
            ? (
                  (totalProfit / (totalProfit + Math.abs(totalLoss))) *
                  100
              ).toFixed(1)
            : 0;
    const winStreakPotential =
        winCount > 0 ? Math.floor(totalProfit / winCount) : 0;

    return (
        <div className="space-y-4">
            {/* Profit vs Loss Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Profit Card */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <div className="p-1.5 bg-green-100 rounded-lg">
                                    <TrendingUp className="size-4 text-green-600" />
                                </div>
                                Profit Breakdown
                            </CardTitle>
                            <Badge variant="success" className="text-xs">
                                {winCount} Wins
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <MetricRow
                            label="Biggest Win"
                            value={biggestProfit}
                            format="currency"
                            icon="🏆"
                        />
                        <MetricRow
                            label="Smallest Win"
                            value={lowestProfit}
                            format="currency"
                            icon="✨"
                        />
                        <Separator />
                        <MetricRow
                            label="Total Profit"
                            value={totalProfit}
                            format="currency"
                            highlight
                            icon="💰"
                        />
                        <MetricRow
                            label="Average Profit"
                            value={avgProfit}
                            format="currency"
                            icon="📊"
                        />
                        <Separator />
                        <div className="pt-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-600 font-medium">
                                    Per Trade Impact
                                </span>
                                <span className="font-bold text-green-600">
                                    +Rp {profitPerTrade.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Loss Card */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <div className="p-1.5 bg-red-100 rounded-lg">
                                    <TrendingDown className="size-4 text-red-600" />
                                </div>
                                Loss Breakdown
                            </CardTitle>
                            <Badge variant="destructive" className="text-xs">
                                {loseCount} Losses
                            </Badge>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <MetricRow
                            label="Biggest Loss"
                            value={biggestLoss}
                            format="currency"
                            icon="⚠️"
                        />
                        <MetricRow
                            label="Smallest Loss"
                            value={lowestLoss}
                            format="currency"
                            icon="📉"
                        />
                        <Separator />
                        <MetricRow
                            label="Total Loss"
                            value={totalLoss}
                            format="currency"
                            highlight
                            icon="💸"
                        />
                        <MetricRow
                            label="Average Loss"
                            value={avgLoss}
                            format="currency"
                            icon="📊"
                        />
                        <Separator />
                        <div className="pt-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-600 font-medium">
                                    Per Trade Impact
                                </span>
                                <span className="font-bold text-red-600">
                                    -Rp {lossPerTrade.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Ratios */}
            <Card className="border border-slate-200/50 shadow-slate-100">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg">
                            <Zap className="size-4 text-slate-700" />
                        </div>
                        Performance Ratios
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <RatioCard
                            icon={<Target className="size-4" />}
                            label="Profit Factor"
                            value={profitFactor}
                            comment={profitFactorComment}
                            threshold={1}
                            description="Total profit ÷ Total loss"
                        />
                        <RatioCard
                            icon={<Activity className="size-4" />}
                            label="Payoff Ratio"
                            value={payoffRatio}
                            comment={payoffComment}
                            threshold={1}
                            description="Average win ÷ Average loss"
                        />
                        <RatioCard
                            icon={<Shield className="size-4" />}
                            label={`Sharpe (BI ${config.bi_risk_free_rate}%)`}
                            value={sharpeBI}
                            comment={sharpeBIComment}
                            threshold={1}
                            description="Risk-adjusted return vs BI rate"
                        />
                        <RatioCard
                            icon={<Shield className="size-4" />}
                            label={`Personal (${config.personal_risk_free_rate}%)`}
                            value={sharpePersonal}
                            comment={sharpePersonalComment}
                            threshold={1}
                            description="Risk-adjusted vs personal target"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Trade Efficiency */}
            <Card className="border border-slate-200/50 shadow-slate-100">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 rounded-lg">
                                <BarChart3 className="size-4 text-slate-700" />
                            </div>
                            Trade Efficiency Metrics
                        </CardTitle>
                        <Badge variant="outline" className="text-xs">
                            MoE: {config.margin_of_error}%
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <EfficiencyCard
                            label="Avg Profit/Trade"
                            value={`Rp ${profitPerTrade.toLocaleString("id-ID")}`}
                            color="green"
                        />
                        <EfficiencyCard
                            label="Avg Loss/Trade"
                            value={`Rp ${lossPerTrade.toLocaleString("id-ID")}`}
                            color="red"
                        />
                        <EfficiencyCard
                            label="Win Potential"
                            value={`Rp ${winStreakPotential.toLocaleString("id-ID")}`}
                            color="blue"
                            subtitle="Per winning trade"
                        />
                        <EfficiencyCard
                            label="Profit Distribution"
                            value={`${profitContribution}%`}
                            color="violet"
                            subtitle="Of total P/L"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
