"use client";

import { useCallback, useEffect, useState } from "react";
import LoadingComponent from "../../../../LoadingComponent";
import ProductBrandsTable from "./ProductBrandsTable";
import { getProductBrandList } from "@/lib/services/inventory/product/brand/getProductBrandList";

export default function ProductPage() {
    const [productBrands, setProductBrands] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProductBrands = useCallback(async () => {
        setLoading(true);
        try {
            const brands = await getProductBrandList();
            setProductBrands(brands || []);
        } catch (err) {
            console.error(
                "Fetch error:",
                err || "Failed to fetch product brands"
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductBrands();
    }, [fetchProductBrands]);

    return (
        <main className="flex flex-col h-screen w-full mx-auto px-3 py-6 xl:py-20 max-w-full md:max-w-5xl xl:max-w-7xl overflow-hidden">
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
