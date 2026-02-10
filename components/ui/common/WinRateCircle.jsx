"use client";

import { useMemo } from "react";

export default function WinRateCircle({ label, count, percent, color, total }) {
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percent / 100) * circumference;

    const gradientId = useMemo(
        () => `gradient-${label.replace(/\s/g, "")}`,
        [label],
    );

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="relative">
                <svg width="120" height="120" className="transform -rotate-90">
                    {/* Background circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke="#E2E8F0"
                        strokeWidth="10"
                    />
                    {/* Progress circle */}
                    <circle
                        cx="60"
                        cy="60"
                        r="45"
                        fill="none"
                        stroke={color}
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        className="transition-all duration-1000 ease-out"
                    />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-2xl font-bold" style={{ color }}>
                        {percent}%
                    </p>
                    <p className="text-xs text-slate-500">{count} trades</p>
                </div>
            </div>
            <div className="text-center">
                <p className="text-sm font-semibold text-slate-700">{label}</p>
                <p className="text-xs text-slate-500">
                    {count} of {total} trades
                </p>
            </div>
        </div>
    );
}
