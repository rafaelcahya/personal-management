"use client";

import { useState } from "react";
import ProductBrandsTable from "./list/ProductBrandsTable";
import ProductBrandTableHeader from "./list/component/ProductBrandTableHeader";
import AddProductBrand from "./AddProductBrand";
import { fetchProductBrand } from "@/lib/api/productBrand";
import ProductBrandFilterDropdown from "./list/component/ProductBrandFilterDropdown";

export default function ProductBrandsPageClient({ initialBrands }) {
    const [brands, setBrands] = useState(initialBrands);
    const [filterStatus, setFilterStatus] = useState(null);

    const fetchProductBrands = async () => {
        try {
            const brands = await fetchProductBrand();
            setBrands(brands || []);
        } catch (err) {
            console.error("Failed to fetch product brands:", err);
        }
    };

    const handleFilter = (status) => {
        setFilterStatus(status);
    };

    return (
        <div className="flex-1 min-h-0 relative border border-slate-200/50 shadow-slate-100 rounded-xl overflow-hidden flex flex-col p-5 bg-white">
            <div className="flex flex-col gap-5 sm:gap-0 h-full overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between mb-3 sm:mb-4 gap-3">
                    <div className="max-w-[500px]">
                        <ProductBrandTableHeader brands={brands} />
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                        <ProductBrandFilterDropdown
                            filter={filterStatus}
                            onFilterChange={handleFilter}
                            productBrands={brands}
                        />
                        <AddProductBrand onAdded={fetchProductBrands} />
                    </div>
                </div>
                {brands.length === 0 ? (
                    <p className="text-center font-medium text-slate-foreground py-10">
                        No product brands yet. Start by adding a new product
                        brand 🚀
                    </p>
                ) : (
                    <ProductBrandsTable
                        productBrands={brands}
                        filterStatus={filterStatus}
                        onFilterChange={handleFilter}
                    />
                )}
            </div>
        </div>
    );
}
