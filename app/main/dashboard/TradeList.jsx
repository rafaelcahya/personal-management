"use client";

import React, { useEffect, useState } from "react";
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
import LoadingComponent from "@/app/LoadingComponent";

function TradeList() {
    const [tradeList, setTradeList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/trade/list")
            .then((r) => r.json())
            .then((d) => {
                d.success && setTradeList(d.listTrade);
            })
            .catch(toast.error)
            .finally(() => setLoading(false));
    }, []);

    const profitLossColor = (value) =>
        value < 0 ? "text-rose-600" : "text-green-600";

    return (
        <div className="shadow-black/5 shadow-lg border-none bg-white dark:bg-[#1a1b1e] backdrop-blur-2xl rounded-xl space-y-4 p-6 overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div>
                    <p className="text-lg font-semibold tracking-[0.010em]">
                        Trade List
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        Quick peek at your trading history — see what’s winning
                        and what’s not.
                    </p>
                </div>
                <Link href="/main/trade" prefetch={false}>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white hover:text-white">
                        Trade
                    </Button>
                </Link>
            </div>
            {loading ? (
                <LoadingComponent description="Loading trade list..." />
            ) : (
                <Table>
                    <TableHeader className="bg-violet-100 dark:bg-[#0e0f11] rounded-xl">
                        <TableRow className="border-none">
                            <TableHead className="pr-6 rounded-l-lg">
                                Date
                            </TableHead>
                            <TableHead className="px-6 ">Ticker</TableHead>
                            <TableHead className="px-6 text-right">
                                Margin
                            </TableHead>
                            <TableHead className="px-6 text-right">
                                Proceeds
                            </TableHead>
                            <TableHead className="px-6 ">Return %</TableHead>
                            <TableHead className="pl-6 text-right rounded-r-lg">
                                Realized Gain
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tradeList.slice(0, 10).map((trade, index) => (
                            <TableRow
                                key={index}
                                className="border-dashed hover:bg-violet-100 dark:hover:bg-[#0e0f11]"
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
                                    className={`pl-6 text-right ${profitLossColor(
                                        trade.realized_gain
                                    )}`}
                                >{`Rp. ${Number(
                                    trade.realized_gain
                                ).toLocaleString("id-ID")}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
}

export default TradeList;
