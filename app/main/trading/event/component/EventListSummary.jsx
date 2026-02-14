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
    Calendar,
    TrendingUp,
    TrendingDown,
    Star,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

export default function EventListSummary({ events }) {
    const [isOpen, setIsOpen] = useState(false);

    const stats = useMemo(() => {
        const totalEvents = events.length;
        const bullishEvents = events.filter(
            (e) => e.impact_direction === "UP",
        ).length;
        const bearishEvents = events.filter(
            (e) => e.impact_direction === "DOWN",
        ).length;
        const favoriteEvents = events.filter((e) => e.is_favorite).length;

        return [
            {
                title: "Total Events",
                value: totalEvents,
                icon: Calendar,
                color: "text-violet-600",
                bgColor: "bg-violet-50",
            },
            {
                title: "Bullish Impact",
                value: bullishEvents,
                icon: TrendingUp,
                color: "text-green-600",
                bgColor: "bg-green-50",
            },
            {
                title: "Bearish Impact",
                value: bearishEvents,
                icon: TrendingDown,
                color: "text-red-600",
                bgColor: "bg-red-50",
            },
            {
                title: "Favorites",
                value: favoriteEvents,
                icon: Star,
                color: "text-yellow-600",
                bgColor: "bg-yellow-50",
            },
        ];
    }, [events]);

    // Calculate primary stats for mobile header
    const primaryStats = useMemo(() => {
        const bullishEvents = events.filter(
            (e) => e.impact_direction === "UP",
        ).length;
        const bearishEvents = events.filter(
            (e) => e.impact_direction === "DOWN",
        ).length;
        const totalEvents = events.length;

        return {
            bullish: bullishEvents,
            bearish: bearishEvents,
            total: totalEvents,
        };
    }, [events]);

    return (
        <>
            {/* Desktop View - Always Visible Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card
                            key={index}
                            className="p-0 border border-slate-200/50 shadow-slate-100"
                        >
                            <CardContent className="px-4 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-xl font-semibold">
                                            {stat.value}
                                        </p>
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
                                        <Calendar className="size-4 text-violet-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold">
                                            Event Summary
                                        </p>
                                        <p className="text-xs text-slate-600 font-medium">
                                            <span className="text-green-600">
                                                {primaryStats.bullish} Bullish
                                            </span>
                                            <span className="text-slate-400 mx-1">
                                                •
                                            </span>
                                            <span className="text-red-600">
                                                {primaryStats.bearish} Bearish
                                            </span>
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
