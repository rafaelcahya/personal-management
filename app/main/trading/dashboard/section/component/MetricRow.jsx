"use client";

export default function MetricRow({
    label,
    value,
    format = "text",
    icon,
    highlight = false,
}) {
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
            className={`flex justify-between items-center ${highlight ? "py-1" : ""}`}
        >
            <span
                className={`text-xs flex items-center gap-1.5 ${highlight ? "font-semibold text-slate-700" : "text-slate-600"}`}
            >
                {icon && <span className="text-sm">{icon}</span>}
                {label}
            </span>
            <span
                className={`font-bold ${highlight ? "text-base" : "text-sm"} text-slate-900`}
            >
                {formatValue()}
            </span>
        </div>
    );
}
