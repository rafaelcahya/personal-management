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
        <main className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-20 max-w-full md:max-w-5xl xl:max-w-7xl">
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                {/* Layer 1: Gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100/50 via-blue-50/50 to-orange-100/50"></div>

                {/* Layer 2: Frosted glass noise */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/20 via-transparent to-transparent backdrop-blur-lg"></div>
            </div>
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
