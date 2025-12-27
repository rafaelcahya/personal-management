import { CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricValue({
    icon = null,
    iconBgStyle,
    label,
    value,
    color = "text-gray-900 dark:text-white",
    prefix = "Rp. ",
    displayMode = "currency", // "currency" | "number" | "raw"
    indicator1 = null,
    indicator2 = null,
    indicatorStyle,
    unit,
}) {
    const getIndicatorColor = (val) => {
        if (val > 10) return "text-green-500 bg-green-50 dark:bg-green-500/5";
        if (val > 0)
            return "text-orange-500 bg-orange-50 dark:bg-orange-500/5";
        if (val === 0) return "text-slate-500 bg-slate-200 dark:bg-slate-500/5";
        return "text-rose-500 bg-rose-50 dark:bg-rose-500/5";
    };

    const indicatorColor = getIndicatorColor(Number(indicator1));
    const indicator2Color = getIndicatorColor(Number(indicator2));

    const displayValue = (() => {
        switch (displayMode) {
            case "number":
                return Number(value).toLocaleString("id-ID");
            case "currency":
                return `${prefix}${Number(value).toLocaleString("id-ID")}`;
            case "raw":
            default:
                return value;
        }
    })();

    return (
        <div className="space-y-2">
            <CardTitle className="flex items-center gap-2 font-semibold text-sm whitespace-nowrap text-slate-700 dark:text-slate-400">
                {icon && <span className={iconBgStyle}>{icon}</span>} {label}
            </CardTitle>

            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <p className={`text-lg md:text-xl font-bold ${color}`}>
                        {displayValue}
                    </p>

                    {indicator2 !== null && (
                        <span
                            className={`text-xs font-semibold px-2 py-1 rounded-lg ${indicator2Color} ${indicatorStyle}`}
                        >
                            {indicator2}%
                        </span>
                    )}
                </div>

                {indicator1 !== null && (
                    <div className="flex items-center gap-2">
                        <span
                            className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${indicatorColor} ${indicatorStyle}`}
                        >
                            {indicator1 > 0 && (
                                <TrendingUp className="w-3 h-3" />
                            )}
                            {indicator1 < 0 && (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {indicator1}%
                        </span>
                        <p className="text-xs font-medium text-gray-500 dark:text-slate-400">
                            {unit}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
