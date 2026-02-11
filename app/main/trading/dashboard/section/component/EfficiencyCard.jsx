"use client";

export default function EfficiencyCard({ label, value, color, subtitle }) {
    const colorClasses = {
        green: "bg-green-50/50 border-green-200",
        red: "bg-red-50/50 border-red-200",
        blue: "bg-blue-50/50 border-blue-200",
        violet: "bg-violet-50/50 border-violet-200",
    };

    return (
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
            <p className="text-xs text-slate-600 mb-1">{label}</p>
            <p className="text-base font-bold text-slate-900 leading-none">
                {value}
            </p>
            {subtitle && (
                <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
            )}
        </div>
    );
}
