"use client";

import { useState } from "react";
import ProductNamesTable from "./list/ProductNamesTable";
import ProductNameTableHeader from "./list/component/ProductNameTableHeader";
import AddProductName from "./AddProductName";
import { fetchProductName } from "@/lib/api/productName";
import ProductNameFilterDropdown from "./list/component/ProductNameFilterDropdown";

export default function ProductNamesPageClient({ initialNames }) {
    const [names, setNames] = useState(initialNames);
    const [filterStatus, setFilterStatus] = useState(null);

    const fetchProductNames = async () => {
        try {
            const productNames = await fetchProductName();
            setNames(productNames || []);
        } catch (err) {
            console.error("Failed to fetch product names:", err);
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
                        <ProductNameTableHeader names={names} />
                    </div>
                    <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
                        <ProductNameFilterDropdown
                            filter={filterStatus}
                            onFilterChange={handleFilter}
                            productNames={names}
                        />
                        <AddProductName onAdded={fetchProductNames} />
                    </div>
                </div>
                {names.length === 0 ? (
                    <p className="text-center font-medium text-slate-foreground py-10">
                        No product names yet. Start by adding a new product name
                        🚀
                    </p>
                ) : (
                    <ProductNamesTable
                        productNames={names}
                        filterStatus={filterStatus}
                        onFilterChange={handleFilter}
                    />
                )}
            </div>
        </div>
    );
}
