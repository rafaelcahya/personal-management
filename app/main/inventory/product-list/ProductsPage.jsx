"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchProductList } from "@/lib/api/product";
import { toast } from "sonner";
import ProductListSummary from "./list/component/ProductListSummary";
import ProductTableHeader from "./list/component/ProductTableHeader";
import ProductsTable from "./list/ProductsTable";
import AddProductForm from "./add-product/AddProductForm";
import ProductFilterDropdown from "./list/component/ProductFilterDropdown";

const FILTER_STORAGE_KEY = "product-list-filter";

export default function ProductsPageClient() {
    const [listProduct, setListProduct] = useState([]);
    const [filter, setFilter] = useState(null);

    useEffect(() => {
        try {
            const savedFilter = localStorage.getItem(FILTER_STORAGE_KEY);
            if (savedFilter) {
                setFilter(savedFilter === "null" ? null : savedFilter);
            }
        } catch (error) {
            console.error("Failed to load filter from localStorage:", error);
        }
    }, []);

    useEffect(() => {
        try {
            localStorage.setItem(
                FILTER_STORAGE_KEY,
                filter === null ? "null" : filter,
            );
        } catch (error) {
            console.error("Failed to save filter to localStorage:", error);
        }
    }, [filter]);

    const fetchProducts = useCallback(async () => {
        try {
            const products = await fetchProductList();
            setListProduct(products || []);
        } catch (err) {
            console.error("Fetch error:", err);
            toast.error(err.message || "Failed to fetch products");
        }
    }, []);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const filteredProducts = listProduct.filter((product) => {
        if (!filter) return true;

        switch (filter) {
            case "low-stock":
                return product.quantity < 5 && product.quantity > 0;
            case "out-stock":
                return product.quantity === 0;
            case "active":
                return product.product_status === "active";
            case "inactive":
                return product.product_status === "inactive";
            case "favorite":
                return product.is_favorite;
            case "never-used":
                return !product.usage_date;
            default:
                return true;
        }
    });

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);

        const messages = {
            null: "Showing all products",
            active: "Showing active products",
            inactive: "Showing inactive products",
            favorite: "Showing favorite products",
            "low-stock": "Showing low stock products",
            "out-stock": "Showing out of stock products",
            "never-used": "Showing never used products",
        };

        const toastTypes = {
            null: "success",
            active: "success",
            inactive: "success",
            favorite: "success",
            "low-stock": "warning",
            "out-stock": "error",
            "never-used": "info",
        };

        const message = messages[newFilter] || messages[null];
        const toastType = toastTypes[newFilter] || "success";

        toast[toastType](message);
    };

    return (
        <div className="flex flex-col h-full gap-5">
            <ProductListSummary products={listProduct} />

            <div className="flex-1 min-h-0 relative border border-slate-200/50 shadow-slate-100 rounded-xl overflow-hidden flex flex-col p-5 bg-white">
                <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-3">
                        <div className="max-w-[500px]">
                            <ProductTableHeader />
                        </div>

                        <div className="flex items-center justify-between sm:justify-end gap-2 w-full">
                            <ProductFilterDropdown
                                filter={filter}
                                onFilterChange={handleFilterChange}
                                products={listProduct}
                            />

                            <AddProductForm onAdded={fetchProducts} />
                        </div>
                    </div>

                    {listProduct.length === 0 ? (
                        <p className="text-center font-medium text-slate-foreground py-10">
                            No products yet. Start by adding a new product 🚀
                        </p>
                    ) : (
                        <ProductsTable
                            products={filteredProducts}
                            allProducts={listProduct}
                            filter={filter}
                            setFilter={setFilter}
                            onProductsChange={setListProduct}
                            onRefresh={fetchProducts}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
