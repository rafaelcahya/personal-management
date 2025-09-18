"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import AddNewTrade from "./AddTrade";
import TradeUpdate from "./UpdateTrade";
import Breadcrumbs from "../../../components/ui/common/Breadcrumbs";
import { ChevronLeft } from "lucide-react";
import SummaryTrade from "./SummaryTrade";

// Helper styling untuk profit/loss
const profitLossColor = (value) =>
    value < 0 ? "text-rose-600" : "text-green-600";

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
        <div className="shadow-[0_0_75px_16px_rgba(202,213,226,0.5)] dark:shadow-none border-slate-200 dark:border-none bg-white dark:bg-[#111214] rounded-xl flex flex-col flex-1 gap-y-6 p-6 overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div className="space-y-2">
                    <Breadcrumbs />
                    <div>
                        <p className="text-lg font-bold">Trade List</p>
                        <p className="text-sm font-semibold text-slate-500 dark:text-gray-400">
                            Quick peek at your trading history — see what’s
                            winning and what’s not.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Link href="/main/dashboard" className="hidden sm:block">
                        <Button className="bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 text-violet-600 font-semibold">
                            Back
                        </Button>
                    </Link>
                    <AddNewTrade onAdded={fetchTrades} />
                </div>
            </div>

            <SummaryTrade />

            {/* Table Section */}
            <div className="relative w-full flex-1 overflow-y-auto">
                {listTrade.length === 0 ? (
                    <p className="text-center font-semibold text-slate-500 dark:text-gray-400 py-10">
                        No trades yet. Start by adding a new trade 🚀
                    </p>
                ) : (
                    <Table noWrapper>
                        <TableHeader className="bg-violet-100 dark:bg-[#0e0f11] rounded-xl sticky top-0 z-10">
                            <TableRow className="border-none">
                                <TableHead className="font-semibold pr-6 rounded-l-lg">
                                    Date
                                </TableHead>
                                <TableHead className="font-semibold px-6">
                                    Ticker
                                </TableHead>
                                <TableHead className="font-semibold px-6 text-right">
                                    Margin
                                </TableHead>
                                <TableHead className="font-semibold px-6 text-right">
                                    Proceeds
                                </TableHead>
                                <TableHead className="font-semibold px-6">
                                    Return %
                                </TableHead>
                                <TableHead className="font-semibold px-6">
                                    Realized Gain
                                </TableHead>
                                <TableHead className="font-semibold px-6">
                                    Entry Session
                                </TableHead>
                                <TableHead className="font-semibold px-6">
                                    Entry Occasion
                                </TableHead>
                                <TableHead className="font-semibold px-6 w-[300px] min-w-[300px] max-w-[300px]">
                                    Buy Reason
                                </TableHead>
                                <TableHead className="font-semibold px-6 w-[300px] min-w-[300px] max-w-[300px]">
                                    Sell Reason
                                </TableHead>
                                <TableHead className="font-semibold pl-6 rounded-r-lg w-[300px] min-w-[300px] max-w-[300px]">
                                    Notes
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {listTrade.map((trade) => (
                                <TableRow
                                    key={trade.id}
                                    className="font-semibold border-dashed hover:bg-violet-100 dark:hover:bg-[#0e0f11] cursor-pointer"
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
