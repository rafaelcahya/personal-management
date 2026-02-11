"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    TrendingUp,
    Calendar,
    Receipt,
    ArrowRight,
    RefreshCw,
    Activity,
    TrendingDown,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import EmptyState from "../../../../../components/ui/common/EmptyState";
import QuickStat from "./component/QuickStatCard";

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

    // Calculate quick stats
    const totalTradesCount = recentTrades.length;
    const totalEventsCount = recentEvents.length;
    const totalFeesAmount = recentFees.reduce(
        (sum, fee) => sum + Number(fee.fee || 0),
        0,
    );
    const recentPnL = recentTrades.reduce(
        (sum, trade) => sum + Number(trade.realized_gain || 0),
        0,
    );

    return (
        <div className="space-y-4">
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
                <span className="hidden sm:inline">Refresh</span>
            </Button>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="grid grid-cols-3 gap-3 flex-1">
                    <QuickStat
                        label="Recent Trades"
                        value={totalTradesCount}
                        color="violet"
                        icon={<Activity className="size-3.5" />}
                    />
                    <QuickStat
                        label="Active Events"
                        value={totalEventsCount}
                        color="amber"
                        icon={<Calendar className="size-3.5" />}
                    />
                    <QuickStat
                        label="Total Fees"
                        value={`Rp ${totalFeesAmount.toLocaleString("id-ID")}`}
                        color="red"
                        icon={<Receipt className="size-3.5" />}
                    />
                </div>
            </div>

            {/* Recent Trades - Compact */}
            <Card className="border shadow-none">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-sm flex items-center gap-2">
                            <div className="p-1.5 bg-violet-100 rounded-lg">
                                <TrendingUp className="size-4 text-violet-600" />
                            </div>
                            Recent Trades
                            <Badge variant="secondary" className="text-xs">
                                {totalTradesCount}
                            </Badge>
                        </CardTitle>
                        <Link href="/main/trading/trade">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="gap-1.5 h-8"
                            >
                                <span className="text-xs">View All</span>
                                <ArrowRight className="size-3.5" />
                            </Button>
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="space-y-2">
                            {[...Array(3)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-14 bg-slate-100 rounded-lg animate-pulse"
                                />
                            ))}
                        </div>
                    ) : recentTrades.length > 0 ? (
                        <div className="space-y-2">
                            {recentTrades.map((trade) => {
                                const gain = Number(trade.realized_gain) || 0;
                                const isProfit = gain >= 0;

                                return (
                                    <div
                                        key={trade.id}
                                        className="flex items-center justify-between p-2.5 rounded-lg border hover:bg-slate-50 transition-colors group"
                                    >
                                        <div className="flex items-center gap-2.5">
                                            <div
                                                className={`p-1.5 rounded-lg ${
                                                    isProfit
                                                        ? "bg-green-100"
                                                        : "bg-red-100"
                                                }`}
                                            >
                                                {isProfit ? (
                                                    <TrendingUp className="size-4 text-green-600" />
                                                ) : (
                                                    <TrendingDown className="size-4 text-red-600" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm leading-tight">
                                                    {trade.ticker}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(
                                                        trade.trade_date,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "2-digit",
                                                            month: "short",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p
                                                className={`font-bold text-sm ${
                                                    isProfit
                                                        ? "text-green-600"
                                                        : "text-red-600"
                                                }`}
                                            >
                                                {isProfit ? "+" : ""}
                                                Rp{" "}
                                                {gain.toLocaleString("id-ID")}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {trade.return_percent}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <EmptyState
                            title="No trades yet"
                            description="Start tracking your trades"
                            actionLabel="Add First Trade"
                            actionHref="/main/trading/trade"
                        />
                    )}

                    {/* Summary Footer */}
                    {recentTrades.length > 0 && (
                        <div className="mt-3 pt-3 border-t">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-600 font-medium">
                                    Recent P/L
                                </span>
                                <span
                                    className={`font-bold ${
                                        recentPnL >= 0
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {recentPnL >= 0 ? "+" : ""}
                                    Rp {recentPnL.toLocaleString("id-ID")}
                                </span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Events & Fees Grid - Compact */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Recent Events */}
                <Card className="border shadow-none">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <div className="p-1.5 bg-amber-100 rounded-lg">
                                    <Calendar className="size-4 text-amber-600" />
                                </div>
                                Market Events
                                <Badge variant="secondary" className="text-xs">
                                    {totalEventsCount}
                                </Badge>
                            </CardTitle>
                            <Link href="/main/trading/event">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1.5 h-8"
                                >
                                    <span className="text-xs">View All</span>
                                    <ArrowRight className="size-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-14 bg-slate-100 rounded-lg animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : recentEvents.length > 0 ? (
                            <div className="space-y-2">
                                {recentEvents.map((event) => (
                                    <div
                                        key={event.id}
                                        className="p-2.5 rounded-lg border hover:bg-slate-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-2 mb-1.5">
                                            <p className="text-sm font-medium text-slate-700 line-clamp-2 flex-1 leading-tight">
                                                {event.event_description}
                                            </p>
                                            <Badge
                                                variant={
                                                    event.impact_direction ===
                                                    "UP"
                                                        ? "success"
                                                        : "destructive"
                                                }
                                                className="text-xs shrink-0"
                                            >
                                                {event.impact_direction === "UP"
                                                    ? "🐂"
                                                    : "🐻"}
                                            </Badge>
                                        </div>
                                        <p className="text-xs text-slate-500">
                                            {new Date(
                                                event.created_at || Date.now(),
                                            ).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "short",
                                            })}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="No events tracked"
                                description="Add market events"
                                actionLabel="Add Event"
                                actionHref="/main/trading/event"
                                compact
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Recent Fees */}
                <Card className="border shadow-none">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-sm flex items-center gap-2">
                                <div className="p-1.5 bg-red-100 rounded-lg">
                                    <Receipt className="size-4 text-red-600" />
                                </div>
                                Trading Fees
                                <Badge variant="secondary" className="text-xs">
                                    {recentFees.length}
                                </Badge>
                            </CardTitle>
                            <Link href="/main/trading/fee">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="gap-1.5 h-8"
                                >
                                    <span className="text-xs">View All</span>
                                    <ArrowRight className="size-3.5" />
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="h-14 bg-slate-100 rounded-lg animate-pulse"
                                    />
                                ))}
                            </div>
                        ) : recentFees.length > 0 ? (
                            <div className="space-y-2">
                                {recentFees.map((fee) => (
                                    <div
                                        key={fee.id}
                                        className="flex items-center justify-between p-2.5 rounded-lg border hover:bg-slate-50 transition-colors"
                                    >
                                        <div>
                                            <p className="font-semibold text-sm leading-tight">
                                                {fee.fee_name}
                                            </p>
                                            <p className="text-xs text-slate-500">
                                                {new Date(
                                                    fee.fee_date,
                                                ).toLocaleDateString("id-ID", {
                                                    day: "2-digit",
                                                    month: "short",
                                                    year: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <p className="font-bold text-red-600 text-sm">
                                            -Rp{" "}
                                            {Number(fee.fee).toLocaleString(
                                                "id-ID",
                                            )}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <EmptyState
                                title="No fees recorded"
                                description="Track your fees"
                                actionLabel="Add Fee"
                                actionHref="/main/trading/fee"
                                compact
                            />
                        )}

                        {/* Total Fees Footer */}
                        {recentFees.length > 0 && (
                            <div className="mt-3 pt-3 border-t">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-600 font-medium">
                                        Total Fees
                                    </span>
                                    <span className="font-bold text-red-600">
                                        -Rp{" "}
                                        {totalFeesAmount.toLocaleString(
                                            "id-ID",
                                        )}
                                    </span>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
