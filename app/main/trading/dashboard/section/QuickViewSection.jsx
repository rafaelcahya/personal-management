"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    TrendingUp,
    Calendar,
    Receipt,
    ArrowRight,
    RefreshCw,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function QuickViewSection({ initialData = null, onRefresh }) {
    const [recentTrades, setRecentTrades] = useState(initialData?.trades || []);
    const [recentEvents, setRecentEvents] = useState(initialData?.events || []);
    const [recentFees, setRecentFees] = useState(initialData?.fees || []);
    const [loading, setLoading] = useState(!initialData);

    // Update state when initialData changes
    useEffect(() => {
        if (initialData) {
            setRecentTrades(initialData.trades || []);
            setRecentEvents(initialData.events || []);
            setRecentFees(initialData.fees || []);
            setLoading(false);
        }
    }, [initialData]);

    const handleRefresh = async () => {
        try {
            setLoading(true);
            await onRefresh?.();
            toast.success("Data refreshed successfully");
        } catch (err) {
            console.error("Refresh error:", err);
            toast.error("Failed to refresh data");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Refresh Button */}
            <div className="flex justify-end">
                <Button
                    onClick={handleRefresh}
                    disabled={loading}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <RefreshCw
                        className={`size-4 ${loading ? "animate-spin" : ""}`}
                    />
                    Refresh
                </Button>
            </div>

            {/* Recent Trades */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="size-5 text-violet-600" />
                        Recent Trades
                    </CardTitle>
                    <Link href="/main/trading/trade">
                        <Button variant="ghost" size="sm" className="gap-2">
                            View All
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-3">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-16 bg-slate-100 rounded animate-pulse"
                                />
                            ))}
                        </div>
                    ) : recentTrades.length > 0 ? (
                        <div className="space-y-2">
                            {recentTrades.map((trade) => (
                                <div
                                    key={trade.id}
                                    className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                                >
                                    <div>
                                        <p className="font-semibold text-sm">
                                            {trade.ticker}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {new Date(
                                                trade.trade_date,
                                            ).toLocaleDateString("id-ID")}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p
                                            className={`font-bold ${
                                                Number(trade.realized_gain) >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            {Number(trade.realized_gain) >= 0
                                                ? "+"
                                                : ""}
                                            Rp{" "}
                                            {Number(
                                                trade.realized_gain,
                                            ).toLocaleString("id-ID")}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            {trade.return_percent}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-slate-500 mb-2">No trades yet</p>
                            <Link href="/main/trading/trade">
                                <Button variant="outline" size="sm">
                                    Add Your First Trade
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recent Events & Fees Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Events */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Calendar className="size-5 text-amber-600" />
                            Recent Events
                        </CardTitle>
                        <Link href="/main/trading/event">
                            <Button variant="ghost" size="sm" className="gap-2">
                                View All
                                <ArrowRight className="size-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-16 bg-slate-100 rounded animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : recentEvents.length > 0 ? (
                            <div className="space-y-2">
                                {recentEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                                    >
                                        <p className="text-sm font-medium text-slate-700 line-clamp-2 mb-2">
                                            {event.event_description}
                                        </p>
                                        <span
                                            className={`text-xs px-2 py-1 rounded-full font-semibold ${
                                                event.impact_direction === "UP"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {event.impact_direction === "UP"
                                                ? "Bullish"
                                                : "Bearish"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-500 mb-2">
                                    No events yet
                                </p>
                                <Link href="/main/trading/event">
                                    <Button variant="outline" size="sm">
                                        Add Market Event
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Recent Fees */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="flex items-center gap-2 text-base">
                            <Receipt className="size-5 text-red-600" />
                            Recent Fees
                        </CardTitle>
                        <Link href="/main/trading/fee">
                            <Button variant="ghost" size="sm" className="gap-2">
                                View All
                                <ArrowRight className="size-4" />
                            </Button>
                        </Link>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-3">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-16 bg-slate-100 rounded animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : recentFees.length > 0 ? (
                            <div className="space-y-2">
                                {recentFees.map((fee) => (
                                    <div
                                        key={fee.id}
                                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-slate-50 transition-colors"
                                    >
                                        <div>
                                            <p className="font-semibold text-sm">
                                                {fee.fee_name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(
                                                    fee.fee_date,
                                                ).toLocaleDateString("id-ID")}
                                            </p>
                                        </div>
                                        <p className="font-bold text-red-600">
                                            Rp{" "}
                                            {Number(fee.fee).toLocaleString(
                                                "id-ID",
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-500 mb-2">
                                    No fees yet
                                </p>
                                <Link href="/main/trading/fee">
                                    <Button variant="outline" size="sm">
                                        Add Fee
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
