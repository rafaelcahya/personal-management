import { CardTitle } from "@/components/ui/card";

export default function CommentedMetric({
    icon = null,
    iconBgStyle,
    label,
    value,
    comment,
    color,
    format = "decimal",
}) {
    const formattedValue =
        format === "currency"
            ? `Rp. ${Number(value).toLocaleString("id-ID", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
              })}`
            : Number(value).toFixed(2);

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <CardTitle className="flex items-center gap-2 font-semibold text-sm text-slate-500  dark:text-gray-400">
                    {icon && <span className={iconBgStyle}>{icon}</span>}{" "}
                    {label}
                </CardTitle>
                <p className="text-lg md:text-xl font-bold">{formattedValue}</p>
            </div>
            {comment && (
                <p className={`text-sm font-semibold ${color}`}>{comment}</p>
            )}
        </div>
    );
}
