"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingComponent from "../../../../LoadingComponent";
import ProductNamesTable from "./ProductNamesTable";

export default function ProductNamePage() {
    const [productNames, setProductNames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductNames = async () => {
            try {
                const res = await fetch("/api/inventory/product/name/list", {
                    cache: "no-store",
                });
                const data = await res.json();
                if (data.success) setProductNames(data.productNames);
            } catch (err) {
                toast.error("Failed to fetch product name:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductNames();
    }, []);

    return (
        <main className="flex flex-col h-screen w-full mx-auto px-3 py-6 xl:py-20 max-w-full md:max-w-5xl xl:max-w-7xl overflow-hidden">
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                <div className="absolute inset-0 bg-slate-50"></div>
            </div>
            {loading ? (
                <div className="flex flex-1 items-center justify-center">
                    <LoadingComponent description="Loading all product names..." />
                </div>
            ) : (
                <ProductNamesTable productNames={productNames} />
            )}
        </main>
    );
}
