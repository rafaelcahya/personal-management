"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import TradeTable from "./TradeTable";
import LoadingComponent from "../../../../LoadingComponent";

export default function TradePage() {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const res = await fetch("/api/trade/trade/list", {
                    cache: "no-store",
                });
                const data = await res.json();
                if (data.success) setTrades(data.trade);
            } catch (err) {
                toast.error("Failed to fetch trades:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrades();
    }, []);

    return (
        <main className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-20 max-w-full md:max-w-5xl xl:max-w-7xl">
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                <div className="absolute inset-0 bg-slate-50"></div>
            </div>
            {loading ? (
                <div className="flex flex-1 items-center justify-center">
                    <LoadingComponent description="Loading all trades..." />
                </div>
            ) : (
                <TradeTable trades={trades} />
            )}
        </main>
    );
}
