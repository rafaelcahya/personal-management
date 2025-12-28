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
    const [summary, setSummary] = useState({});
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch("/api/trade/summary").then((r) => r.json()),
            fetch("/api/trade/list").then((r) => r.json()),
        ])
            .then(([summaryRes]) => {
                if (summaryRes.success) setSummary(summaryRes.data);
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

    const {
        totalTrades,
        totalWins,
        totalLosses,
        stockTypeSummary,
        entrySessionSummary,
        entryOccasionSummary,
    } = summary || {};

    const SummaryContent = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-4">
            <div className="p-4 border-gray-200 border bg-white rounded-xl w-full">
                <p className="text-sm font-semibold text-gray-foreground mb-1">
                    Progress Overview
                </p>
                <ul className="text-sm space-y-1">
                    <li className="flex justify-between">
                        <span className="font-semibold">Total Trade</span>
                        <span className="font-semibold">{totalTrades}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-semibold">Total Win</span>
                        <span className="font-semibold">{totalWins}</span>
                    </li>
                    <li className="flex justify-between">
                        <span className="font-semibold">Total Lose</span>
                        <span className="font-semibold">{totalLosses}</span>
                    </li>
                </ul>
            </div>

            <div className="p-4 border-gray-200 border dark:border-none bg-white dark:bg-[#1c1d21] rounded-xl w-full">
                <p className="text-sm font-semibold text-gray-foreground mb-1">
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

            <div className="p-4 border-gray-200 border dark:border-none bg-white dark:bg-[#1c1d21] rounded-xl w-full">
                <p className="text-sm font-semibold text-gray-foreground mb-1">
                    Entry Session
                </p>
                <ul className="text-sm space-y-1">
                    {Object.entries(entrySessionSummary).map(
                        ([session, count]) => (
                            <li key={session} className="flex justify-between">
                                <span className="font-semibold">{session}</span>
                                <span className="font-semibold">{count}</span>
                            </li>
                        )
                    )}
                </ul>
            </div>

            <div className="p-4 border-gray-200 border dark:border-none bg-white dark:bg-[#1c1d21] rounded-xl w-full">
                <p className="text-sm font-semibold text-gray-foreground mb-1">
                    Entry Occasion
                </p>
                <ul className="text-sm space-y-1">
                    {Object.entries(entryOccasionSummary).map(
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
            {isMobile ? (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-secondary hover:bg-secondary-hover text-secondary-foreground font-medium w-full">
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
                <SummaryContent />
            )}
        </>
    );
}

export default SummaryTrade;
