"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import UpdateTrade from "../UpdateTrade";

export default function TradesTable({ trades, onTradesChange, onRefresh }) {
    const [selectedTrade, setSelectedTrade] = useState(null);

    const profitLossColor = (value) =>
        value < 0 ? "text-red-600" : "text-green-600";

    return (
        <>
            <div className="overflow-x-auto flex-1">
                <Table className="w-full table-auto">
                    <TableHeader className="bg-slate-100 sticky top-0 z-20">
                        <TableRow className="border-none">
                            <TableHead className="py-2 text-slate-foreground rounded-l-lg">
                                Date
                            </TableHead>
                            <TableHead className="py-2 text-slate-foreground">
                                Ticker
                            </TableHead>
                            <TableHead className="py-2 text-slate-foreground text-right">
                                Margin
                            </TableHead>
                            <TableHead className="py-2 text-slate-foreground text-right">
                                Proceeds
                            </TableHead>
                            <TableHead className="py-2 text-slate-foreground">
                                Return %
                            </TableHead>
                            <TableHead className="py-2 text-slate-foreground text-right">
                                P/L
                            </TableHead>
                            <TableHead className="py-2 text-slate-foreground rounded-r-lg">
                                Type
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {trades.map((trade) => (
                            <TableRow
                                key={trade.id}
                                className="hover:bg-slate-100 cursor-pointer"
                                onClick={() => setSelectedTrade(trade)}
                            >
                                <TableCell className="font-medium">
                                    {new Date(
                                        trade.trade_date,
                                    ).toLocaleDateString("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </TableCell>
                                <TableCell className="font-bold uppercase text-violet-600">
                                    {trade.ticker}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    Rp{" "}
                                    {Number(trade.margin).toLocaleString(
                                        "id-ID",
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    Rp{" "}
                                    {Number(trade.proceeds).toLocaleString(
                                        "id-ID",
                                    )}
                                </TableCell>
                                <TableCell
                                    className={`font-semibold ${profitLossColor(
                                        parseFloat(trade.return_percent),
                                    )}`}
                                >
                                    {trade.return_percent}
                                </TableCell>
                                <TableCell
                                    className={`text-right font-mono font-semibold ${profitLossColor(
                                        Number(trade.realized_gain),
                                    )}`}
                                >
                                    Rp{" "}
                                    {Number(trade.realized_gain).toLocaleString(
                                        "id-ID",
                                    )}
                                </TableCell>
                                <TableCell className="text-sm">
                                    {trade.stock_type_option}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {selectedTrade && (
                <UpdateTrade
                    trade={selectedTrade}
                    onClose={() => setSelectedTrade(null)}
                    onUpdated={async () => {
                        await onRefresh();
                        setSelectedTrade(null);
                    }}
                />
            )}
        </>
    );
}
