"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingComponent from "../../../../LoadingComponent";
import ProductsTable from "./ProductsTable";

export default function ProductPage() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("/api/inventory/product/list", {
                    cache: "no-store",
                });
                const data = await res.json();
                if (data.success) setProducts(data.products);
            } catch (err) {
                toast.error("Failed to fetch products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
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
                <ProductsTable products={products} />
            )}
        </main>
    );
}
