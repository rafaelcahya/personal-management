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
import { fetchProductName } from "@/lib/api/productName";
import ProductNameUpdate from "../UpdateProductName";

export default function ProductNamesTable({
    productNames: initialProductNames,
    filterStatus,
    onFilterChange,
}) {
    const [productNameList, setProductNameList] = useState(
        initialProductNames || [],
    );
    const [selectedName, setSelectedName] = useState(null);

    const filteredNames = (productNameList || []).filter((productName) => {
        if (!filterStatus) return true;
        return productName.product_name_status === filterStatus;
    });

    const fetchProductNames = async () => {
        try {
            const names = await fetchProductName();
            setProductNameList(names);
        } catch (err) {
            console.error("Failed to fetch product names:", err);
        }
    };

    const refreshAll = useCallback(async () => {
        try {
            await fetchProductNames();
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
                return "bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200";
        }
    };

    useEffect(() => {
        setProductNameList(initialProductNames);
    }, [initialProductNames]);

    return (
        <>
            {filteredNames.length === 0 ? (
                <div className="text-center font-medium text-slate-foreground py-10">
                    <p>
                        {filterStatus
                            ? `No ${filterStatus} product names found`
                            : "No product names yet. Start by adding a new product name 🚀"}
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
                                    Product Name
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
                            {filteredNames.map((productName, index) => (
                                <TableRow
                                    key={productName.id}
                                    className="hover:bg-slate-100 cursor-pointer"
                                    onClick={() => setSelectedName(productName)}
                                >
                                    <TableCell className="text-center text-sm font-mono w-[30px]">
                                        {index + 1}
                                    </TableCell>
                                    <TableCell className="font-semibold w-[200px]">
                                        {productName.product_name}
                                    </TableCell>
                                    <TableCell className="text-center w-[120px]">
                                        <Badge
                                            className={cn(
                                                "capitalize",
                                                getStatusClasses(
                                                    productName.product_name_status,
                                                ),
                                            )}
                                        >
                                            {productName.product_name_status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <p className="line-clamp-2 text-sm text-slate-600">
                                            {productName.note || "-"}
                                        </p>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <ProductNameUpdate
                productName={selectedName}
                onClose={() => setSelectedName(null)}
                onUpdated={refreshAll}
            />
        </>
    );
}
