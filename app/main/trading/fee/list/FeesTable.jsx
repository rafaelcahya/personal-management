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
import UpdateFee from "../UpdateFee";

export default function FeesTable({ fees, onFeesChange, onRefresh }) {
    const [selectedFee, setSelectedFee] = useState(null);

    return (
        <>
            <Table className="w-full table-auto">
                <TableHeader className="bg-slate-100 sticky top-0 z-20">
                    <TableRow className="border-none">
                        <TableHead className="py-2 text-slate-foreground rounded-l-lg w-[30%]">
                            Fee Date
                        </TableHead>
                        <TableHead className="py-2 text-slate-foreground w-[40%]">
                            Fee Name
                        </TableHead>
                        <TableHead className="py-2 text-slate-foreground text-right rounded-r-lg w-[30%]">
                            Amount
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fees.map((fee) => (
                        <TableRow
                            key={fee.id}
                            className="hover:bg-slate-100 cursor-pointer"
                            onClick={() => setSelectedFee(fee)}
                        >
                            <TableCell className="w-[30%] font-medium">
                                {new Date(fee.fee_date).toLocaleDateString(
                                    "id-ID",
                                    {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    },
                                )}
                            </TableCell>
                            <TableCell className="w-[40%] font-medium">
                                {fee.fee_name}
                            </TableCell>
                            <TableCell className="w-[30%] text-right font-mono font-semibold text-red-600">
                                Rp {Number(fee.fee).toLocaleString("id-ID")}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {selectedFee && (
                <UpdateFee
                    fee={selectedFee}
                    onClose={() => setSelectedFee(null)}
                    onUpdated={async () => {
                        await onRefresh();
                        setSelectedFee(null);
                    }}
                />
            )}
        </>
    );
}
