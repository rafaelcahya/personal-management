import React, { useEffect, useState } from "react";

function SummaryFee() {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        Promise.all([fetch("/api/trade/fee/summary").then((r) => r.json())])
            .then(([summaryRes]) => {
                if (summaryRes.success) setSummary(summaryRes.data);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const { feeCount, totalFee } = summary || {};

    return (
        <div className="p-4 border-gray-200 border dark:border-none bg-white dark:bg-[#1c1d21] rounded-xl w-full">
            {
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <li className="flex flex-col items-center gap-2">
                        <p className="font-medium text-slate-foreground">
                            Total Transactions
                        </p>
                        <p className="font-medium text-lg">{feeCount}</p>
                    </li>
                    <li className="flex flex-col items-center gap-2">
                        <p className="font-medium text-slate-foreground">
                            Total Fee
                        </p>
                        <p className="font-medium text-lg">
                            {`Rp. ${(totalFee || 0).toLocaleString("id-ID")}`}
                        </p>
                    </li>
                </ul>
            }
        </div>
    );
}

export default SummaryFee;
