"use client";

import { useCallback, useEffect, useState } from "react";
import { getProductList } from "@/lib/services/inventory/product/getProductList";
import { toast } from "sonner";
import ProductListHeader from "./list/component/ProductListHeader";
import ProductListSummary from "./list/component/ProductListSummary";
import ProductTableHeader from "./list/component/ProductTableHeader";
import ProductsTable from "./list/ProductsTable";
import AddProductForm from "./add-product/AddProductForm";

export default function ProductsPageClient({ initialProducts }) {
    const [listProduct, setListProduct] = useState(initialProducts || []);
    const [filter, setFilter] = useState(null);

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

    return (
        <div className="flex flex-col h-full gap-5">
            <ProductListHeader />

            <ProductListSummary products={listProduct} />

            <div className="flex-1 min-h-0 relative border rounded-xl overflow-hidden flex flex-col p-5">
                {listProduct?.length === 0 ? (
                    <div className="text-center font-medium text-slate-foreground py-10">
                        <p>No products yet. Start by adding a new product 🚀</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                        <div className="flex flex-col sm:flex-row justify-between gap-0 sm:gap-10">
                            <ProductTableHeader listProduct={listProduct} />
                            <AddProductForm onAdded={fetchProducts} />
                        </div>

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
