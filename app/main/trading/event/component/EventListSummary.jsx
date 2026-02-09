"use client";

import { Calendar, TrendingUp, TrendingDown, Star } from "lucide-react";

export default function EventListSummary({ events }) {
    const totalEvents = events.length;
    const bullishEvents = events.filter(
        (e) => e.impact_direction === "UP",
    ).length;
    const bearishEvents = events.filter(
        (e) => e.impact_direction === "DOWN",
    ).length;
    const favoriteEvents = events.filter((e) => e.is_favorite).length;

    const stats = [
        {
            label: "Total Events",
            value: totalEvents,
            icon: Calendar,
            color: "text-violet-600",
            bgColor: "bg-violet-50",
        },
        {
            label: "Bullish Impact",
            value: bullishEvents,
            icon: TrendingUp,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            label: "Bearish Impact",
            value: bearishEvents,
            icon: TrendingDown,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            label: "Favorites",
            value: favoriteEvents,
            icon: Star,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
    ];

    return (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="border rounded-xl p-4 bg-white hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
