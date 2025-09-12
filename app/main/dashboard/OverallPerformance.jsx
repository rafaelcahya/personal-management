"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import MetricValue from "@/components/main/overall-performance/MetricValue";
import CommentedMetric from "@/components/main/overall-performance/CommentedMetric";
import BarStat from "@/components/main/overall-performance/BarStat";
import {
    Blend,
    ChartBarStacked,
    TrendingDown,
    TrendingUp,
    TrendingUpDown,
    Wallet,
} from "lucide-react";
import SkeletonBlock from "../../../components/ui/common/SkeletonBlock";

function OverallPerformance() {
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/metrics")
            .then((r) => r.json())
            .then((d) => {
                if (d.success) setMetrics(d.data);
            })
            .catch(toast.error)
            .finally(() => setLoading(false));
    }, []);

    const {
        initialMargin,
        biSharpeRatio,
        personalSharpeRatio,
        tradingBalance,
        pnl,
        portfolioGrowth,
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
        stdDeviationComment,
        sharpeBI,
        sharpeBIComment,
        sharpePersonal,
        sharpePersonalComment,
    } = metrics || {};

    const commentStyleVal = (val, threshold = 1) =>
        val >= threshold ? "text-emerald-600" : "text-rose-600";

    return (
        <main className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Card className="shadow-black/5 border-none bg-white/70 backdrop-blur-3xl rounded-2xl">
                        <CardContent className="space-y-4 p-6">
                            {loading ? (
                                <SkeletonBlock />
                            ) : (
                                <>
                                    <MetricValue
                                        icon={
                                            <Wallet className="text-purple-600 w-4" />
                                        }
                                        label="Initial Margin"
                                        value={initialMargin}
                                    />
                                    <div className="bg-slate-200 w-full h-px" />
                                    <MetricValue
                                        icon={
                                            <Wallet className="text-purple-600 w-4" />
                                        }
                                        label="Total Trading Balance"
                                        value={tradingBalance}
                                        indicator={portfolioGrowth}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="shadow-black/5 border-none bg-white/70 backdrop-blur-3xl rounded-2xl">
                        <CardContent className="space-y-4 p-6">
                            {loading ? (
                                <SkeletonBlock />
                            ) : (
                                <>
                                    <MetricValue
                                        icon={
                                            <Wallet className="text-purple-600 w-4" />
                                        }
                                        label="PNL"
                                        value={pnl}
                                    />
                                    <div className="bg-slate-200 w-full h-px" />
                                    <MetricValue
                                        icon={
                                            <Wallet className="text-purple-600 w-4" />
                                        }
                                        label="Average PNL"
                                        value={avgPnl}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="shadow-black/5 border-none bg-white/70 backdrop-blur-3xl rounded-2xl">
                    <CardContent className="space-y-4 p-6">
                        {loading ? (
                            <SkeletonBlock />
                        ) : (
                            <>
                                <MetricValue
                                    icon={
                                        <ChartBarStacked className="text-purple-600 w-4" />
                                    }
                                    label="Total Trade"
                                    value={totalTrade}
                                    format=""
                                />
                                <div className="bg-slate-200 w-full h-px" />
                                <BarStat
                                    label="Win"
                                    count={winCount}
                                    percent={winRate}
                                    color="bg-gradient-to-r from-emerald-400 to-emerald-300"
                                />
                                <BarStat
                                    label="Lose"
                                    count={loseCount}
                                    percent={loseRate}
                                    color="bg-gradient-to-r from-rose-400 to-rose-300"
                                />
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Section 2 - Profit / Loss & Expectations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="shadow-black/5 border-none bg-white/70 backdrop-blur-3xl rounded-2xl">
                            <CardContent className="space-y-4 p-6">
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <MetricValue
                                        icon={
                                            <TrendingUp className="text-emerald-600 w-4" />
                                        }
                                        label="Biggest Profit"
                                        value={biggestProfit}
                                        color="text-emerald-500"
                                    />
                                )}
                                <div className="bg-slate-200 w-full h-px" />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <MetricValue
                                        icon={
                                            <TrendingUp className="text-emerald-600 w-4" />
                                        }
                                        label="Lowest Profit"
                                        value={lowestProfit}
                                        color="text-emerald-500"
                                    />
                                )}
                                <div className="bg-slate-200 w-full h-px" />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <MetricValue
                                        icon={
                                            <TrendingUp className="text-emerald-600 w-4" />
                                        }
                                        label="Total Profit"
                                        value={totalProfit}
                                        color="text-emerald-500"
                                    />
                                )}
                                <div className="bg-slate-200 w-full h-px" />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <MetricValue
                                        icon={
                                            <TrendingUp className="text-emerald-600 w-4" />
                                        }
                                        label="Average Profit"
                                        value={avgProfit}
                                        color="text-emerald-500"
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-black/5 border-none bg-white/70 backdrop-blur-3xl rounded-2xl">
                            <CardContent className="space-y-4 p-6">
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <MetricValue
                                            icon={
                                                <TrendingDown className="text-rose-600 w-4" />
                                            }
                                            label="Biggest Loss"
                                            value={biggestLoss}
                                            color="text-rose-500"
                                        />
                                    </>
                                )}
                                <div className="bg-slate-200 w-full h-px" />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <MetricValue
                                            icon={
                                                <TrendingDown className="text-rose-600 w-4" />
                                            }
                                            label="Lowest Loss"
                                            value={lowestLoss}
                                            color="text-rose-500"
                                        />
                                    </>
                                )}
                                <div className="bg-slate-200 w-full h-px" />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <MetricValue
                                            icon={
                                                <TrendingDown className="text-rose-600 w-4" />
                                            }
                                            label="Total Loss"
                                            value={totalLoss}
                                            color="text-rose-500"
                                        />
                                    </>
                                )}
                                <div className="bg-slate-200 w-full h-px" />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <MetricValue
                                            icon={
                                                <TrendingDown className="text-rose-600 w-4" />
                                            }
                                            label="Average Loss"
                                            value={avgLoss}
                                            color="text-rose-500"
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="shadow-black/5 border-none bg-white/70 backdrop-blur-3xl rounded-2xl">
                        <CardContent className="space-y-4 p-6">
                            {loading ? (
                                <SkeletonBlock />
                            ) : (
                                <>
                                    <MetricValue
                                        icon={
                                            <TrendingUpDown className="text-violet-600 w-4" />
                                        }
                                        label="Average Expectation"
                                        value={avgExpectation}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="shadow-black/5 border-none bg-white/70 backdrop-blur-3xl rounded-2xl">
                            <CardContent className="space-y-4 p-6">
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <CommentedMetric
                                            icon={
                                                <Blend className="text-violet-600 w-4" />
                                            }
                                            label="Profit Factor"
                                            value={profitFactor}
                                            comment={profitFactorComment}
                                            color={commentStyleVal(
                                                profitFactor
                                            )}
                                        />
                                    </>
                                )}
                                <div className="bg-slate-200 w-full h-px" />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <CommentedMetric
                                            icon={
                                                <Blend className="text-violet-600 w-4" />
                                            }
                                            label="Payoff Ratio"
                                            value={payoffRatio}
                                            comment={payoffComment}
                                            color={commentStyleVal(payoffRatio)}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-black/5 border-none bg-white/70 backdrop-blur-3xl rounded-2xl">
                            <CardContent className="space-y-4 p-6">
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <CommentedMetric
                                            icon={
                                                <Blend className="text-violet-600 w-4" />
                                            }
                                            label={`Sharpe Ratio (${biSharpeRatio}%)`}
                                            value={sharpeBI}
                                            comment={sharpeBIComment}
                                            color={commentStyleVal(sharpeBI)}
                                        />
                                    </>
                                )}
                                <div className="bg-slate-200 w-full h-px" />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <CommentedMetric
                                            icon={
                                                <Blend className="text-violet-600 w-4" />
                                            }
                                            label={`Personal Ratio (${personalSharpeRatio}%)`}
                                            value={sharpePersonal}
                                            comment={sharpePersonalComment}
                                            color={commentStyleVal(
                                                sharpePersonal
                                            )}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <Card className="shadow-black/5 border-none bg-white/70 backdrop-blur-3xl rounded-2xl">
                        <CardContent className="space-y-4 p-6">
                            {loading ? (
                                <SkeletonBlock />
                            ) : (
                                <>
                                    <CommentedMetric
                                        icon={
                                            <TrendingUpDown className="text-violet-600 w-4" />
                                        }
                                        label="Standard Deviation"
                                        value={stdDeviation}
                                        comment={stdDeviationComment}
                                        color={commentStyleVal(stdDeviation)}
                                        format="currency"
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    );
}

export default OverallPerformance;
