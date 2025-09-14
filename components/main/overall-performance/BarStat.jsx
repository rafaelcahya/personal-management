import { MinusIcon } from "lucide-react";

export default function BarStat({ label, count, percent, color }) {
    return (
        <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
                <span className="text-xs text-gray-500 dark:text-white">
                    {label}
                </span>
                <MinusIcon className="w-2" />
                <span className="text-xs text-gray-500 dark:text-white">
                    {count}
                </span>
            </div>
            <div className="flex gap-2">
                <div
                    className={`h-5 rounded-lg ${color}`}
                    style={{ width: `${percent}%` }}
                />
                <p
                    className={`text-sm font-semibold ${
                        color
                            .replace("bg-gradient-to-r from-", "text-")
                            .split(" ")[0]
                    }`}
                >
                    {percent}%
                </p>
            </div>
        </div>
    );
}
