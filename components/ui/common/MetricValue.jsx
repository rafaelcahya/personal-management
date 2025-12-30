import { TrendingUp, TrendingDown } from "lucide-react";

export default function MetricValue({
    icon = null,
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
        if (val > 10)
            return "text-trade-profit-foreground bg-trade-profit";
        if (val > 0) return "text-trade-warning-foreground bg-trade-warning";
        if (val === 0) return "text-slate-500 bg-slate-200 dark:bg-slate-500/5";
        return "text-trade-loss-foreground bg-trade-loss";
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
            <div className="flex items-center gap-2 font-semibold text-sm whitespace-nowrap text-gray-foreground">
                {icon && <span>{icon}</span>}
            </div>

            <div className="flex flex-col gap-2">
                <div className="space-y-2">
                    <div className="flex gap-2 items-center">
                        <p className={`text-lg font-semibold ${color}`}>
                            {displayValue}
                        </p>
                        {indicator2 !== null && (
                            <span
                                className={`text-xs font-medium px-2 py-1 rounded-lg ${indicator2Color} ${indicatorStyle}`}
                            >
                                {indicator2}%
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-medium text-gray-foreground uppercase tracking-wide">
                        {label}
                    </p>
                </div>

                {indicator1 !== null && (
                    <div className="flex items-center gap-2">
                        <span
                            className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg ${indicatorColor} ${indicatorStyle}`}
                        >
                            {indicator1 > 0 && (
                                <TrendingUp className="w-3 h-3" />
                            )}
                            {indicator1 < 0 && (
                                <TrendingDown className="w-3 h-3" />
                            )}
                            {indicator1}%
                        </span>
                        <p className="text-xs text-gray-foreground">{unit}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
