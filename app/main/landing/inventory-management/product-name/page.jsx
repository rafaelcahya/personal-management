"use client";

import { useEffect, useState } from "react";
import LoadingComponent from "../../../../LoadingComponent";
import ProductNamesTable from "./ProductNamesTable";
import { getProductNameList } from "@/lib/services/inventory/product/name/getProductNameList";

export default function ProductNamePage() {
    const [productNames, setProductNames] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductNames = async () => {
            try {
                const names = await getProductNameList();
                setProductNames(names || []);
            } catch (err) {
                console.error("Fetch error:", err);
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
