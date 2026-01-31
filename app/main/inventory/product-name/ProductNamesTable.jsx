"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "@/components/ui/common/Breadcrumbs";
import { getProductNameList } from "@/lib/services/inventory/product/name/getProductNameList";
import SummaryProductName from "./SummaryProductName";
import AddProductName from "./AddProductName";
import ProductNameUpdate from "./UpdateProductName";

export default function ProductNamesTable({
    productNames: initialProductNames,
}) {
    const [productNameList, setProductNameList] = useState(
        initialProductNames || [],
    );
    const [selectedName, setSelectedName] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshRef = useRef();

    const filteredNames = productNameList.filter((productName) => {
        if (!filterStatus) return true;
        return productName.product_name_status === filterStatus;
    });

    const fetchProductNames = async () => {
        try {
            const names = await getProductNameList();
            setProductNameList(names);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    const refreshAll = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await fetchProductNames();
        } finally {
            setIsRefreshing(false);
        }
    }, [fetchProductNames]);

    refreshRef.current = refreshAll;

    const handleFilter = (status) => {
        setFilterStatus(status);
    };

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
        <div className="flex flex-col h-full gap-y-3" id="productBrandTable">
            <header className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20 flex-shrink-0 pb-4">
                <div className="space-y-2">
                    <Breadcrumbs />
                    <div>
                        <p className="text-lg font-semibold">
                            Product Name List
                        </p>
                        <p className="text-sm text-slate-foreground">
                            Manage all your product names in one place — track
                            status, monitor inventory, and keep your stock
                            organized.
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-5">
                    <Link
                        href="/main/landing/inventory-management/dashboard"
                        className="hidden sm:block"
                    >
                        <Button className="bg-transparent hover:bg-secondary text-secondary-foreground font-medium">
                            Back
                        </Button>
                    </Link>
                    <AddProductName onAdded={refreshAll} />
                </div>
            </header>
            <div className="space-y-3 flex-1 min-h-0 flex flex-col">
                <SummaryProductName
                    productNames={productNameList}
                    onFilter={handleFilter}
                    activeFilter={filterStatus}
                    onRefresh={refreshRef}
                    loading={isRefreshing}
                />
                <div className="flex-1 min-h-0 relative border shadow shadow-gray-200 rounded-2xl overflow-hidden flex flex-col">
                    {filteredNames.length === 0 ? (
                        <div className="space-y-2 text-center py-12">
                            <div>
                                <p className="text-lg font-medium text-muted-foreground">
                                    {filterStatus
                                        ? `${
                                              filterStatus
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              filterStatus.slice(1)
                                          } names not found`
                                        : "No product names"}
                                </p>
                                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                    {filterStatus
                                        ? "No product names match this filter. Try another status or add new names."
                                        : "Get started by adding your first product name."}
                                </p>
                            </div>
                            <Button
                                onClick={() => setFilterStatus(null)}
                                className="bg-secondary hover:bg-secondary-hover text-secondary-foreground font-medium"
                            >
                                Show all
                            </Button>
                        </div>
                    ) : (
                        <div className="flex flex-col h-full overflow-hidden">
                            <Table className="w-full table-auto">
                                <TableHeader className="bg-slate-100 sticky top-0 z-20">
                                    <TableRow className="border-none">
                                        <TableHead className="py-2 text-slate-foreground text-center w-[30px] min-w-[30px] max-w-[30px]">
                                            #
                                        </TableHead>
                                        <TableHead className="text-slate-foreground w-[150px] min-w-[150px] max-w-[150px]">
                                            Product name
                                        </TableHead>
                                        <TableHead className="text-slate-foreground w-[100px] min-w-[100px] max-w-[100px]">
                                            Product name status
                                        </TableHead>
                                        <TableHead className="text-slate-foreground min-w-[250px] w-[250px] max-w-[250px]">
                                            Notes
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredNames.map((productName, index) => (
                                        <TableRow
                                            key={productName.id}
                                            className="border-dashed border-b last:border-b-0 hover:bg-slate-100 border-slate-200 transition-colors cursor-pointer"
                                            onClick={() =>
                                                setSelectedName(productName)
                                            }
                                        >
                                            <TableCell className="text-slate-foreground text-center text-sm font-mono w-[30px] min-w-[30px] max-w-[30px]">
                                                {index + 1}
                                            </TableCell>
                                            <TableCell className="w-[150px] min-w-[150px] max-w-[150px] whitespace-normal">
                                                {productName.product_name}
                                            </TableCell>
                                            <TableCell className="w-[100px] min-w-[100px] max-w-[100px]">
                                                <Badge
                                                    className={cn(
                                                        "capitalize",
                                                        getStatusClasses(
                                                            productName.product_name_status,
                                                        ),
                                                    )}
                                                >
                                                    {
                                                        productName.product_name_status
                                                    }
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="min-w-[250px] w-[250px] max-w-[250px]">
                                                <p className="whitespace-normal line-clamp-3">
                                                    {productName.note}
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
                </div>
            </div>
        </div>
    );
}
