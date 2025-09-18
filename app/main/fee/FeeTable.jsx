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
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { toast } from "sonner";
import AddFee from "./AddFee";
import UpdateFee from "./UpdateFee";
import Breadcrumbs from "../../../components/ui/common/Breadcrumbs";
import SummaryFee from "./SummaryFee";

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
        <div className="shadow-[0_0_75px_16px_rgba(202,213,226,0.5)] dark:shadow-none border-slate-200 border dark:border-none bg-white dark:bg-[#111214] backdrop-blur-2xl rounded-xl flex flex-col flex-1 gap-y-6 p-6 overflow-hidden">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div className="space-y-2">
                    <Breadcrumbs />
                    <div>
                        <p className="text-lg font-semibold tracking-[0.010em]">
                            Fee List
                        </p>
                        <p className="text-sm font-medium text-slate-500 dark:text-gray-400">
                            Keep track of commissions and fees — the little
                            things that add up.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Link href="/main/dashboard" className="hidden sm:block">
                        <Button className="font-semibold bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 text-violet-600">
                            Back
                        </Button>
                    </Link>
                    <AddFee onAdded={fetchFees} />
                </div>
            </div>
            <SummaryFee />
            <div className="relative w-full flex-1 overflow-y-auto">
                <Table noWrapper>
                    <TableHeader className="bg-violet-100 dark:bg-[#0e0f11] sticky top-0 z-10">
                        <TableRow className="border-none">
                            <TableHead className="font-semibold rounded-l-lg">
                                Fee Date
                            </TableHead>
                            <TableHead className="font-semibold">
                                Fee Name
                            </TableHead>
                            <TableHead className="font-semibold text-right rounded-r-lg">
                                Fee
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {feeList.map((fee, index) => (
                            <TableRow
                                key={index}
                                className="font-semibold border-dashed hover:bg-violet-100 dark:hover:bg-[#0e0f11] cursor-pointer"
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
