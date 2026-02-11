"use client";

export default function ComparisonCard({ label, value, percentage, color }) {
    const colorClasses = {
        red: "bg-red-50 border-red-200",
        green: "bg-green-50 border-green-200",
        blue: "bg-blue-50 border-blue-200",
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
