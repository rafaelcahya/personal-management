import React from "react";

/**
 * CircleStat (SVG)
 * - colorClass: tailwind text color class (e.g. "text-green-500")
 * - percent: 0..100
 */
export default function CircleStat({
    label,
    count,
    percent = 0,
    colorClass = "text-green-500",
    size = 72, // px
    stroke = 8, // width of ring
}) {
    const pct = Math.max(0, Math.min(100, percent));
    const radius = (size - stroke) / 2;
    const cx = size / 2;
    const cy = size / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference * (1 - pct / 100);

    return (
        <div className="flex flex-col items-center gap-2">
            <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className={`-rotate-90 ${colorClass}`}
            >
                <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    stroke="#e6e9ee"
                    strokeWidth={stroke}
                    fill="none"
                />
                <circle
                    cx={cx}
                    cy={cy}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={stroke}
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={offset}
                />
            </svg>

            <div className="absolute translate-y-[-50%] mt-[-44px]">
                <span className="text-sm font-bold">{pct}%</span>
            </div>

            <div className="flex items-center gap-1 text-xs text-slate-500">
                <span className="font-bold">{label}</span>
                <span className="text-slate-400">•</span>
                <span>{count}</span>
            </div>
        </div>
    );
}
