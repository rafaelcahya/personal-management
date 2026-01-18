"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import LoadingComponent from "../../../../LoadingComponent";
import ProductsTable from "../product-list/ProductsTable";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getProductList } from "@/lib/services/inventory/product/getProductList";

export default function page() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const products = await getProductList();
                setProducts(products || []);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <main className="flex flex-col gap-5 h-screen w-full mx-auto px-3 py-6 xl:py-20 max-w-full md:max-w-5xl xl:max-w-7xl">
            <div>
                <Link
                    href="/main/landing/inventory-management/product-brand"
                    id="productBrandBtn"
                >
                    <Button>Product Brand</Button>
                </Link>
                <Link
                    href="/main/landing/inventory-management/product-name"
                    id="productNameBtn"
                >
                    <Button>Product Name</Button>
                </Link>
                <Link href="/main/landing/inventory-management/product-history">
                    <Button>Product History</Button>
                </Link>
            </div>
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
