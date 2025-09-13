import { CardTitle } from "@/components/ui/card";

export default function MetricValue({
    icon = null,
    label,
    value,
    color = "text-slate-900",
    prefix = "Rp. ",
    format = true,
    indicator = null,
}) {
    const getIndicatorColor = (val) => {
        if (val > 10) return "text-green-500 bg-green-50";
        if (val >= 0) return "text-orange-500 bg-orange-50";
        return "text-rose-500 bg-rose-50";
    };

    const indicatorColor = getIndicatorColor(Number(value));

    return (
        <div>
            <CardTitle className="flex items-center gap-2 font-normal tracking-wide text-sm text-slate-500">
                {icon && <span>{icon}</span>} {label}
            </CardTitle>

            <div className="flex items-center gap-2">
                <p className={`text-lg md:text-xl font-semibold ${color}`}>
                    {format
                        ? `${prefix}${Number(value).toLocaleString("id-ID")}`
                        : value}
                </p>

                {indicator && (
                    <span
                        className={`text-xs font-semibold px-2 py-1 rounded-full ${indicatorColor}`}
                    >
                        {indicator}%
                    </span>
                )}
            </div>
        </div>
    );
}
