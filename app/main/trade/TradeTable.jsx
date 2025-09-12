"use client";

import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import AddNewTrade from "./AddTrade";
import TradeUpdate from "./UpdateTrade";

// 🔹 Helper styling untuk profit/loss
const profitLossColor = (value) =>
    value < 0 ? "text-rose-600" : "text-emerald-600";

export default function TradeTable({ trades: initialTrades }) {
    const [listTrade, setListTrade] = useState(initialTrades || []);
    const [selectedTrade, setSelectedTrade] = useState(null);

    const fetchTrades = async () => {
        try {
            const res = await fetch("/api/trade/list", { cache: "no-store" });
            const data = await res.json();
            if (data.success) setListTrade(data.listTrade);
        } catch (err) {
            toast.error("Failed to fetch fees:", err);
        }
    };

    useEffect(() => {
        setListTrade(initialTrades);
    }, [initialTrades]);

    return (
        <div className="shadow shadow-black/5 border-none bg-white/70 backdrop-blur-3xl flex flex-col flex-1 p-6 rounded-2xl overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div>
                    <p className="text-lg font-semibold tracking-[0.010em]">
                        Trade List
                    </p>
                    <p className="text-sm text-gray-500">
                        Quick peek at your trading history — see what’s winning
                        and what’s not.
                    </p>
                </div>
                <div>
                    <AddNewTrade onAdded={fetchTrades} />
                </div>
            </div>

            {/* Table Section */}
            <div className="relative w-full flex-1 overflow-y-auto mt-4">
                {listTrade.length === 0 ? (
                    <p className="text-center text-gray-500 py-10">
                        No trades yet. Start by adding a new trade 🚀
                    </p>
                ) : (
                    <Table noWrapper>
                        <TableHeader className="bg-violet-50 rounded-xl sticky top-0 z-10">
                            <TableRow className="border-none">
                                <TableHead className="pr-6 rounded-l-lg">
                                    Date
                                </TableHead>
                                <TableHead className="px-6">Ticker</TableHead>
                                <TableHead className="px-6 text-right">
                                    Margin
                                </TableHead>
                                <TableHead className="px-6 text-right">
                                    Proceeds
                                </TableHead>
                                <TableHead className="px-6">Return %</TableHead>
                                <TableHead className="px-6">
                                    Realized Gain
                                </TableHead>
                                <TableHead className="px-6">
                                    Entry Session
                                </TableHead>
                                <TableHead className="px-6">
                                    Entry Occasion
                                </TableHead>
                                <TableHead className="px-6 w-[300px] min-w-[300px] max-w-[300px]">
                                    Buy Reason
                                </TableHead>
                                <TableHead className="px-6 w-[300px] min-w-[300px] max-w-[300px]">
                                    Sell Reason
                                </TableHead>
                                <TableHead className="pl-6 rounded-r-lg w-[300px] min-w-[300px] max-w-[300px]">
                                    Notes
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {listTrade.map((trade) => (
                                <TableRow
                                    key={trade.id}
                                    className="border-dashed hover:bg-violet-50 cursor-pointer"
                                    onClick={() => setSelectedTrade(trade)}
                                >
                                    <TableCell className="pr-6 py-4">
                                        {new Intl.DateTimeFormat("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }).format(new Date(trade.trade_date))}
                                    </TableCell>
                                    <TableCell className="px-6 uppercase font-bold text-violet-600">
                                        {trade.ticker}
                                    </TableCell>
                                    <TableCell className="px-6 text-right">{`Rp. ${Number(
                                        trade.margin
                                    ).toLocaleString("id-ID")}`}</TableCell>
                                    <TableCell className="px-6 text-right">{`Rp. ${Number(
                                        trade.proceeds
                                    ).toLocaleString("id-ID")}`}</TableCell>
                                    <TableCell
                                        className={`px-6 ${profitLossColor(
                                            parseFloat(trade.return_percent)
                                        )}`}
                                    >
                                        {trade.return_percent}
                                    </TableCell>
                                    <TableCell
                                        className={`px-6 text-right ${profitLossColor(
                                            trade.realized_gain
                                        )}`}
                                    >{`Rp. ${Number(
                                        trade.realized_gain
                                    ).toLocaleString("id-ID")}`}</TableCell>
                                    <TableCell className="px-6">
                                        {trade.entry_session_option}
                                    </TableCell>
                                    <TableCell className="px-6">
                                        {trade.entry_occasion_option}
                                    </TableCell>
                                    <TableCell className="px-6 w-[300px] whitespace-normal">
                                        {trade.buy_reason_option}
                                    </TableCell>
                                    <TableCell className="px-6 w-[300px] whitespace-normal">
                                        {trade.sell_reason_option}
                                    </TableCell>
                                    <TableCell className="pl-6 w-[300px] whitespace-normal">
                                        {trade.notes}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Modal Update */}
                {selectedTrade && (
                    <TradeUpdate
                        trade={selectedTrade}
                        onClose={() => setSelectedTrade(null)}
                        onUpdated={fetchTrades}
                    />
                )}
            </div>
        </div>
    );
}
