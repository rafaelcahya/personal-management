"use client";

import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";

export default function RatioCard({
    icon,
    label,
    value,
    comment,
    threshold = 1,
    description,
}) {
    const isGood = value >= threshold;

    const getColor = () => {
        if (value >= threshold * 1.5) return "text-green-600";
        if (value >= threshold) return "text-blue-600";
        return "text-red-600";
    };

    const getBgColor = () => {
        if (value >= threshold * 1.5) return "bg-green-50";
        if (value >= threshold) return "bg-blue-50";
        return "bg-red-50";
    };

    const getBorderColor = () => {
        if (value >= threshold * 1.5) return "border-green-200";
        if (value >= threshold) return "border-blue-200";
        return "border-red-200";
    };

    return (
        <div
            className={`p-4 rounded-lg border-2 ${getBorderColor()} ${getBgColor()}`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <div className={`${getColor()}`}>{icon}</div>
                    <div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-slate-700">
                                {label}
                            </p>
                            {description && (
                                <HoverCard>
                                    <HoverCardTrigger>
                                        <Info className="size-3.5 text-slate-400 hover:text-slate-600 cursor-help" />
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-64">
                                        <p className="text-xs text-slate-600">
                                            {description}
                                        </p>
                                    </HoverCardContent>
                                </HoverCard>
                            )}
                        </div>
                    </div>
                </div>
                <Badge
                    variant={isGood ? "default" : "destructive"}
                    className="text-xs"
                >
                    {comment}
                </Badge>
            </div>
            <p className={`text-3xl font-bold ${getColor()}`}>{value}</p>
            <div className="mt-3 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                    className={`h-full transition-all duration-500 ${isGood ? "bg-green-500" : "bg-red-500"}`}
                    style={{
                        width: `${Math.min((value / threshold) * 50, 100)}%`,
                    }}
                />
            </div>
        </div>
    );
}
