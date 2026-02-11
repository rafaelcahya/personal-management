"use client";

import { Badge } from "@/components/ui/badge";

const colorConfig = {
    green: {
        bg: "bg-green-50",
        text: "text-green-600",
        border: "border-green-200",
    },
    red: {
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
    },
    violet: {
        bg: "bg-violet-50",
        text: "text-violet-600",
        border: "border-violet-200",
    },
    blue: {
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
    },
};

export default function MetricCard({
    label,
    value,
    format = "text",
    description,
    color = "violet",
    badge,
}) {
    const colors = colorConfig[color];

    const formatValue = () => {
        if (format === "currency") {
            const num = Number(value) || 0;
            return `Rp ${Math.floor(num).toLocaleString("id-ID")}`;
        }
        if (format === "number") {
            return Math.floor(value || 0).toLocaleString("id-ID");
        }
        return value || "-";
    };

    return (
        <div
            className={`p-4 rounded-lg ${colors.bg} border-2 ${colors.border}`}
        >
            <div className="flex items-start justify-between mb-2">
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                {badge && (
                    <Badge variant="secondary" className="text-xs">
                        {badge}
                    </Badge>
                )}
            </div>
            <p className={`text-2xl font-bold ${colors.text}`}>
                {formatValue()}
            </p>
            {description && (
                <p className="text-xs text-slate-500 mt-2">{description}</p>
            )}
        </div>
    );
}
