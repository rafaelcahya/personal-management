"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchFeeList } from "@/lib/api/fee";
import { toast } from "sonner";
import FeeListSummary from "./list/component/FeeListSummary";
import FeeTableHeader from "./list/component/FeeTableHeader";
import FeesTable from "./list/FeesTable";
import AddFee from "./AddFee";

export default function FeesPageClient({ initialFees }) {
    const [listFee, setListFee] = useState(initialFees || []);

    const fetchFees = useCallback(async () => {
        try {
            const fees = await fetchFeeList();
            setListFee(fees || []);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error(err.message || "Failed to fetch fees");
        }
    }, []);

    useEffect(() => {
        if (initialFees && initialFees.length > 0) {
            setListFee(initialFees);
        } else {
            fetchFees();
        }
    }, [initialFees, fetchFees]);

    return (
        <div className="flex flex-col h-full gap-5">
            <FeeListSummary fees={listFee} />

            <div className="flex-1 min-h-0 relative border rounded-xl overflow-hidden flex flex-col p-5 bg-white">
                <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-3">
                        <div className="max-w-[500px]">
                            <FeeTableHeader />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <AddFee onAdded={fetchFees} />
                        </div>
                    </div>

                    {listFee.length === 0 ? (
                        <p className="text-center font-medium text-slate-foreground py-10">
                            No fees yet. Start by adding a new fee 💰
                        </p>
                    ) : (
                        <FeesTable
                            fees={listFee}
                            onFeesChange={setListFee}
                            onRefresh={fetchFees}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
