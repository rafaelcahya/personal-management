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
        fetch("/api/trade/trade/list")
            .then((r) => r.json())
            .then((d) => {
                d.success && setTradeList(d.trade);
            })
            .catch(toast.error)
            .finally(() => setLoading(false));
    }, []);

    const profitLossColor = (value) =>
        value < 0
            ? "text-trade-loss-foreground"
            : "text-trade-profit-foreground";

    return (
        <main className="flex flex-col gap-2 bg-white rounded-xl border border-gray-200 space-y-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div>
                    <p className="text-lg font-semibold">Trade List</p>
                    <p className="text-sm text-gray-foreground">
                        Quick peek at your trading history — see what’s winning
                        and what’s not.
                    </p>
                </div>
                <Link href="/main/landing/trading-management/trade" prefetch={false} id="tradeBtn">
                    <Button className="bg-primary hover:bg-primary-hover font-medium">
                        Trade
                    </Button>
                </Link>
            </div>
            {loading ? (
                <LoadingComponent description="Loading trade list..." />
            ) : (
                <Table>
                    <TableHeader className="bg-gray-50 rounded-xl">
                        <TableRow className="border-none">
                            <TableHead className="font-medium pr-6 rounded-l-lg text-gray-foreground">
                                Date
                            </TableHead>
                            <TableHead className="font-medium px-6 text-gray-foreground">
                                Ticker
                            </TableHead>
                            <TableHead className="font-medium px-6 text-right text-gray-foreground">
                                Margin
                            </TableHead>
                            <TableHead className="font-medium px-6 text-right text-gray-foreground">
                                Proceeds
                            </TableHead>
                            <TableHead className="font-medium px-6 text-gray-foreground">
                                Return %
                            </TableHead>
                            <TableHead className="font-medium pl-6 text-right rounded-r-lg text-gray-foreground">
                                Realized Gain
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tradeList.slice(0, 10).map((trade, index) => (
                            <TableRow
                                key={index}
                                className="border-dashed hover:bg-gray-50 font-medium"
                            >
                                <TableCell className="pr-6 py-4">
                                    {new Intl.DateTimeFormat("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }).format(new Date(trade.trade_date))}
                                </TableCell>
                                <TableCell className="px-6 uppercase font-semibold text-secondary-foreground">
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
        </main>
    );
}

export default TradeList;
