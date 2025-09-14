import { CardTitle } from "@/components/ui/card";

export default function CommentedMetric({
    icon = null,
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
            <div>
                <CardTitle className="flex items-center gap-2 font-normal tracking-wide text-sm text-gray-500  dark:text-gray-400">
                    {icon && <span>{icon}</span>} {label}
                </CardTitle>
                <p className="text-lg md:text-xl font-semibold">
                    {formattedValue}
                </p>
            </div>
            {comment && <p className={`text-sm ${color}`}>{comment}</p>}
        </div>
    );
}
