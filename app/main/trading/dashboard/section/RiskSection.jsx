"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
    Shield,
    ArrowUpRight,
    ArrowDownRight,
    AlertTriangle,
    TrendingUpDown,
} from "lucide-react";
import MetricCard from "../../../../../components/ui/common/MetricCard";
import RiskGauge from "../../../../../components/ui/common/RiskGauge";
import SkeletonGrid from "../../../../../components/ui/common/SkeletonGrid";

export default function RiskSection({ metrics, loading }) {
    if (loading) {
        return <SkeletonGrid count={2} />;
    }

    if (!metrics || metrics.totalTrades === 0) {
        return (
            <Card>
                <CardContent className="p-12 text-center">
                    <p className="text-slate-500">No risk data available</p>
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
    } = metrics;

    return (
        <div className="space-y-6">
            {/* Risk Overview */}
            <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200">
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-amber-100 rounded-xl">
                            <Shield className="size-6 text-amber-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-amber-900">
                                Risk Management
                            </h3>
                            <p className="text-xs text-amber-600">
                                Suggested targets and stop losses based on your
                                trading history
                            </p>
                        </div>
                    </div>

                    <RiskGauge
                        stdDev={stdDevRupiah}
                        comment={stdDevComment}
                        timesToZero={timesToZeroWithMoe}
                    />
                </CardContent>
            </Card>

            {/* TP/SL Suggestions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Take Profit Suggestions */}
                <Card className="border-green-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <ArrowUpRight className="size-5 text-green-600" />
                            </div>
                            <h3 className="font-semibold text-green-900">
                                Take Profit Levels
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <MetricCard
                                label="Suggested TP"
                                value={safeZoneAvgProfitWithoutMoe}
                                format="currency"
                                description="Based on average profit"
                                color="green"
                            />
                            <MetricCard
                                label="Adjusted TP (Conservative)"
                                value={safeZoneAvgProfitWithMoe}
                                format="currency"
                                description="With 10% margin of error"
                                color="green"
                                badge="Recommended"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Stop Loss Suggestions */}
                <Card className="border-red-200">
                    <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="p-2 bg-red-100 rounded-lg">
                                <ArrowDownRight className="size-5 text-red-600" />
                            </div>
                            <h3 className="font-semibold text-red-900">
                                Stop Loss Levels
                            </h3>
                        </div>
                        <div className="space-y-4">
                            <MetricCard
                                label="Suggested SL"
                                value={safeZoneAvgLossWithoutMoe}
                                format="currency"
                                description="Based on average loss"
                                color="red"
                            />
                            <MetricCard
                                label="Adjusted SL (Conservative)"
                                value={safeZoneAvgLossWithMoe}
                                format="currency"
                                description="With 10% margin of error"
                                color="red"
                                badge="Recommended"
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Risk Tolerance */}
            <Card>
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-violet-100 rounded-lg">
                            <AlertTriangle className="size-5 text-violet-600" />
                        </div>
                        <h3 className="font-semibold">
                            Risk Tolerance Analysis
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="p-4 bg-slate-50 rounded-lg border">
                            <p className="text-xs text-slate-500 mb-1">
                                Standard Deviation
                            </p>
                            <p className="text-xl font-bold text-slate-700">
                                Rp {stdDevRupiah?.toLocaleString("id-ID")}
                            </p>
                            <p className="text-xs text-violet-600 mt-1 font-medium">
                                {stdDevComment}
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border">
                            <p className="text-xs text-slate-500 mb-1">
                                Times to Zero (Suggested)
                            </p>
                            <p className="text-xl font-bold text-slate-700">
                                {timesToZeroWithoutMoe}x
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                                Consecutive losses to wipe out capital
                            </p>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-lg border">
                            <p className="text-xs text-slate-500 mb-1">
                                Times to Zero (Adjusted)
                            </p>
                            <p className="text-xl font-bold text-violet-600">
                                {timesToZeroWithMoe}x
                            </p>
                            <p className="text-xs text-slate-600 mt-1">
                                With margin of error
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Volatility Breakdown */}
            <Card className="bg-gradient-to-br from-violet-50 to-purple-50 border-violet-200">
                <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 bg-violet-100 rounded-lg">
                            <TrendingUpDown className="size-5 text-violet-600" />
                        </div>
                        <h3 className="font-semibold">Volatility Insights</h3>
                    </div>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-sm text-slate-600">
                                Current Account Value
                            </span>
                            <span className="font-bold text-violet-600">
                                Rp {accountValue?.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-sm text-slate-600">
                                Risk per Trade (Adjusted SL)
                            </span>
                            <span className="font-bold text-red-600">
                                Rp{" "}
                                {Math.abs(
                                    safeZoneAvgLossWithMoe,
                                )?.toLocaleString("id-ID")}
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-white rounded-lg">
                            <span className="text-sm text-slate-600">
                                Reward per Trade (Adjusted TP)
                            </span>
                            <span className="font-bold text-green-600">
                                Rp{" "}
                                {safeZoneAvgProfitWithMoe?.toLocaleString(
                                    "id-ID",
                                )}
                            </span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
