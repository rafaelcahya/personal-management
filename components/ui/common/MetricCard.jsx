"use client";

import { Card, CardContent, CardTitle } from "../card";

export default function MetricCard({
    title,
    value,
    format = "number", // "currency", "percent", "number"
    comment,
    className = "",
    highlight = false,
    valueClassName = "",
    showComment = true,
}) {
    const formatValue = () => {
        const num = Number(value) || 0;

        switch (format) {
            case "currency":
                return `Rp. ${num.toLocaleString("id-ID")}`;
            case "percent":
                return `${num.toFixed(2)}%`;
            case "decimal":
                return `${num.toFixed(2)}`;
            default:
                return num;
        }
    };

    const commentStyleVal = (val, threshold = 1) =>
        val >= threshold ? "text-violet-700" : "text-rose-700";

    const commentStyle = highlight ? commentStyleVal(value) : "";

    return (
        <Card className={className}>
            <CardContent className="space-y-4 p-6">
                <div>
                    <CardTitle className="text-sm text-gray-500 tracking-[0.015em] font-normal">
                        {title}
                    </CardTitle>
                    <p className={`${valueClassName}`}>{formatValue()}</p>
                </div>

                {showComment && comment && (
                    <div className={`${commentStyle}`}>
                        <p className="text-sm">{comment}</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
