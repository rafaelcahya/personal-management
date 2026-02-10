"use client";

export default function RiskGauge({ stdDev, comment, timesToZero }) {
    const getRiskLevel = () => {
        if (stdDev < 100000)
            return { level: "Low", color: "green", percent: 25 };
        if (stdDev < 500000)
            return { level: "Moderate", color: "yellow", percent: 50 };
        if (stdDev < 1000000)
            return { level: "High", color: "orange", percent: 75 };
        return { level: "Very High", color: "red", percent: 100 };
    };

    const risk = getRiskLevel();

    const getColorClasses = () => {
        switch (risk.color) {
            case "green":
                return {
                    bg: "bg-green-500",
                    text: "text-green-600",
                    border: "border-green-300",
                };
            case "yellow":
                return {
                    bg: "bg-yellow-500",
                    text: "text-yellow-600",
                    border: "border-yellow-300",
                };
            case "orange":
                return {
                    bg: "bg-orange-500",
                    text: "text-orange-600",
                    border: "border-orange-300",
                };
            case "red":
                return {
                    bg: "bg-red-500",
                    text: "text-red-600",
                    border: "border-red-300",
                };
            default:
                return {
                    bg: "bg-gray-500",
                    text: "text-gray-600",
                    border: "border-gray-300",
                };
        }
    };

    const colors = getColorClasses();

    return (
        <div className="space-y-4">
            {/* Gauge Visual */}
            <div className="relative">
                <div className="h-4 bg-slate-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${colors.bg} transition-all duration-1000 ease-out`}
                        style={{ width: `${risk.percent}%` }}
                    />
                </div>
                <div className="flex justify-between mt-2 text-xs text-slate-500">
                    <span>Low Risk</span>
                    <span>Moderate</span>
                    <span>High Risk</span>
                </div>
            </div>

            {/* Risk Stats */}
            <div className="grid grid-cols-3 gap-3">
                <div
                    className={`p-3 rounded-lg border-2 ${colors.border} bg-white`}
                >
                    <p className="text-xs text-slate-500 mb-1">Risk Level</p>
                    <p className={`text-lg font-bold ${colors.text}`}>
                        {risk.level}
                    </p>
                </div>
                <div className="p-3 rounded-lg border-2 border-slate-200 bg-white">
                    <p className="text-xs text-slate-500 mb-1">Volatility</p>
                    <p className="text-lg font-bold text-slate-700">
                        {comment}
                    </p>
                </div>
                <div className="p-3 rounded-lg border-2 border-slate-200 bg-white">
                    <p className="text-xs text-slate-500 mb-1">Buffer</p>
                    <p className="text-lg font-bold text-violet-600">
                        {timesToZero}x
                    </p>
                </div>
            </div>

            {/* Info Text */}
            <div className="p-4 bg-white rounded-lg border border-slate-200">
                <p className="text-xs text-slate-600">
                    💡 <span className="font-semibold">Risk Assessment:</span>{" "}
                    Your portfolio can sustain approximately{" "}
                    <span className="font-bold text-violet-600">
                        {timesToZero}
                    </span>{" "}
                    consecutive losing trades before depleting capital, assuming
                    average loss with margin of error.
                </p>
            </div>
        </div>
    );
}
