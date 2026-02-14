"use client";

export default function RiskStatCard({ label, value, subtitle, color, icon }) {
    const colorClasses = {
        red: "bg-red-50 border-none text-red-700",
        blue: "bg-blue-50 border-none text-blue-700",
        violet: "bg-violet-50 border-none text-violet-700",
        amber: "bg-amber-50 border-none text-amber-700",
    };

    return (
        <div className={`p-3 rounded-lg border-2 ${colorClasses[color]}`}>
            <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-medium opacity-80">{label}</span>
                {icon}
            </div>
            <p className="text-lg font-bold leading-none mb-0.5">{value}</p>
            <p className="text-xs opacity-60">{subtitle}</p>
        </div>
    );
}
