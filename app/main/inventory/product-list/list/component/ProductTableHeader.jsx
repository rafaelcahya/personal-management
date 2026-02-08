"use client";
import { getProductSummary } from "@/lib/api/product";
import { useEffect, useState } from "react";

export default function ProductTableHeader({ listProduct }) {
    const [summary, setSummary] = useState({
        activeProducts: 0,
        favoriteProducts: 0,
    });

    useEffect(() => {
        async function fetchSummary() {
            try {
                const data = await getProductSummary();
                setSummary(data);
            } catch (err) {
                console.error("Failed to fetch summary:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSummary();
    }, []);
    return (
        <>
            <div className="space-y-2 mb-4">
                <div>
                    <p className="text-lg font-semibold">Product List</p>
                    <p className="text-sm text-slate-600 mt-1">
                        Manage your inventory products and stock levels. Star
                        your favorites for quick access, track usage, and
                        monitor stock quantities.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                    <span className="flex items-center gap-1">
                        📦{" "}
                        <p className="font-medium">{summary.activeProducts}</p>{" "}
                        total active{" "}
                        {summary.activeProducts <= 1 ? "product" : "products"}
                    </span>
                    <p>•</p>
                    <span className="flex items-center gap-1">
                        ⭐{" "}
                        <p className="font-medium">
                            {summary.favoriteProducts}
                        </p>{" "}
                        {summary.favoriteProducts <= 1
                            ? "favorite"
                            : "favorites"}
                    </span>
                </div>
            </div>
        </>
    );
}
