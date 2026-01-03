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
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Breadcrumbs from "../../../../../components/ui/common/Breadcrumbs";
import AddProductBrand from "./AddProductBrand";
import SummaryProductBrand from "./SummaryProductBrand";
import ProductBrandUpdate from "./UpdateProductBrand";
import { getProductBrandList } from "../../../../../lib/services/inventory/product/brand/getProductBrandList";

export default function ProductBrandsTable({
    productBrands: initialProductBrands,
}) {
    const [productBrandList, setProductBrandList] = useState(
        initialProductBrands || []
    );
    const [selectedBrand, setSelectedBrand] = useState(null);
    const [filterStatus, setFilterStatus] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const refreshRef = useRef();

    const filteredBrands = productBrandList.filter((brand) => {
        if (!filterStatus) return true;
        return brand.brand_status === filterStatus;
    });

    const fetchProductBrands = async () => {
        try {
            const brands = await getProductBrandList();
            setProductBrandList(brands);
        } catch (err) {
            toast.error("Failed to fetch product brands:", err);
        }
    };

    const refreshAll = useCallback(async () => {
        setIsRefreshing(true);
        try {
            await Promise.allSettled([fetchProductBrands()]);
        } finally {
            setIsRefreshing(false);
        }
    }, [fetchProductBrands]);

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
                return "bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200";
        }
    };

    useEffect(() => {
        setProductBrandList(initialProductBrands);
    }, [initialProductBrands]);

    return (
        <div className="flex flex-col flex-1 gap-y-6" id="productBrandTable">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 sm:gap-20">
                <div className="space-y-2">
                    <Breadcrumbs />
                    <div>
                        <p className="text-lg font-semibold">
                            Product Brand List
                        </p>
                        <p className="text-sm text-gray-foreground">
                            Manage all your product brands in one place — track
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
                    <AddProductBrand onAdded={refreshAll} />
                </div>
            </div>
            <div className="space-y-3">
                <SummaryProductBrand
                    onFilter={handleFilter}
                    activeFilter={filterStatus}
                    onRefresh={refreshRef}
                    loading={isRefreshing}
                />
                <div className="relative w-full flex-1 overflow-y-auto border shadow shadow-gray-200 rounded-2xl p-2">
                    {filteredBrands.length === 0 ? (
                        <div className="space-y-2 text-center py-12">
                            <div>
                                <p className="text-lg font-medium text-muted-foreground">
                                    {filterStatus
                                        ? `${
                                              filterStatus
                                                  .charAt(0)
                                                  .toUpperCase() +
                                              filterStatus.slice(1)
                                          } brands not found`
                                        : "No product brands"}
                                </p>
                                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                                    {filterStatus
                                        ? "No brands match this filter. Try another status or add new brands."
                                        : "Get started by adding your first product brand."}
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
                        <div className="relative w-full flex-1 overflow-y-auto">
                            <Table noWrapper>
                                <TableHeader className="bg-gray-100 dark:bg-[#0e0f11] sticky top-0 z-10">
                                    <TableRow className="border-none">
                                        <TableHead className="font-medium text-gray-foreground pl-5 rounded-l-xl w-[5%]">
                                            #
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-foreground w-1/3">
                                            Product brand
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-foreground w-1/3">
                                            Product brand status
                                        </TableHead>
                                        <TableHead className="font-medium text-gray-foreground pr-5 rounded-r-xl w-1/3">
                                            Notes
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {filteredBrands.map(
                                        (productBrand, index) => (
                                            <TableRow
                                                key={productBrand.id}
                                                className="font-medium border-dashed hover:bg-gray-100 dark:hover:bg-[#0e0f11] cursor-pointer"
                                                onClick={() =>
                                                    setSelectedBrand(
                                                        productBrand
                                                    )
                                                }
                                            >
                                                <TableCell className="pl-5">
                                                    {index + 1}
                                                </TableCell>
                                                <TableCell>
                                                    {productBrand.brand}
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        className={cn(
                                                            "capitalize",
                                                            getStatusClasses(
                                                                productBrand.brand_status
                                                            )
                                                        )}
                                                    >
                                                        {
                                                            productBrand.brand_status
                                                        }
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="pr-5">
                                                    {productBrand.note}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}

                    <ProductBrandUpdate
                        productBrand={selectedBrand}
                        onClose={() => setSelectedBrand(null)}
                        onUpdated={refreshAll}
                    />
                </div>
            </div>
        </div>
    );
}
