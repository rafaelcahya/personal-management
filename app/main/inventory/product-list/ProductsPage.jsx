"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchProductList } from "@/lib/api/product";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Settings2 } from "lucide-react";
import ProductListHeader from "./list/component/ProductListHeader";
import ProductListSummary from "./list/component/ProductListSummary";
import ProductTableHeader from "./list/component/ProductTableHeader";
import ProductsTable from "./list/ProductsTable";
import AddProductForm from "./add-product/AddProductForm";
import ProductFilterDropdown from "./list/component/ProductFilterDropdown";

const FILTER_STORAGE_KEY = "product-list-filter";

export default function ProductsPageClient({ initialProducts }) {
    const [listProduct, setListProduct] = useState(initialProducts || []);
    const [filter, setFilter] = useState(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Load filter from localStorage on mount
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

    // Save filter to localStorage whenever it changes
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
        if (initialProducts && initialProducts.length > 0) {
            setListProduct(initialProducts);
        } else {
            fetchProducts();
        }
    }, [initialProducts, fetchProducts]);

    // Filter logic
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

    // Handle filter change with feedback
    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);

        // Toast messages
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

    // Get filter display name
    const getFilterDisplayName = (filterValue) => {
        const names = {
            null: "All",
            active: "Active",
            inactive: "Inactive",
            favorite: "Favorites",
            "low-stock": "Low Stock",
            "out-stock": "Out of Stock",
            "never-used": "Never Used",
        };
        return names[filterValue] || "All";
    };

    return (
        <div className="flex flex-col h-full gap-5">
            <ProductListHeader />

            <ProductListSummary products={listProduct} />

            <div className="flex-1 min-h-0 relative border rounded-xl overflow-hidden flex flex-col p-5 bg-white">
                <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                    <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-3">
                        <div className="max-w-[500px]">
                            <ProductTableHeader listProduct={listProduct} />
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
                        <div className="text-center font-medium text-slate-foreground py-10">
                            <p>
                                No products yet. Start by adding a new product
                                🚀
                            </p>
                        </div>
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
