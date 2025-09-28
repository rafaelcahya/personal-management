"use client";

import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";

function SummaryTrade() {
    const [metrics, setMetrics] = useState({});
    const [listTrade, setListTrade] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch("/api/metrics").then((r) => r.json()),
            fetch("/api/trade/list").then((r) => r.json()),
        ])
            .then(([metricsRes, tradeRes]) => {
                if (metricsRes.success) setMetrics(metricsRes.data);
                if (tradeRes.success) setListTrade(tradeRes.trade);
            })
            .catch(toast.error)
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 640); // < sm
        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { totalTrade, winCount, loseCount } = metrics || {};

    // --- Hitung summary
    const stockTypeSummary =
        listTrade?.reduce((acc, trade) => {
            const key = trade.stock_type_option || "Unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {}) || {};

    const sessionSummary =
        listTrade?.reduce((acc, trade) => {
            const key = trade.entry_session_option || "Unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {}) || {};

    const occasionSummary =
        listTrade?.reduce((acc, trade) => {
            const key = trade.entry_occasion_option || "Unknown";
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {}) || {};

    const SummaryContent = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
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

            {/* --- Stock Type Summary --- */}
            <div className="p-4 border-slate-200 border dark:border-none bg-white dark:bg-[#1c1d21] rounded-xl w-full">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-1">
                    Stock Type
                </p>
                <ul className="text-sm space-y-1">
                    {Object.entries(stockTypeSummary).map(
                        ([stockType, count]) => (
                            <li
                                key={stockType}
                                className="flex justify-between"
                            >
                                <span className="font-semibold">
                                    {stockType}
                                </span>
                                <span className="font-semibold">{count}</span>
                            </li>
                        )
                    )}
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

    if (loading) return <p>Loading summary...</p>;

    return (
        <>
            {/* Mobile: pakai dialog */}
            {isMobile ? (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-violet-100 hover:bg-violet-700 text-violet-600 font-semibold">
                            View Summary
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                        <DialogHeader className="text-left font-semibold">
                            <DialogTitle>Trade Summary</DialogTitle>
                            <DialogDescription>
                                Overview of your trading performance and
                                breakdown.
                            </DialogDescription>
                        </DialogHeader>
                        <SummaryContent />
                    </DialogContent>
                </Dialog>
            ) : (
                // Desktop / Tablet
                <SummaryContent />
            )}
        </>
    );
}

export default SummaryTrade;
