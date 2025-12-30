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
        <main className="flex flex-col gap-2 bg-white rounded-xl border border-gray-200 space-y-4 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div>
                    <p className="text-lg font-semibold">Fee List</p>
                    <p className="text-sm text-gray-foreground">
                        Keep track of commissions and fees — the little things
                        that add up.
                    </p>
                </div>
                <Link href="/main/fee" prefetch={false} id="feeBtn">
                    <Button className="bg-primary hover:bg-primary-hover font-medium">
                        Fee
                    </Button>
                </Link>
            </div>
            {loading ? (
                <LoadingComponent description="Loading fee list..." />
            ) : (
                <Table>
                    <TableHeader className="bg-gray-50 rounded-xl">
                        <TableRow className="border-none">
                            <TableHead className="font-medium rounded-l-lg text-gray-foreground">
                                Date
                            </TableHead>
                            <TableHead className="font-medium text-gray-foreground">
                                Fee Name
                            </TableHead>
                            <TableHead className="font-medium text-right rounded-r-lg text-gray-foreground">
                                Fee
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {feeList.slice(0, 10).map((fee, index) => (
                            <TableRow
                                key={index}
                                className="border-dashed hover:bg-gray-50 font-medium"
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
