"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

const colorConfig = {
    violet: {
        bg: "bg-violet-50",
        icon: "bg-violet-100",
        text: "text-violet-600",
        shadow: "shadow-violet-200/50",
    },
    green: {
        bg: "bg-green-50",
        icon: "bg-green-100",
        text: "text-green-600",
        shadow: "shadow-green-200/50",
    },
    red: {
        bg: "bg-red-50",
        icon: "bg-red-100",
        text: "text-red-600",
        shadow: "shadow-red-200/50",
    },
    blue: {
        bg: "bg-blue-50",
        icon: "bg-blue-100",
        text: "text-blue-600",
        shadow: "shadow-blue-200/50",
    },
    amber: {
        bg: "bg-amber-50",
        icon: "bg-amber-100",
        text: "text-amber-600",
        shadow: "shadow-amber-200/50",
    },
};

export default function StatCard({
    title,
    value,
    format = "text",
    icon,
    badge,
    badgeVariant = "default",
    subtitle,
    trend,
    color = "violet",
}) {
    const colors = colorConfig[color];

    const formatValue = () => {
        if (format === "currency") {
            return `Rp ${value?.toLocaleString("id-ID") || 0}`;
        }
        if (format === "number") {
            return value?.toLocaleString("id-ID") || 0;
        }
        return value || "-";
    };

    return (
        <Card className={`shadow-md ${colors.shadow} border-none ${colors.bg}`}>
            <CardContent>
                <div className="flex items-start justify-between mb-3">
                    <div className={`p-2.5 rounded-lg ${colors.icon}`}>
                        <div className={colors.text}>{icon}</div>
                    </div>
                    {badge && (
                        <Badge
                            variant={badgeVariant}
                            className="text-xs font-medium"
                        >
                            {badge}
                        </Badge>
                    )}
                </div>
                <div>
                    <p className="text-xs text-slate-500 mb-1 font-medium">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-slate-900">
                            {formatValue()}
                        </p>
                        {trend === "up" && (
                            <ArrowUpRight className="size-5 text-green-600" />
                        )}
                        {trend === "down" && (
                            <ArrowDownRight className="size-5 text-red-600" />
                        )}
                    </div>
                    {subtitle && (
                        <p className="text-xs text-slate-500 mt-2">
                            {subtitle}
                        </p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
