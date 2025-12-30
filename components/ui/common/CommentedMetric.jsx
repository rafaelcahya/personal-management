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
                <div className="flex items-center gap-2 font-semibold text-sm text-gray-foreground">
                    {icon && <span>{icon}</span>}
                </div>
                <p className="text-lg md:text-xl font-semibold">
                    {formattedValue}
                </p>
                <p className="text-xs font-medium text-gray-foreground uppercase tracking-wide">
                    {label}
                </p>
            </div>
            {comment && (
                <p className={`text-sm font-medium ${color}`}>{comment}</p>
            )}
        </div>
    );
}
