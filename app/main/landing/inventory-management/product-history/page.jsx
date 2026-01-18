"use client";

import React, { useEffect, useState } from "react";
import ProductHistoryTable from "./ProductHistoryTable";
import { getProductHistoryList } from "@/lib/services/inventory/product/history/getProductHistoryList";
import LoadingComponent from "../../../../LoadingComponent";

function page() {
    const [productHistories, setProductHistories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductHistories = async () => {
            try {
                const productHistories = await getProductHistoryList();
                setProductHistories(productHistories || []);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductHistories();
    }, []);

    return (
        <main className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-20 max-w-full md:max-w-5xl xl:max-w-7xl">
            <div className="fixed inset-0 min-h-svh w-full pointer-events-none -z-10">
                <div className="absolute inset-0 bg-slate-50"></div>
            </div>
            {loading ? (
                <div className="flex flex-1 items-center justify-center">
                    <LoadingComponent description="Loading all products..." />
                </div>
            ) : (
                <ProductHistoryTable productHistories={productHistories} />
            )}
        </main>
    );
}

export default page;
