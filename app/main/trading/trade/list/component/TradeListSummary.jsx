"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
    TrendingUp,
    TrendingDown,
    Activity,
    Target,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

export default function TradeListSummary({ trades }) {
    const [isOpen, setIsOpen] = useState(false);

    const stats = useMemo(() => {
        const totalTrades = trades.length;
        const wins = trades.filter((t) => Number(t.realized_gain) > 0).length;
        const losses = trades.filter((t) => Number(t.realized_gain) < 0).length;
        const winRate =
            totalTrades > 0 ? ((wins / totalTrades) * 100).toFixed(1) : 0;

        const totalProfit = trades.reduce(
            (sum, t) =>
                sum +
                (Number(t.realized_gain) > 0 ? Number(t.realized_gain) : 0),
            0,
        );
        const totalLoss = trades.reduce(
            (sum, t) =>
                sum +
                (Number(t.realized_gain) < 0 ? Number(t.realized_gain) : 0),
            0,
        );
        const netPnL = totalProfit + totalLoss;

        return [
            {
                title: "Total Trades",
                value: totalTrades,
                icon: Activity,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
            },
            {
                title: "Win Rate",
                value: `${winRate}%`,
                subValue: `${wins}W / ${losses}L`,
                icon: Target,
                color: "text-violet-600",
                bgColor: "bg-violet-50",
            },
            {
                title: "Total Profit",
                value: `Rp ${totalProfit.toLocaleString("id-ID")}`,
                icon: TrendingUp,
                color: "text-green-600",
                bgColor: "bg-green-50",
            },
            {
                title: "Net P/L",
                value: `Rp ${netPnL.toLocaleString("id-ID")}`,
                icon: netPnL >= 0 ? TrendingUp : TrendingDown,
                color: netPnL >= 0 ? "text-green-600" : "text-red-600",
                bgColor: netPnL >= 0 ? "bg-green-50" : "bg-red-50",
            },
        ];
    }, [trades]);

    // Calculate primary stat for mobile header
    const netPnL = useMemo(() => {
        const totalProfit = trades.reduce(
            (sum, t) =>
                sum +
                (Number(t.realized_gain) > 0 ? Number(t.realized_gain) : 0),
            0,
        );
        const totalLoss = trades.reduce(
            (sum, t) =>
                sum +
                (Number(t.realized_gain) < 0 ? Number(t.realized_gain) : 0),
            0,
        );
        return totalProfit + totalLoss;
    }, [trades]);

    return (
        <>
            {/* Desktop View - Always Visible Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="p-0 shadow-none">
                            <CardContent className="px-4 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-xl font-semibold">
                                            {stat.value}
                                        </p>
                                        {stat.subValue && (
                                            <p className="text-xs text-slate-400 mt-1">
                                                {stat.subValue}
                                            </p>
                                        )}
                                    </div>
                                    <div
                                        className={`p-3 rounded-lg ${stat.bgColor}`}
                                    >
                                        <Icon
                                            className={`size-5 ${stat.color}`}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Mobile View - Collapsible */}
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="sm:hidden w-full"
            >
                <Card className="py-2">
                    <CardContent className="px-0">
                        {/* Header - Always Visible */}
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full flex items-center justify-between bg-white"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-violet-50">
                                        <Activity className="size-4 text-violet-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold">
                                            Trade Summary
                                        </p>
                                        <p
                                            className={`text-xs font-medium ${
                                                netPnL >= 0
                                                    ? "text-green-600"
                                                    : "text-red-600"
                                            }`}
                                        >
                                            Net P/L: Rp{" "}
                                            {netPnL.toLocaleString("id-ID")}
                                        </p>
                                    </div>
                                </div>
                                {isOpen ? (
                                    <ChevronUp className="size-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="size-5 text-slate-400" />
                                )}
                            </Button>
                        </CollapsibleTrigger>

                        {/* Collapsible Content */}
                        <CollapsibleContent className="px-4 pt-2">
                            <div className="pt-2 grid grid-cols-2 gap-3">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="p-3 rounded-lg border bg-slate-50/50"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className={`p-1.5 rounded-md ${stat.bgColor}`}
                                                >
                                                    <Icon
                                                        className={`size-3.5 ${stat.color}`}
                                                    />
                                                </div>
                                                <p className="text-xs font-medium text-slate-600">
                                                    {stat.title}
                                                </p>
                                            </div>
                                            <p className="text-lg font-bold ml-0.5">
                                                {stat.value}
                                            </p>
                                            {stat.subValue && (
                                                <p className="text-xs text-slate-400 mt-1 ml-0.5">
                                                    {stat.subValue}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </CollapsibleContent>
                    </CardContent>
                </Card>
            </Collapsible>
        </>
    );
}
