"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import TradeTable from "./TradeTable";
import LoadingComponent from "../../LoadingComponent";

export default function TradePage() {
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrades = async () => {
            try {
                const res = await fetch("/api/trade/list", {
                    cache: "no-store",
                });
                const data = await res.json();
                if (data.success) setTrades(data.listTrade);
            } catch (err) {
                toast.error("Failed to fetch trades:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchTrades();
    }, []);

    return (
        <main className="flex flex-col gap-5 h-screen w-full mx-auto px-6 py-6 xl:py-20 max-w-full sm:max-w-xl md:max-w-5xl xl:max-w-7xl">
            <Link href="/main/dashboard">
                <Button className="bg-violet-600 hover:bg-violet-700 text-white hover:text-white">
                    <ChevronLeft />
                    Back
                </Button>
            </Link>

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
