"use client";
import { getProductSummary } from "@/lib/api/product";
import { useEffect, useState } from "react";

export default function ProductTableHeader() {
    const [summary, setSummary] = useState({
        activeProducts: 0,
        favoriteProducts: 0,
    });
    const [loading, setLoading] = useState(true);

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
                    <h2 className="text-xl font-bold text-slate-800">
                        📦 Product Inventory
                    </h2>
                    <p className="text-sm text-slate-600 leading-relaxed mt-1.5 max-w-2xl">
                        Track everything in your inventory—from stock levels to
                        usage patterns. Star your favorites for instant access,
                        monitor quantities, and never run out of
                        essentials.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 mt-3 pt-2">
                    <span className="flex items-center gap-1.5 bg-green-50 px-2.5 py-1 rounded-md">
                        <span>📦</span>
                        <p className="font-semibold text-green-700">
                            {summary.activeProducts}
                        </p>
                        <p>
                            active{" "}
                            {summary.activeProducts === 1
                                ? "product"
                                : "products"}
                        </p>
                    </span>
                    <span className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-md">
                        <span>⭐</span>
                        <p className="font-semibold text-yellow-700">
                            {summary.favoriteProducts}
                        </p>
                        <p>
                            {summary.favoriteProducts === 1
                                ? "favorite"
                                : "favorites"}
                        </p>
                    </span>
                </div>
            </div>
        </>
    );
}
