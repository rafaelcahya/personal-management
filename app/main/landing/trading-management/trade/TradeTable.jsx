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
import Breadcrumbs from "../../../../../components/ui/common/Breadcrumbs";
import SummaryTrade from "./SummaryTrade";

const profitLossColor = (value) =>
    value < 0 ? "text-trade-loss-foreground" : "text-trade-profit-foreground";

export default function TradeTable({ trades: initialTrades }) {
    const [listTrade, setListTrade] = useState(initialTrades || []);
    const [selectedTrade, setSelectedTrade] = useState(null);

    const fetchTrades = async () => {
        try {
            const res = await fetch("/api/trade/trade/list", {
                cache: "no-store",
            });
            const data = await res.json();
            if (data.success) setListTrade(data.trades);
        } catch (err) {
            toast.error("Failed to fetch fees:", err);
        }
    };

    useEffect(() => {
        setListTrade(initialTrades);
    }, [initialTrades]);

    return (
        <div className="shadow border-gray-200 bg-white rounded-xl flex flex-col flex-1 gap-y-6 px-4 sm:px-6 py-6 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div className="space-y-2">
                    <Breadcrumbs />
                    <div>
                        <p className="text-lg font-semibold">Trade List</p>
                        <p className="text-sm text-slate-foreground">
                            Quick peek at your trading history — see what’s
                            winning and what’s not.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Link
                        href="/main/landing/trading-management/dashboard"
                        className="hidden sm:block"
                    >
                        <Button className="bg-transparent hover:bg-secondary text-secondary-foreground font-medium">
                            Back
                        </Button>
                    </Link>
                    <AddNewTrade onAdded={fetchTrades} />
                </div>
            </div>

            <SummaryTrade />

            <div className="relative w-full flex-1 overflow-y-auto">
                {listTrade?.length === 0 ? (
                    <p className="text-center font-medium text-gray-foregroundpy-10">
                        No trades yet. Start by adding a new trade 🚀
                    </p>
                ) : (
                    <Table noWrapper>
                        <TableHeader className="bg-gray-50 rounded-xl sticky top-0 z-10">
                            <TableRow className="border-none">
                                <TableHead className="font-medium text-slate-foreground pr-6 rounded-l-lg">
                                    Date
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground px-6">
                                    Ticker
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground px-6 text-right">
                                    Margin
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground px-6 text-right">
                                    Proceeds
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground px-6">
                                    Return %
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground px-6">
                                    Realized Gain
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground px-6">
                                    Stock Type
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground px-6">
                                    Entry Session
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground px-6">
                                    Entry Occasion
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground px-6 w-[300px] min-w-[300px] max-w-[300px]">
                                    Buy Reason
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground px-6 w-[300px] min-w-[300px] max-w-[300px]">
                                    Sell Reason
                                </TableHead>
                                <TableHead className="font-medium text-slate-foreground pl-6 rounded-r-lg w-[300px] min-w-[300px] max-w-[300px]">
                                    Notes
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {listTrade?.map((trade) => (
                                <TableRow
                                    key={trade.id}
                                    className="font-medium border-dashed hover:bg-gray-50 dark:hover:bg-[#0e0f11] cursor-pointer"
                                    onClick={() => setSelectedTrade(trade)}
                                >
                                    <TableCell className="pr-6 py-4">
                                        {new Intl.DateTimeFormat("id-ID", {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",
                                        }).format(new Date(trade.trade_date))}
                                    </TableCell>
                                    <TableCell className="px-6 uppercase font-semibold text-tertiary-foreground">
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
                                        {trade.stock_type_option}
                                    </TableCell>
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
