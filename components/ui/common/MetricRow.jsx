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
            return `Rp ${value?.toLocaleString("id-ID") || 0}`;
        }
        if (format === "number") {
            return value?.toLocaleString("id-ID") || 0;
        }
        return value || "-";
    };

    return (
        <div
            className={`flex justify-between items-center ${highlight ? "py-2" : ""}`}
        >
            <span
                className={`text-sm flex items-center gap-2 ${highlight ? "font-semibold" : "text-slate-600"}`}
            >
                {icon && <span>{icon}</span>}
                {label}
            </span>
            <span className={`font-bold ${highlight ? "text-lg" : "text-sm"}`}>
                {formatValue()}
            </span>
        </div>
    );
}
