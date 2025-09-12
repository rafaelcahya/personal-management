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
import AddFee from "./AddFee";
import UpdateFee from "./UpdateFee";

function FeeTable({ fees: initialFees }) {
    const [feeList, setFeeList] = useState(initialFees || []);
    const [selectedFee, setSelectedFee] = useState(null);

    const fetchFees = async () => {
        try {
            const res = await fetch("/api/fee/list", { cache: "no-store" });
            const data = await res.json();
            if (data.success) setFeeList(data.feeList);
        } catch (err) {
            toast.error("Failed to fetch fees:", err);
        }
    };

    useEffect(() => {
        setFeeList(initialFees);
    }, [initialFees]);

    return (
        <div className="shadow shadow-black/5 border-none bg-white/70 backdrop-blur-3xl flex flex-col flex-1 p-6 rounded-2xl overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-0 sm:gap-20">
                <div>
                    <p className="text-lg font-semibold tracking-[0.010em]">
                        Fee List
                    </p>
                    <p className="text-sm text-gray-500">
                        Keep track of commissions and fees — the little things
                        that add up.
                    </p>
                </div>
                <div className="hidden sm:block">
                    <AddFee onAdded={fetchFees} />
                </div>
            </div>
            <div className="relative w-full flex-1 overflow-y-auto mt-4">
                <Table noWrapper>
                    <TableHeader className="bg-violet-50 sticky top-0 z-10">
                        <TableRow className="border-none">
                            <TableHead className="rounded-l-xl">
                                Fee Date
                            </TableHead>
                            <TableHead>Fee Name</TableHead>
                            <TableHead className="text-right rounded-r-xl">
                                Fee
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {feeList.map((fee, index) => (
                            <TableRow
                                key={index}
                                className="border-dashed hover:bg-violet-50 cursor-pointer"
                                onClick={() => setSelectedFee(fee)}
                            >
                                <TableCell>
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

                <UpdateFee
                    fee={selectedFee}
                    onClose={() => setSelectedFee(null)}
                    onUpdated={fetchFees}
                />
            </div>
        </div>
    );
}

export default FeeTable;
