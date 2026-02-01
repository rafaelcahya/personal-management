"use client";

import { useCallback, useEffect, useState } from "react";
import { getProductList } from "@/lib/services/inventory/product/getProductList";
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
import { Filter, Settings2 } from "lucide-react";
import ProductListHeader from "./list/component/ProductListHeader";
import ProductListSummary from "./list/component/ProductListSummary";
import ProductTableHeader from "./list/component/ProductTableHeader";
import ProductsTable from "./list/ProductsTable";
import AddProductForm from "./add-product/AddProductForm";

// localStorage key
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
            const products = await getProductList();
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
        setIsDialogOpen(false);

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
                {listProduct?.length === 0 ? (
                    <div className="text-center font-medium text-slate-foreground py-10">
                        <p>No products yet. Start by adding a new product 🚀</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                        {/* Header with Manage Button - Both Desktop & Mobile */}
                        <div className="flex justify-between items-center mb-3 sm:mb-4 gap-10">
                            {/* Left Side - Product Info */}
                            <div className="flex-1">
                                {/* Mobile Info */}
                                <div className="sm:hidden">
                                    <p className="text-sm font-semibold text-slate-700">
                                        Products
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        {filteredProducts.length} of{" "}
                                        {listProduct.length} items
                                        {filter && (
                                            <span className="text-violet-600 font-medium">
                                                {" "}
                                                • {getFilterDisplayName(filter)}
                                            </span>
                                        )}
                                    </p>
                                </div>

                                {/* Desktop Info */}
                                <div className="hidden sm:block max-w-[500px]">
                                    <ProductTableHeader
                                        listProduct={listProduct}
                                    />
                                </div>
                            </div>

                            {/* Right Side - Actions */}
                            <div className="flex flex-col items-end gap-2">
                                {/* Add Product - Desktop Only */}
                                <div className="hidden sm:block">
                                    <AddProductForm onAdded={fetchProducts} />
                                </div>

                                {/* Manage Button - Both Desktop & Mobile */}
                                <Dialog
                                    open={isDialogOpen}
                                    onOpenChange={setIsDialogOpen}
                                >
                                    <DialogTrigger asChild>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="gap-2"
                                        >
                                            <Settings2 className="size-4" />
                                            <span className="hidden sm:inline">
                                                Manage
                                            </span>
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-w-sm max-h-[85vh] overflow-y-auto">
                                        <DialogHeader className="text-left">
                                            <DialogTitle>
                                                📦 Product Manager
                                            </DialogTitle>
                                            <DialogDescription>
                                                Find exactly what you're looking
                                                for with filters and quick
                                                actions
                                            </DialogDescription>
                                        </DialogHeader>

                                        <div className="space-y-4 py-4 sm:py-0">
                                            {/* Add Product - Mobile Only */}
                                            <div className="space-y-2 sm:hidden">
                                                <h4 className="text-sm font-semibold">
                                                    Quick Actions
                                                </h4>
                                                <AddProductForm
                                                    onAdded={() => {
                                                        fetchProducts();
                                                        setIsDialogOpen(false);
                                                    }}
                                                />
                                            </div>

                                            {/* Filters */}
                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-sm font-semibold">
                                                        Filter By
                                                    </h4>
                                                    {filter && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            className="h-7 text-xs"
                                                            onClick={() =>
                                                                handleFilterChange(
                                                                    null,
                                                                )
                                                            }
                                                        >
                                                            Clear
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <Button
                                                        variant={
                                                            filter === null
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                null,
                                                            )
                                                        }
                                                    >
                                                        📦 All Products (
                                                        {listProduct.length})
                                                    </Button>
                                                    <Button
                                                        variant={
                                                            filter === "active"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "active",
                                                            )
                                                        }
                                                    >
                                                        ✅ Active Products
                                                    </Button>
                                                    <Button
                                                        variant={
                                                            filter ===
                                                            "inactive"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "inactive",
                                                            )
                                                        }
                                                    >
                                                        ⏸️ Inactive Products
                                                    </Button>
                                                    <Button
                                                        variant={
                                                            filter ===
                                                            "favorite"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "favorite",
                                                            )
                                                        }
                                                    >
                                                        ⭐ Favorite Products
                                                    </Button>
                                                    <Button
                                                        variant={
                                                            filter ===
                                                            "low-stock"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "low-stock",
                                                            )
                                                        }
                                                    >
                                                        ⚠️ Low Stock
                                                    </Button>
                                                    <Button
                                                        variant={
                                                            filter ===
                                                            "out-stock"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "out-stock",
                                                            )
                                                        }
                                                    >
                                                        ❌ Out of Stock
                                                    </Button>
                                                    <Button
                                                        variant={
                                                            filter ===
                                                            "never-used"
                                                                ? "default"
                                                                : "outline"
                                                        }
                                                        size="sm"
                                                        className="w-full justify-start"
                                                        onClick={() =>
                                                            handleFilterChange(
                                                                "never-used",
                                                            )
                                                        }
                                                    >
                                                        🆕 Never Used
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </div>

                        {/* Products Table */}
                        <ProductsTable
                            products={filteredProducts}
                            allProducts={listProduct}
                            filter={filter}
                            setFilter={setFilter}
                            onProductsChange={setListProduct}
                            onRefresh={fetchProducts}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
