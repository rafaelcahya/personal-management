"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Shield, Zap } from "lucide-react";
import MetricRow from "../../../../../components/ui/common/MetricRow";
import RatioCard from "../../../../../components/ui/common/RatioCard";
import SkeletonGrid from "../../../../../components/ui/common/SkeletonGrid";

export default function PerformanceSection({ metrics, loading }) {
    if (loading) {
        return <SkeletonGrid count={3} />;
    }

    if (!metrics || metrics.totalTrades === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-slate-500">
                        No performance data available
                    </p>
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
        biSharpeRatio,
        personalSharpeRatio,
    } = metrics;

    return (
        <div className="space-y-6">
            {/* Profit vs Loss Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Profit Card */}
                <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-green-100 rounded-xl">
                                <TrendingUp className="size-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-green-900">
                                    Profit Analysis
                                </h3>
                                <p className="text-xs text-green-600">
                                    Winning trades breakdown
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
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
                            <div className="h-px bg-green-200" />
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
                        </div>
                    </CardContent>
                </Card>

                {/* Loss Card */}
                <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 to-rose-50">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-red-100 rounded-xl">
                                <TrendingDown className="size-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-red-900">
                                    Loss Analysis
                                </h3>
                                <p className="text-xs text-red-600">
                                    Losing trades breakdown
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 pt-2">
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
                            <div className="h-px bg-red-200" />
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
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Performance Ratios */}
            <Card>
                <CardContent className="p-6">
                    <h3 className="font-semibold mb-6 flex items-center gap-2">
                        <Zap className="size-5 text-violet-600" />
                        Performance Ratios & Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <RatioCard
                            icon={<Target className="size-5" />}
                            label="Profit Factor"
                            value={profitFactor}
                            comment={profitFactorComment}
                            threshold={1}
                            description="Total profit divided by total loss"
                        />
                        <RatioCard
                            icon={<Target className="size-5" />}
                            label="Payoff Ratio"
                            value={payoffRatio}
                            comment={payoffComment}
                            threshold={1}
                            description="Average win divided by average loss"
                        />
                        <RatioCard
                            icon={<Shield className="size-5" />}
                            label={`Sharpe Ratio (${biSharpeRatio}%)`}
                            value={sharpeBI}
                            comment={sharpeBIComment}
                            threshold={1}
                            description="Risk-adjusted return vs BI rate"
                        />
                        <RatioCard
                            icon={<Shield className="size-5" />}
                            label={`Personal Ratio (${personalSharpeRatio}%)`}
                            value={sharpePersonal}
                            comment={sharpePersonalComment}
                            threshold={1}
                            description="Risk-adjusted return vs personal target"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
