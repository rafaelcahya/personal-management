"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchTradeList, fetchTradeSummary } from "@/lib/api/trade";
import { toast } from "sonner";
import TradeListSummary from "./list/component/TradeListSummary";
import TradeTableHeader from "./list/component/TradeTableHeader";
import TradesTable from "./list/TradesTable";
import AddTrade from "./AddTrade";

export default function TradesPageClient({ initialTrades }) {
    const [listTrade, setListTrade] = useState(initialTrades || []);
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState({
        totalTrades: 0,
        totalWins: 0,
        totalLosses: 0,
        totalProfit: 0,
        netPnL: 0,
    });

    const fetchSummary = useCallback(async () => {
        try {
            const data = await fetchTradeSummary();
            setSummary(data);
        } catch (err) {
            console.error("Summary fetch error:", err);
        }
    }, []);

    const fetchTrades = useCallback(async () => {
        try {
            setIsLoading(true);
            const [trades] = await Promise.all([
                fetchTradeList(),
                fetchSummary(),
            ]);
            setListTrade(trades || []);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error(err.message || "Failed to fetch trades");
        } finally {
            setIsLoading(false);
        }
    }, [fetchSummary]);

    useEffect(() => {
        fetchSummary();

        if (!initialTrades || initialTrades.length === 0) {
            fetchTrades();
        }
    }, []);

    return (
        <div className="flex flex-col h-full gap-5">
            <TradeListSummary summary={summary} />

            <div className="flex-1 min-h-0 relative border border-slate-200/50 shadow-slate-100 rounded-xl overflow-hidden flex flex-col p-5 bg-white">
                <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-3">
                        <div className="max-w-[500px]">
                            <TradeTableHeader />
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <AddTrade onAdded={fetchTrades} />
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="size-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                            <p className="text-sm text-slate-600 font-medium">
                                Loading trades...
                            </p>
                        </div>
                    ) : listTrade.length === 0 ? (
                        <p className="text-center font-medium text-slate-foreground py-10">
                            No trades yet. Start by adding your first trade 📈
                        </p>
                    ) : (
                        <TradesTable
                            trades={listTrade}
                            onTradesChange={setListTrade}
                            onRefresh={fetchTrades}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
