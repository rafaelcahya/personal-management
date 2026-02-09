"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchTradeList } from "@/lib/api/trade";
import { toast } from "sonner";
import TradeListSummary from "./list/component/TradeListSummary";
import TradeTableHeader from "./list/component/TradeTableHeader";
import TradesTable from "./list/TradesTable";
import AddTrade from "./AddTrade";

export default function TradesPageClient({ initialTrades }) {
    const [listTrade, setListTrade] = useState(initialTrades || []);

    const fetchTrades = useCallback(async () => {
        try {
            const trades = await fetchTradeList();
            setListTrade(trades || []);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error(err.message || "Failed to fetch trades");
        }
    }, []);

    useEffect(() => {
        if (initialTrades && initialTrades.length > 0) {
            setListTrade(initialTrades);
        } else {
            fetchTrades();
        }
    }, [initialTrades, fetchTrades]);

    return (
        <div className="flex flex-col h-full gap-5">
            <TradeListSummary trades={listTrade} />

            <div className="flex-1 min-h-0 relative border rounded-xl overflow-hidden flex flex-col p-5 bg-white">
                <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-3">
                        <div className="max-w-[500px]">
                            <TradeTableHeader />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <AddTrade onAdded={fetchTrades} />
                        </div>
                    </div>

                    {listTrade.length === 0 ? (
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
