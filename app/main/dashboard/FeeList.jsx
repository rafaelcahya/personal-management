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
        <div className="shadow-black/5 shadow-lg border-none bg-white backdrop-blur-2xl rounded-xl space-y-4 p-6 overflow-x-auto">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div>
                    <p className="text-lg font-semibold tracking-[0.010em]">
                        Fee List
                    </p>
                    <p className="text-sm text-gray-500">
                        Keep track of commissions and fees — the little things
                        that add up.
                    </p>
                </div>
                <Link href="/main/fee" prefetch={false}>
                    <Button className="bg-violet-600 hover:bg-violet-700 text-white hover:text-white">
                        Fee
                    </Button>
                </Link>
            </div>
            {loading ? (
                <LoadingComponent description="Loading fee list..." />
            ) : (
                <Table>
                    <TableHeader className="bg-violet-50 rounded-xl">
                        <TableRow className="border-none">
                            <TableHead className="rounded-l-lg">Date</TableHead>
                            <TableHead>Fee Name</TableHead>
                            <TableHead className="text-right rounded-r-lg">
                                Fee
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feeList.slice(0, 10).map((fee, index) => (
                            <TableRow
                                key={index}
                                className="border-dashed hover:bg-violet-50"
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
        </div>
    );
}

export default FeeList;
