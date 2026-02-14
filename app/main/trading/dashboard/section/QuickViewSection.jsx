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
        <div className="space-y-6">
            {/* Header with Refresh */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Quick Overview</h3>
                    <p className="text-sm text-slate-600">
                        Recent activity across your portfolio
                    </p>
                </div>
                <Button
                    onClick={handleRefresh}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                >
                    <RefreshCw
                        className={`size-4 mr-2 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Trades */}
                <Card className="shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingUp className="size-5 text-violet-600" />
                            Recent Trades
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.trades?.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">
                                No trades yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {data.trades?.map((trade) => (
                                    <div
                                        key={trade.id}
                                        className="p-3 bg-slate-50 rounded-lg border hover:border-violet-200 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {trade.stock_name}
                                            </p>
                                            <Badge
                                                variant={
                                                    Number(
                                                        trade.realized_gain,
                                                    ) >= 0
                                                        ? "success"
                                                        : "destructive"
                                                }
                                                className="text-xs"
                                            >
                                                {Number(trade.realized_gain) >=
                                                0
                                                    ? "Win"
                                                    : "Loss"}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-slate-500">
                                                {new Date(
                                                    trade.exit_date,
                                                ).toLocaleDateString("id-ID")}
                                            </p>
                                            <p
                                                className={`text-sm font-bold ${
                                                    Number(
                                                        trade.realized_gain,
                                                    ) >= 0
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                Rp{" "}
                                                {Number(
                                                    trade.realized_gain,
                                                ).toLocaleString("id-ID")}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Events */}
                <Card className="shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <Calendar className="size-5 text-blue-600" />
                            Market Events
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.events?.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">
                                No events yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {data.events?.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-3 bg-slate-50 rounded-lg border hover:border-blue-200 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-1">
                                            <p className="text-sm font-medium text-slate-700 line-clamp-2">
                                                {event.event_description}
                                            </p>
                                            {event.impact_direction === "UP" ? (
                                                <TrendingUp className="size-4 text-green-600 flex-shrink-0" />
                                            ) : (
                                                <TrendingDown className="size-4 text-red-600 flex-shrink-0" />
                                            )}
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {new Date(
                                                event.event_date,
                                            ).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Fees */}
                <Card className="shadow-none">
                    <CardHeader className="pb-4">
                        <CardTitle className="text-base flex items-center gap-2">
                            <DollarSign className="size-5 text-amber-600" />
                            Recent Fees
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {data.fees?.length === 0 ? (
                            <p className="text-sm text-slate-500 text-center py-4">
                                No fees yet
                            </p>
                        ) : (
                            <div className="space-y-3">
                                {data.fees?.map((fee) => (
                                    <div
                                        key={fee.id}
                                        className="p-3 bg-slate-50 rounded-lg border hover:border-amber-200 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-semibold text-slate-700">
                                                {fee.fee_name}
                                            </p>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs text-slate-500">
                                                {new Date(
                                                    fee.fee_date,
                                                ).toLocaleDateString("id-ID")}
                                            </p>
                                            <p className="text-sm font-bold text-red-600">
                                                Rp{" "}
                                                {Number(fee.fee).toLocaleString(
                                                    "id-ID",
                                                )}
                                            </p>
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
