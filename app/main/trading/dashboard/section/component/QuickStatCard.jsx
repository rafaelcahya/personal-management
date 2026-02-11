"use client";

import { Badge } from "@/components/ui/badge";

export default function QuickStatCard({ label, value, color, icon, badge }) {
    const colorClasses = {
        green: "bg-green-50 border-green-200 text-green-700",
        red: "bg-red-50 border-red-200 text-red-700",
        blue: "bg-blue-50 border-blue-200 text-blue-700",
        violet: "bg-violet-50 border-violet-200 text-violet-700",
    };

    return (
        <div className={`p-3 rounded-lg border-2 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium opacity-80">{label}</span>
                {icon}
            </div>
            <p className="text-base font-bold leading-none mb-1">{value}</p>
            {badge && (
                <Badge variant="secondary" className="text-xs h-5">
                    {badge}
                </Badge>
            )}
        </div>
    );
}
