import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import SkeletonBlock from "@/components/ui/common/SkeletonBlock";

function SummaryFee() {
    const [feeList, setFeeList] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFees = async () => {
        try {
            const res = await fetch("/api/fee/list", { cache: "no-store" });
            const data = await res.json();
            if (data.success) setFeeList(data.feeList);
        } catch (err) {
            toast.error("Failed to fetch fees:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFees();
    }, []);

    // --- Hitung summary ---
    const totalTransaction = feeList.length;
    const totalFee = feeList.reduce(
        (sum, item) => sum + Number(item.fee || 0),
        0
    );

    return (
        <div className="p-4 border-slate-200 border dark:border-none bg-white dark:bg-[#1c1d21] rounded-xl w-full">
            {
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <li className="flex flex-col items-center gap-2">
                        <p className="font-semibold text-slate-500 dark:text-slate-400">
                            Total Transactions
                        </p>
                        <p className="font-semibold text-lg">
                            {totalTransaction}
                        </p>
                    </li>
                    <li className="flex flex-col items-center gap-2">
                        <p className="font-semibold text-slate-500">
                            Total Fee
                        </p>
                        <p className="font-semibold text-lg">{`Rp. ${totalFee.toLocaleString(
                            "id-ID"
                        )}`}</p>
                    </li>
                </ul>
            }
        </div>
    );
}

export default SummaryFee;
