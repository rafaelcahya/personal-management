"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Wallet,
    TrendingUp,
    TrendingDown,
    Target,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Zap,
    DollarSign,
    BarChart3,
    ArrowRight,
} from "lucide-react";
import StatCard from "./component/StatCard";
import WinRateCircle from "./component/WinRateCircle";
import KPICard from "./component/KPICard";
import SkeletonGrid from "@/components/ui/common/SkeletonGrid";
import EmptyState from "@/components/ui/common/EmptyState";

export default function OverviewSection({ metrics, loading }) {
    if (loading) {
        return <SkeletonGrid count={4} />;
    }

    if (!metrics || metrics.totalTrades === 0) {
        return (
            <EmptyState
                title="No Trading Data Yet"
                description="Start adding trades to see your performance metrics, win rate, and portfolio growth"
            />
        );
    }

    const {
        initialMargin,
        accountValue,
        portfolioGrowth,
        pnl,
        totalTrades,
        winRate,
        loseRate,
        winCount,
        loseCount,
        averagePnL,
        totalProfit,
        totalLoss,
        profitFactor,
        avgProfit,
        avgLoss,
        payoffRatio,
    } = metrics;

    // Calculate net gain
    const netGain = accountValue - initialMargin;

    return (
        <div className="space-y-4">
            {/* Primary Metrics - Clean Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Account Value"
                    value={accountValue}
                    format="currency"
                    icon={<Wallet className="size-5" />}
                    badge={`${portfolioGrowth >= 0 ? "+" : ""}${portfolioGrowth}%`}
                    badgeVariant={
                        portfolioGrowth >= 0 ? "success" : "destructive"
                    }
                    trend={portfolioGrowth >= 0 ? "up" : "down"}
                    color="violet"
                />

                <StatCard
                    title="Total P/L"
                    value={pnl}
                    format="currency"
                    icon={
                        pnl >= 0 ? (
                            <TrendingUp className="size-5" />
                        ) : (
                            <TrendingDown className="size-5" />
                        )
                    }
                    color={pnl >= 0 ? "green" : "red"}
                    badge={pnl >= 0 ? "Profit" : "Loss"}
                    badgeVariant={pnl >= 0 ? "success" : "destructive"}
                />

                <StatCard
                    title="Win Rate"
                    value={`${winRate}%`}
                    icon={<Target className="size-5" />}
                    subtitle={`${winCount}W / ${loseCount}L`}
                    color="blue"
                />

                <StatCard
                    title="Total Trades"
                    value={totalTrades}
                    format="number"
                    icon={<Activity className="size-5" />}
                    subtitle={`Active trading`}
                    color="amber"
                />
            </div>

            {/* Performance Overview - Modern Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Win/Loss Distribution */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 rounded-lg">
                                <Target className="size-4 text-slate-700" />
                            </div>
                            Performance Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-6 mb-4">
                            <WinRateCircle
                                label="Win Rate"
                                count={winCount}
                                percent={winRate}
                                color="#10B981"
                                total={totalTrades}
                            />
                            <WinRateCircle
                                label="Loss Rate"
                                count={loseCount}
                                percent={loseRate}
                                color="#EF4444"
                                total={totalTrades}
                            />
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <div className="p-3 rounded-lg bg-green-50">
                                <p className="text-xs text-green-600 font-medium mb-1">
                                    Avg Win
                                </p>
                                <p className="text-sm font-bold text-green-700">
                                    Rp{" "}
                                    {avgProfit?.toLocaleString("id-ID", {
                                        maximumFractionDigits: 0,
                                    })}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg bg-red-50">
                                <p className="text-xs text-red-600 font-medium mb-1">
                                    Avg Loss
                                </p>
                                <p className="text-sm font-bold text-red-700">
                                    Rp{" "}
                                    {Math.abs(avgLoss || 0).toLocaleString(
                                        "id-ID",
                                        {
                                            maximumFractionDigits: 0,
                                        },
                                    )}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Capital & Growth */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <CardTitle className="text-sm flex items-center gap-2">
                            <div className="p-1.5 bg-slate-100 rounded-lg">
                                <Wallet className="size-4 text-slate-700" />
                            </div>
                            Capital & Growth
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {/* Initial vs Current */}
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">
                                    Initial Margin
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                    Rp {initialMargin?.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <ArrowRight className="size-4 text-slate-400" />
                            <div className="text-right">
                                <p className="text-xs text-slate-500 mb-1">
                                    Current Value
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                    Rp {accountValue?.toLocaleString("id-ID")}
                                </p>
                            </div>
                        </div>

                        {/* Net Gain */}
                        <div className="p-3 bg-slate-50 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-xs text-slate-600 font-medium">
                                    Net Gain
                                </p>
                                <Badge
                                    variant={
                                        netGain >= 0 ? "success" : "destructive"
                                    }
                                    className="text-xs"
                                >
                                    {portfolioGrowth >= 0 ? "+" : ""}
                                    {portfolioGrowth}%
                                </Badge>
                            </div>
                            <div className="flex items-baseline gap-2">
                                <p
                                    className={`text-lg font-bold ${netGain >= 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                    {netGain >= 0 ? "+" : ""}Rp{" "}
                                    {netGain?.toLocaleString("id-ID")}
                                </p>
                                {netGain >= 0 ? (
                                    <ArrowUpRight className="size-4 text-green-600" />
                                ) : (
                                    <ArrowDownRight className="size-4 text-red-600" />
                                )}
                            </div>
                        </div>

                        {/* Average P/L & Payoff Ratio */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-2.5 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">
                                    Avg P/L
                                </p>
                                <p
                                    className={`text-sm font-bold ${averagePnL >= 0 ? "text-green-600" : "text-red-600"}`}
                                >
                                    Rp{" "}
                                    {averagePnL?.toLocaleString("id-ID", {
                                        maximumFractionDigits: 0,
                                    })}
                                </p>
                            </div>
                            <div className="p-2.5 bg-slate-50 rounded-lg">
                                <p className="text-xs text-slate-500 mb-1">
                                    Payoff Ratio
                                </p>
                                <p className="text-sm font-bold text-slate-900">
                                    {payoffRatio?.toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Key Performance Indicators */}
            <Card className="border border-slate-200/50 shadow-slate-100">
                <CardHeader>
                    <CardTitle className="text-sm flex items-center gap-2">
                        <div className="p-1.5 bg-slate-100 rounded-lg">
                            <Zap className="size-4 text-slate-700" />
                        </div>
                        Key Performance Indicators
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <KPICard
                            icon={<DollarSign className="size-4" />}
                            label="Total Profit"
                            value={`Rp ${totalProfit?.toLocaleString("id-ID", {
                                maximumFractionDigits: 0,
                            })}`}
                            color="green"
                        />
                        <KPICard
                            icon={<TrendingDown className="size-4" />}
                            label="Total Loss"
                            value={`Rp ${Math.abs(totalLoss)?.toLocaleString(
                                "id-ID",
                                {
                                    maximumFractionDigits: 0,
                                },
                            )}`}
                            color="red"
                        />
                        <KPICard
                            icon={<BarChart3 className="size-4" />}
                            label="Profit Factor"
                            value={profitFactor?.toFixed(2)}
                            color="blue"
                            badge={metrics.profitFactorComment}
                        />
                        <KPICard
                            icon={<Target className="size-4" />}
                            label="Best Streak"
                            value={`${winCount} wins`}
                            color="violet"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
