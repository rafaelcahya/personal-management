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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import LoadingComponent from "../../LoadingComponent";

function FeeList() {
    const [feeList, setFeeList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/fee/list")
            .then((r) => r.json())
            .then((d) => {
                d.success && setFeeList(d.feeList);
            })
            .catch(toast.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="flex flex-col gap-2 bg-white rounded-xl shadow-lg shadow-gray-500/5 space-y-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div>
                    <p className="text-lg font-bold">Fee List</p>
                    <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                        Keep track of commissions and fees — the little things
                        that add up.
                    </p>
                </div>
                <Link href="/main/fee" prefetch={false} id="feeBtn">
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white hover:text-white font-semibold">
                        Fee
                    </Button>
                </Link>
            </div>
            {loading ? (
                <LoadingComponent description="Loading fee list..." />
            ) : (
                <Table>
                    <TableHeader className="bg-gray-50 dark:bg-[#0e0f11] rounded-xl">
                        <TableRow className="border-none">
                            <TableHead className="font-semibold rounded-l-lg text-slate-700">
                                Date
                            </TableHead>
                            <TableHead className="font-semibold text-slate-700">
                                Fee Name
                            </TableHead>
                            <TableHead className="font-semibold text-right rounded-r-lg text-slate-700">
                                Fee
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feeList.slice(0, 10).map((fee, index) => (
                            <TableRow
                                key={index}
                                className="border-dashed hover:bg-gray-50 dark:hover:bg-[#0e0f11] font-semibold"
                            >
                                <TableCell className="py-4">
                                    {new Intl.DateTimeFormat("id-ID", {
                                        day: "2-digit",
                                        month: "short",
                                        year: "numeric",
                                    }).format(new Date(fee.fee_date))}
                                </TableCell>
                                <TableCell>{fee.fee_name}</TableCell>
                                <TableCell className="text-right">{`Rp. ${Number(
                                    fee.fee
                                ).toLocaleString("id-ID")}`}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </main>
    );
}

export default FeeList;
