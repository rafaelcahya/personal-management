"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

const healthConfig = {
    excellent: {
        color: "bg-green-500",
        label: "Excellent",
        icon: "🎯",
        gradient: "from-green-500 to-emerald-600",
    },
    good: {
        color: "bg-blue-500",
        label: "Good",
        icon: "📈",
        gradient: "from-blue-500 to-cyan-600",
    },
    fair: {
        color: "bg-yellow-500",
        label: "Fair",
        icon: "⚠️",
        gradient: "from-yellow-500 to-orange-600",
    },
    poor: {
        color: "bg-red-500",
        label: "Needs Attention",
        icon: "🔴",
        gradient: "from-red-500 to-rose-600",
    },
    neutral: {
        color: "bg-gray-400",
        label: "No Data",
        icon: "📊",
        gradient: "from-gray-400 to-slate-500",
    },
};

export default function DashboardHeader({ portfolioHealth, loading }) {
    const health = healthConfig[portfolioHealth];

    return (
        <Card
            className={`bg-gradient-to-br ${health.gradient} text-white border-none overflow-hidden relative`}
        >
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

            <CardContent className="p-6 relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="size-6" />
                            <h1 className="text-2xl font-bold">
                                Trading Dashboard
                            </h1>
                        </div>
                        <p className="text-white/90 text-sm">
                            Complete performance overview and analytics
                        </p>
                    </div>

                    {!loading && (
                        <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3">
                            <div className="text-right">
                                <p className="text-xs text-white/80 mb-0.5">
                                    Portfolio Health
                                </p>
                                <p className="text-lg font-bold flex items-center gap-2">
                                    <span className="text-2xl">
                                        {health.icon}
                                    </span>
                                    {health.label}
                                </p>
                            </div>
                            <div
                                className={`w-3 h-3 rounded-full ${health.color} animate-pulse shadow-lg`}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
