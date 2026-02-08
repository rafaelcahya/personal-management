"use client";

import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import ProductBrandUpdate from "../UpdateProductBrand";
import { fetchProductBrand } from "@/lib/api/productBrand";

export default function ProductBrandsTable({
    productBrands: initialProductBrands,
    filterStatus,
}) {
    const [productBrandList, setProductBrandList] = useState(
        initialProductBrands || [],
    );
    const [selectedBrand, setSelectedBrand] = useState(null);

    const filteredBrands = (productBrandList || []).filter((brand) => {
        if (!filterStatus) return true;
        return brand.brand_status === filterStatus;
    });

    const fetchProductBrands = async () => {
        try {
            const brands = await fetchProductBrand();
            setProductBrandList(brands || []);
        } catch (err) {
            console.error("Failed to fetch product brands:", err);
        }
    };

    const refreshAll = useCallback(async () => {
        try {
            await fetchProductBrands();
        } catch (err) {
            console.error("Refresh error:", err);
        }
    }, []);

    const getStatusClasses = (status) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-800 border-green-200 hover:bg-green-200";
            case "deleted":
                return "bg-red-100 text-red-800 border-red-200 hover:bg-red-200";
            case "inactive":
                return "bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200";
            default:
                return "bg-slate-100 text-gray-800 border-gray-200 hover:bg-gray-200";
        }
    };

    useEffect(() => {
        setProductBrandList(initialProductBrands);
    }, [initialProductBrands]);

    return (
        <>
            {filteredBrands.length === 0 ? (
                <div className="text-center font-medium text-slate-foreground py-10">
                    <p>
                        {filterStatus
                            ? `No ${filterStatus} brands found`
                            : "No product brands yet. Start by adding a new brand 🚀"}
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-auto">
                    <Table className="w-full table-auto">
                        <TableHeader className="bg-slate-100 sticky top-0 z-20">
                            <TableRow className="border-none">
                                <TableHead className="py-2 text-slate-foreground rounded-l-lg text-center w-[30px]">
                                    #
                                </TableHead>
                                <TableHead className="py-2 text-slate-foreground w-[200px]">
                                    Product Brand
                                </TableHead>
                                <TableHead className="py-2 text-slate-foreground text-center w-[120px]">
                                    Status
                                </TableHead>
                                <TableHead className="py-2 text-slate-foreground rounded-r-lg">
                                    Notes
                                </TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {filteredBrands.map((productBrand, index) => (
                                <TableRow
                                    key={productBrand.id}
                                    className="hover:bg-slate-100 cursor-pointer"
                                    onClick={() =>
                                        setSelectedBrand(productBrand)
                                    }
                                >
                                    <TableCell className="text-center text-sm font-mono w-[30px]">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="font-semibold w-[200px]">
                                        {productBrand.brand}
                                    </TableCell>
                                    <TableCell className="text-center w-[120px]">
                                        <Badge
                                            className={cn(
                                                "capitalize",
                                                getStatusClasses(
                                                    productBrand.brand_status,
                                                ),
                                            )}
                                        >
                                            {productBrand.brand_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <p className="line-clamp-2 text-sm text-slate-600">
                                            {productBrand.note || "-"}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <ProductBrandUpdate
                productBrand={selectedBrand}
                onClose={() => setSelectedBrand(null)}
                onUpdated={refreshAll}
            />
        </>
    );
}
