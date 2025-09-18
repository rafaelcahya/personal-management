import React, { useEffect, useState } from "react";
import { toast } from "sonner";

function SummaryTrade() {
    const [metrics, setMetrics] = useState({});
    const [listTrade, setListTrade] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([
            fetch("/api/metrics").then((r) => r.json()),
            fetch("/api/trade/list").then((r) => r.json()),
        ])
            .then(([metricsRes, tradeRes]) => {
                if (metricsRes.success) setMetrics(metricsRes.data);
                if (tradeRes.success) setListTrade(tradeRes.listTrade);
            })
            .catch(toast.error)
            .finally(() => setLoading(false));
    }, []);

    const { totalTrade, winCount, loseCount } = metrics || {};

    // --- Hitung summary untuk entry_session_option & entry_occasion_option
    const sessionSummary = listTrade.reduce((acc, trade) => {
        const key = trade.entry_session_option || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    const occasionSummary = listTrade.reduce((acc, trade) => {
        const key = trade.entry_occasion_option || "Unknown";
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
            {/* --- Basic Summary --- */}
            <div className="p-4 border-slate-200 border dark:border-none bg-white dark:bg-[#1c1d21] rounded-xl w-full">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Progress Overview
                </p>
                <ul className="text-sm space-y-1">
                    <li className="flex justify-between">
                        <span className="font-semibold">Total Trade</span>
                        <span className="font-semibold">{totalTrade}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-semibold">Total Win</span>
                        <span className="font-semibold">{winCount}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-semibold">Total Lose</span>
                        <span className="font-semibold">{loseCount}</span>
                    </li>
                </ul>
            </div>

            {/* --- Entry Session Summary --- */}
            <div className="p-4 border-slate-200 border dark:border-none bg-white dark:bg-[#1c1d21] rounded-xl w-full">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Entry Session
                </p>
                <ul className="text-sm space-y-1">
                    {Object.entries(sessionSummary).map(([session, count]) => (
                        <li key={session} className="flex justify-between">
                            <span className="font-semibold">{session}</span>
                            <span className="font-semibold">{count}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* --- Entry Occasion Summary --- */}
            <div className="p-4 border-slate-200 border dark:border-none bg-white dark:bg-[#1c1d21] rounded-xl w-full">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Entry Occasion
                </p>
                <ul className="text-sm space-y-1">
                    {Object.entries(occasionSummary).map(
                        ([occasion, count]) => (
                            <li key={occasion} className="flex justify-between">
                                <span className="font-semibold">
                                    {occasion}
                                </span>
                                <span className="font-semibold">{count}</span>
                            </li>
                        )
                    )}
                </ul>
            </div>
        </div>
    );
}

export default SummaryTrade;
