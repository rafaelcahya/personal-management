"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    Wallet,
    TrendingUp,
    Target,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import StatCard from "../../../../../components/ui/common/StatCard";
import WinRateCircle from "../../../../../components/ui/common/WinRateCircle";
import SkeletonGrid from "../../../../../components/ui/common/SkeletonGrid";

export default function OverviewSection({ metrics, loading }) {
    if (loading) {
        return <SkeletonGrid count={4} />;
    }

    if (!metrics || metrics.totalTrades === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                            <Activity className="size-8 text-slate-400" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-lg mb-1">
                                No Trading Data Yet
                            </h3>
                            <p className="text-sm text-slate-500">
                                Start adding trades to see your performance
                                metrics
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
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
    } = metrics;

    return (
        <div className="space-y-6">
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                            <ArrowDownRight className="size-5" />
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
                    subtitle={`${winCount} wins / ${loseCount} losses`}
                    color="blue"
                />

                <StatCard
                    title="Total Trades"
                    value={totalTrades}
                    format="number"
                    icon={<Activity className="size-5" />}
                    subtitle={`Avg P/L: Rp ${averagePnL.toLocaleString("id-ID")}`}
                    color="amber"
                />
            </div>

            {/* Detailed Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Win/Loss Circles */}
                <Card className="lg:col-span-2">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-6 flex items-center gap-2">
                            <Target className="size-5 text-violet-600" />
                            Win/Loss Distribution
                        </h3>
                        <div className="grid grid-cols-2 gap-6">
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
                    </CardContent>
                </Card>

                {/* Capital Overview */}
                <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
                    <CardContent className="p-6">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Wallet className="size-5 text-violet-600" />
                            Capital Overview
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-xs text-slate-500 mb-1">
                                    Initial Margin
                                </p>
                                <p className="text-xl font-bold text-slate-700">
                                    Rp {initialMargin?.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="h-px bg-violet-200" />
                            <div>
                                <p className="text-xs text-slate-500 mb-1">
                                    Current Value
                                </p>
                                <p className="text-2xl font-bold text-violet-600">
                                    Rp {accountValue?.toLocaleString("id-ID")}
                                </p>
                            </div>
                            <div className="h-px bg-violet-200" />
                            <div>
                                <p className="text-xs text-slate-500 mb-1">
                                    Total Growth
                                </p>
                                <div className="flex items-center gap-2">
                                    <p
                                        className={`text-xl font-bold ${portfolioGrowth >= 0 ? "text-green-600" : "text-red-600"}`}
                                    >
                                        {portfolioGrowth >= 0 ? "+" : ""}
                                        {portfolioGrowth}%
                                    </p>
                                    {portfolioGrowth >= 0 ? (
                                        <ArrowUpRight className="size-5 text-green-600" />
                                    ) : (
                                        <ArrowDownRight className="size-5 text-red-600" />
                                    )}
                                </div>
                            </div>
                            <div className="pt-2 text-xs text-slate-400">
                                📅 Tracking since Aug 07, 2025
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
