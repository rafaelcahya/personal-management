"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import FeeTable from "./FeeTable";
import LoadingComponent from "../../LoadingComponent";

export default function FeePage() {
    const [fees, setFees] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFees = async () => {
            try {
                const res = await fetch("/api/fee/list", {
                    cache: "no-store",
                });
                const data = await res.json();
                if (data.success) setFees(data.feeList);
            } catch (err) {
                toast.error("Failed to fetch fees:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchFees();
    }, []);

    return (
        <main className="flex flex-col gap-5 h-screen w-full mx-auto px-6 py-6 xl:py-20 max-w-full md:max-w-5xl xl:max-w-7xl">
            {loading ? (
                <div className="flex flex-1 items-center justify-center">
                    <LoadingComponent description="Loading all fees..." />
                </div>
            ) : (
                <FeeTable fees={fees} />
            )}
        </main>
    );
}
