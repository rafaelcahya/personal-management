"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingComponent from "../../../../LoadingComponent";
import ProductBrandsTable from "./ProductBrandsTable";

export default function ProductPage() {
    const [productBrands, setProductBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductBrands = async () => {
            try {
                const res = await fetch("/api/inventory/product/brand/list", {
                    cache: "no-store",
                });
                const data = await res.json();
                if (data.success) setProductBrands(data.productBrands);
            } catch (err) {
                toast.error("Failed to fetch product brand:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductBrands();
    }, []);

    return (
        <main className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-20 max-w-full md:max-w-5xl xl:max-w-7xl">
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                <div className="absolute inset-0 bg-slate-50"></div>
            </div>
            {loading ? (
                <div className="flex flex-1 items-center justify-center">
                    <LoadingComponent description="Loading all product brands..." />
                </div>
            ) : (
                <ProductBrandsTable productBrands={productBrands} />
            )}
        </main>
    );
}
