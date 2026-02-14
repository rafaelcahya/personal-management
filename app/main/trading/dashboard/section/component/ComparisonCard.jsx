"use client";

export default function ComparisonCard({ label, value, percentage, color }) {
    const colorClasses = {
        red: "bg-red-50 border-none",
        green: "bg-green-50 border-none",
        blue: "bg-blue-50 border-none",
    };

    return (
        <div className={`p-2.5 rounded-lg border ${colorClasses[color]}`}>
            <p className="text-xs text-slate-600 mb-1">{label}</p>
            <p className="text-sm font-bold text-slate-900 leading-tight">
                {value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{percentage}</p>
        </div>
    );
}
