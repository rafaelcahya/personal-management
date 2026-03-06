"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchFeeSummary, fetchFeeList } from "@/lib/api/fee";
import { toast } from "sonner";
import FeeListSummary from "./list/component/FeeListSummary";
import FeeTableHeader from "./list/component/FeeTableHeader";
import FeesTable from "./list/FeesTable";
import AddFee from "./AddFee";

export default function FeesPageClient({ initialFees }) {
    const [listFee, setListFee] = useState(initialFees || []);
    const [isLoading, setIsLoading] = useState(false);
    const [summary, setSummary] = useState({ feeCount: 0, totalFee: 0 });

    const fetchSummary = useCallback(async () => {
        try {
            const data = await fetchFeeSummary();
            setSummary(data);
        } catch (err) {
            console.error("Summary fetch error:", err);
        }
    }, []);

    const fetchFees = useCallback(async () => {
        try {
            setIsLoading(true);
            const [fees] = await Promise.all([fetchFeeList(), fetchSummary()]);
            setListFee(fees || []);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error(err.message || "Failed to fetch fees");
        } finally {
            setIsLoading(false);
        }
    }, [fetchSummary]);

    useEffect(() => {
        fetchSummary();

        if (!initialFees || initialFees.length === 0) {
            fetchFees();
        }
    }, []);

    return (
        <div className="flex flex-col h-full gap-5">
            {/* Summary Cards */}
            <FeeListSummary
                feeCount={summary.feeCount}
                totalFee={summary.totalFee}
            />

            {/* Main Table Container */}
            <div className="flex-1 min-h-0 relative border border-slate-200/50 shadow-slate-100 rounded-xl overflow-hidden flex flex-col p-5 bg-white">
                <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-3">
                        <div className="max-w-[500px]">
                            <FeeTableHeader />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            <AddFee onAdded={fetchFees} />
                        </div>
                    </div>

                    {/* Table or Empty State */}
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <div className="size-8 border-4 border-violet-200 border-t-violet-600 rounded-full animate-spin" />
                            <p className="text-sm text-slate-600 font-medium">
                                Loading fees...
                            </p>
                        </div>
                    ) : listFee.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3">
                            <p className="text-center font-medium text-slate-600 text-lg">
                                No fees yet
                            </p>
                            <p className="text-center text-slate-500 text-sm">
                                Start by adding your first fee to track
                                expenses! 💰
                            </p>
                        </div>
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
