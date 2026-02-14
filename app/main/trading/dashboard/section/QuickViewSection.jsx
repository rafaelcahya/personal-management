"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    RefreshCw,
    TrendingUp,
    TrendingDown,
    Calendar,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";
import { toast } from "sonner";
import SkeletonGrid from "@/components/ui/common/SkeletonGrid";
import EmptyState from "@/components/ui/common/EmptyState";

export default function QuickViewSection({ initialData, onRefresh }) {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(!initialData);

    useEffect(() => {
        if (initialData) {
            setData(initialData);
            setLoading(false);
        }
    }, [initialData]);

    const handleRefresh = async () => {
        setLoading(true);
        try {
            await onRefresh?.();
            toast.success("Data refreshed successfully!");
        } catch (err) {
            toast.error("Failed to refresh data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <SkeletonGrid count={3} />;
    }

    if (
        !data ||
        (data.trades?.length === 0 &&
            data.events?.length === 0 &&
            data.fees?.length === 0)
    ) {
        return (
            <EmptyState
                title="No Quick View Data"
                description="Start adding trades, events, and fees to see them here"
            />
        );
    }

    return (
        <div className="space-y-4">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-base font-semibold">Quick Overview</h3>
                    <p className="text-xs text-slate-500">
                        A comprehensive snapshot of your latest trading
                        activities, market insights, and associated fees
                    </p>
                </div>

                <Button
                    onClick={handleRefresh}
                    disabled={loading}
                    size="sm"
                    className="h-8 bg-violet-50 hover:bg-violet-100 text-violet-500"
                >
                    <RefreshCw
                        className={`size-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                {/* Recent Trades */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-violet-100 rounded-md">
                                <TrendingUp className="size-4 text-violet-600" />
                            </div>
                            <CardTitle className="text-sm font-medium">
                                Recent Trades
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {data.trades?.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-xs text-slate-400">
                                    No trades yet
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {data.trades?.map((trade) => {
                                    const isWin =
                                        Number(trade.realized_gain) >= 0;
                                    return (
                                        <div
                                            key={trade.id}
                                            className="group p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-start justify-between gap-2 mb-1.5">
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-slate-900 uppercase">
                                                        {trade.ticker}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(
                                                            trade.trade_date,
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                                <div className="text-right flex-shrink-0">
                                                    <div className="flex items-center gap-1">
                                                        {isWin ? (
                                                            <ArrowUpRight className="size-3 text-green-600" />
                                                        ) : (
                                                            <ArrowDownRight className="size-3 text-red-600" />
                                                        )}
                                                        <p
                                                            className={`text-sm font-semibold ${
                                                                isWin
                                                                    ? "text-green-600"
                                                                    : "text-red-600"
                                                            }`}
                                                        >
                                                            Rp{" "}
                                                            {Number(
                                                                trade.realized_gain,
                                                            ).toLocaleString(
                                                                "id-ID",
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Events */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 rounded-md">
                                <Calendar className="size-4 text-blue-600" />
                            </div>
                            <CardTitle className="text-sm font-medium">
                                Market Events
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {data.events?.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-xs text-slate-400">
                                    No events yet
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {data.events?.map((event) => {
                                    const isUp =
                                        event.impact_direction === "UP";
                                    return (
                                        <div
                                            key={event.id}
                                            className="group p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg transition-colors"
                                        >
                                            <div className="flex items-start gap-2">
                                                <div
                                                    className={`mt-0.5 p-1 rounded ${
                                                        isUp
                                                            ? "bg-green-100"
                                                            : "bg-red-100"
                                                    }`}
                                                >
                                                    {isUp ? (
                                                        <TrendingUp className="size-3 text-green-600" />
                                                    ) : (
                                                        <TrendingDown className="size-3 text-red-600" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm text-slate-700 line-clamp-2 leading-snug mb-1">
                                                        {
                                                            event.event_description
                                                        }
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {new Date(
                                                            event.event_date,
                                                        ).toLocaleDateString(
                                                            "id-ID",
                                                            {
                                                                day: "numeric",
                                                                month: "short",
                                                                year: "numeric",
                                                            },
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Fees */}
                <Card className="border border-slate-200/50 shadow-slate-100">
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-amber-100 rounded-md">
                                <DollarSign className="size-4 text-amber-600" />
                            </div>
                            <CardTitle className="text-sm font-medium">
                                Recent Fees
                            </CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {data.fees?.length === 0 ? (
                            <div className="py-8 text-center">
                                <p className="text-xs text-slate-400">
                                    No fees yet
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-2">
                                {data.fees?.map((fee) => (
                                    <div
                                        key={fee.id}
                                        className="group p-3 bg-slate-50 hover:bg-slate-100/80 rounded-lg transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-slate-900 truncate">
                                                    {fee.fee_name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(
                                                        fee.fee_date,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm font-semibold text-red-600">
                                                    Rp{" "}
                                                    {Number(
                                                        fee.fee,
                                                    ).toLocaleString("id-ID")}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
