"use client";
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import MetricValue from "@/components/ui/common/MetricValue";
import CommentedMetric from "@/components/ui/common/CommentedMetric";
import CircleStatConic from "@/components/ui/common/CircleStatConic";
import {
    ArrowDownRight,
    ArrowUpDown,
    ArrowUpRight,
    Blend,
    ChartBarStacked,
    ChartNoAxesGantt,
    HandCoins,
    History,
    Hourglass,
    Sliders,
    TrendingDown,
    TrendingUp,
    TrendingUpDown,
    Wallet,
} from "lucide-react";
import SkeletonBlock from "../../../components/ui/common/SkeletonBlock";
import { Separator } from "@/components/ui/separator";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

function OverallPerformance() {
    const [metrics, setMetrics] = useState({});
    const [loading, setLoading] = useState(true);
    const [percentType, setPercentType] = useState("change");

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
        accountValue,
        biSharpeRatio,
        personalSharpeRatio,
        portfolioGrowth,
        accountValueChangePercent,
        accountValueComparePercent,
        pnl,
        pnlChangePercent,
        pnlComparePercent,
        averagePnL,
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
        sharpePersonal,
        sharpeBIComment,
        sharpePersonalComment,
        avgReturn,
        stdDevRupiah,
        stdDevRatio,
        stdDevComment,
        safeZoneAvgProfitWithoutMoe,
        safeZoneAvgProfitWithMoe,
        safeZoneAvgLossWithoutMoe,
        safeZoneAvgLossWithMoe,
        timesToZeroWithoutMoe,
        timesToZeroWithMoe,
    } = metrics || {};

    const commentStyleVal = (val, threshold = 1) =>
        val >= threshold ? "text-green-600" : "text-rose-600";

    // Pilih Change/Compare sesuai filter
    const pick = (changeVal, compareVal) =>
        percentType === "change" ? changeVal : compareVal;

    return (
        <main className="space-y-6">
            <div className="flex flex-col gap-2 p-4 shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                    Filter Balance & PNL :
                </p>
                <div className="flex items-center gap-2 ">
                    <button
                        onClick={() => setPercentType("change")}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                            percentType === "change"
                                ? "bg-violet-600 text-white"
                                : "bg-slate-100 dark:bg-transparent dark:hover:bg-violet-600/15 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                        <HoverCard>
                            <HoverCardTrigger>Change %</HoverCardTrigger>
                            <HoverCardContent
                                sideOffset={10}
                                className="w-72 text-sm font-medium text-slate-500 dark:text-slate-400"
                            >
                                Shows the percentage difference between the
                                current value and the previous baseline. A value
                                of +20% means the metric has increased by 20%
                                compared to before, while -10% means it has
                                decreased by 10%.
                            </HoverCardContent>
                        </HoverCard>
                    </button>
                    <button
                        onClick={() => setPercentType("compare")}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                            percentType === "compare"
                                ? "bg-violet-600 text-white"
                                : "bg-slate-100 dark:bg-transparent dark:hover:bg-violet-600/15 text-slate-600 dark:text-slate-400"
                        }`}
                    >
                        <HoverCard>
                            <HoverCardTrigger>Compare %</HoverCardTrigger>
                            <HoverCardContent
                                sideOffset={10}
                                className="w-72 text-sm font-medium text-slate-500 dark:text-slate-400"
                            >
                                Shows the ratio of the current value compared to
                                the previous baseline (e.g., yesterday’s trade
                                or the last update). A value of 120% means the
                                metric is now 1.2x higher than before.
                            </HoverCardContent>
                        </HoverCard>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl">
                    <CardContent className="p-6">
                        {loading ? (
                            <SkeletonBlock />
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6">
                                <MetricValue
                                    icon={
                                        <Wallet className="text-violet-600 w-4 h-4" />
                                    }
                                    iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                    label="Initial Margin"
                                    value={initialMargin}
                                />
                                <MetricValue
                                    icon={
                                        <HandCoins className="text-violet-600 w-4 h-4" />
                                    }
                                    iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                    label="Account Value"
                                    value={accountValue}
                                    indicator2={portfolioGrowth}
                                    indicator1={pick(
                                        accountValueChangePercent,
                                        accountValueComparePercent
                                    )}
                                    unit={
                                        percentType === "change"
                                            ? "Since last trade"
                                            : "Day-over-Day"
                                    }
                                />
                                <MetricValue
                                    icon={
                                        <TrendingUpDown className="text-violet-600 w-4 h-4" />
                                    }
                                    iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                    label="PNL"
                                    value={pnl}
                                    indicator1={pick(
                                        pnlChangePercent,
                                        pnlComparePercent
                                    )}
                                    unit={
                                        percentType === "change"
                                            ? "Since last trade"
                                            : "Day-over-Day"
                                    }
                                />
                                <MetricValue
                                    icon={
                                        <ChartNoAxesGantt className="text-violet-600 w-4 h-4" />
                                    }
                                    iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                    label="Average PNL"
                                    value={averagePnL}
                                    indicator1={pick(
                                        avgPnLChangePercent,
                                        avgPnLComparePercent
                                    )}
                                    unit={
                                        percentType === "change"
                                            ? "Since last trade"
                                            : "Day-over-Day"
                                    }
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className="shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl">
                    <CardContent className="space-y-4 p-6">
                        {loading ? (
                            <SkeletonBlock />
                        ) : (
                            <>
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                                    <MetricValue
                                        icon={
                                            <ChartBarStacked className="text-violet-600 w-4 h-4" />
                                        }
                                        iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                        label="Total Trades"
                                        value={totalTrades}
                                        displayMode="number"
                                    />
                                    <div className="bg-slate-200 dark:bg-slate-800 h-px sm:h-10 w-full sm:w-px"></div>
                                    <p className="font-medium text-slate-500 dark:text-slate-400 text-sm sm:w-1/2 w-full">
                                        This data was obtained since 07 August
                                        2025
                                    </p>
                                </div>
                                <Separator />
                                <div className="flex flex-wrap justify-between gap-y-6">
                                    <CircleStatConic
                                        label="Win Rate"
                                        count={winCount}
                                        percent={winRate}
                                        color="#10B981"
                                    />

                                    <CircleStatConic
                                        label="Lose Rate"
                                        count={loseCount}
                                        percent={loseRate}
                                        color="#EF4444"
                                    />
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Comfort Zone */}
            <Card className="shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl">
                <CardContent className="space-y-4 p-6">
                    {loading ? (
                        <SkeletonBlock />
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                            <MetricValue
                                icon={
                                    <ArrowUpRight className="text-violet-600 w-4 h-4" />
                                }
                                iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                label="Suggested TP"
                                value={safeZoneAvgProfitWithoutMoe}
                            />
                            <MetricValue
                                icon={
                                    <ArrowUpRight className="text-violet-600 w-4 h-4" />
                                }
                                iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                label="Adjusted TP"
                                value={safeZoneAvgProfitWithMoe}
                            />
                            <MetricValue
                                icon={
                                    <ArrowDownRight className="text-violet-600 w-4 h-4" />
                                }
                                iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                label="Suggested SL"
                                value={safeZoneAvgLossWithoutMoe}
                            />
                            <MetricValue
                                icon={
                                    <ArrowDownRight className="text-violet-600 w-4 h-4" />
                                }
                                iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                label="adjusted SL"
                                value={safeZoneAvgLossWithMoe}
                            />
                            <MetricValue
                                icon={
                                    <Sliders className="text-violet-600 w-4 h-4" />
                                }
                                iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                label="Times to zero (Sug)"
                                value={timesToZeroWithoutMoe}
                                displayMode="number"
                            />
                            <MetricValue
                                icon={
                                    <Sliders className="text-violet-600 w-4 h-4" />
                                }
                                iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                label="Times to zero (Adj)"
                                value={timesToZeroWithMoe}
                                displayMode="number"
                            />
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Section 2 - Profit / Loss & Expectations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl">
                            <CardContent className="space-y-4 p-6">
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <MetricValue
                                        icon={
                                            <TrendingUp className="text-green-600 w-4 h-4" />
                                        }
                                        iconBgStyle="bg-green-100 dark:bg-green-500/15 p-2 rounded-lg"
                                        label="Biggest Profit"
                                        value={biggestProfit}
                                        color="text-green-500"
                                    />
                                )}
                                <Separator />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <MetricValue
                                        icon={
                                            <TrendingUp className="text-green-600 w-4 h-4" />
                                        }
                                        iconBgStyle="bg-green-100 dark:bg-green-500/15 p-2 rounded-lg"
                                        label="Lowest Profit"
                                        value={lowestProfit}
                                        color="text-green-500"
                                    />
                                )}
                                <Separator />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <MetricValue
                                        icon={
                                            <TrendingUp className="text-green-600 w-4 h-4" />
                                        }
                                        iconBgStyle="bg-green-100 dark:bg-green-500/15 p-2 rounded-lg"
                                        label="Total Profit"
                                        value={totalProfit}
                                        color="text-green-500"
                                    />
                                )}
                                <Separator />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <MetricValue
                                        icon={
                                            <TrendingUp className="text-green-600 w-4 h-4" />
                                        }
                                        iconBgStyle="bg-green-100 dark:bg-green-500/15 p-2 rounded-lg"
                                        label="Average Profit"
                                        value={avgProfit}
                                        color="text-green-500"
                                    />
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl">
                            <CardContent className="space-y-4 p-6">
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <MetricValue
                                            icon={
                                                <TrendingDown className="text-rose-600 w-4 h-4" />
                                            }
                                            iconBgStyle="bg-rose-100 dark:bg-rose-500/15 p-2 rounded-lg"
                                            label="Biggest Loss"
                                            value={biggestLoss}
                                            color="text-rose-500"
                                        />
                                    </>
                                )}
                                <Separator />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <MetricValue
                                            icon={
                                                <TrendingDown className="text-rose-600 w-4 h-4" />
                                            }
                                            iconBgStyle="bg-rose-100 dark:bg-rose-500/15 p-2 rounded-lg"
                                            label="Lowest Loss"
                                            value={lowestLoss}
                                            color="text-rose-500"
                                        />
                                    </>
                                )}
                                <Separator />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <MetricValue
                                            icon={
                                                <TrendingDown className="text-rose-600 w-4 h-4" />
                                            }
                                            iconBgStyle="bg-rose-100 dark:bg-rose-500/15 p-2 rounded-lg"
                                            label="Total Loss"
                                            value={totalLoss}
                                            color="text-rose-500"
                                        />
                                    </>
                                )}
                                <Separator />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <MetricValue
                                            icon={
                                                <TrendingDown className="text-rose-600 w-4 h-4" />
                                            }
                                            iconBgStyle="bg-rose-100 dark:bg-rose-500/15 p-2 rounded-lg"
                                            label="Average Loss"
                                            value={avgLoss}
                                            color="text-rose-500"
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    {/* <Card className="shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl">
                        <CardContent className="space-y-4 p-6">
                            {loading ? (
                                <SkeletonBlock />
                            ) : (
                                <>
                                    <MetricValue
                                        icon={
                                            <TrendingUpDown className="text-violet-600 w-4 h-4" />
                                        }
                                        iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                        label="Average Expectation"
                                        value={avgExpectation}
                                    />
                                </>
                            )}
                        </CardContent>
                    </Card> */}
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Card className="shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl">
                            <CardContent className="space-y-4 p-6">
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <CommentedMetric
                                            icon={
                                                <Blend className="text-violet-600 w-4 h-4" />
                                            }
                                            iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                            label="Profit Factor"
                                            value={profitFactor}
                                            comment={profitFactorComment}
                                            color={commentStyleVal(
                                                profitFactor
                                            )}
                                        />
                                    </>
                                )}
                                <Separator />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <CommentedMetric
                                            icon={
                                                <Blend className="text-violet-600 w-4 h-4" />
                                            }
                                            iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                            label="Payoff Ratio"
                                            value={payoffRatio}
                                            comment={payoffComment}
                                            color={commentStyleVal(payoffRatio)}
                                        />
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card className="shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl">
                            <CardContent className="space-y-4 p-6">
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <CommentedMetric
                                            icon={
                                                <Blend className="text-violet-600 w-4 h-4" />
                                            }
                                            iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                            label={`Sharpe Ratio (${biSharpeRatio}%)`}
                                            value={sharpeBI}
                                            comment={sharpeBIComment}
                                            color={commentStyleVal(sharpeBI)}
                                        />
                                    </>
                                )}
                                <Separator />
                                {loading ? (
                                    <SkeletonBlock />
                                ) : (
                                    <>
                                        <CommentedMetric
                                            icon={
                                                <Blend className="text-violet-600 w-4 h-4" />
                                            }
                                            iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
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

                    <Card className="shadow-[0_0_75px_16px_rgba(202,213,226,0.3)] dark:shadow-none border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl">
                        <CardContent className="space-y-4 p-6">
                            {loading ? (
                                <SkeletonBlock />
                            ) : (
                                <>
                                    <CommentedMetric
                                        icon={
                                            <TrendingUpDown className="text-violet-600 w-4 h-4" />
                                        }
                                        iconBgStyle="bg-violet-100 dark:bg-violet-500/15 p-2 rounded-lg"
                                        label="Standard Deviation"
                                        value={stdDevRupiah}
                                        comment={stdDevComment}
                                        color={commentStyleVal(stdDevRupiah)}
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
