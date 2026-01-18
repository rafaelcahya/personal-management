"use client";

import React, { useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RefreshCcwIcon } from "lucide-react";

const STATUSES = [
    { key: null, label: "All products" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "deleted", label: "Deleted" },
];

function SummaryProductName({
    productNames,
    onFilter,
    activeFilter,
    onRefresh,
    loading,
}) {
    // Calculate summary dari productNames props (real-time)
    const summary = useMemo(() => {
        if (!productNames || productNames.length === 0) {
            return {
                totalProductNames: 0,
                totalStatus: {
                    active: 0,
                    inactive: 0,
                    deleted: 0,
                },
            };
        }

        const totalStatus = {
            active: 0,
            inactive: 0,
            deleted: 0,
        };

        productNames.forEach((product) => {
            const status = product.product_name_status;
            if (totalStatus.hasOwnProperty(status)) {
                totalStatus[status]++;
            }
        });

        return {
            totalProductNames: productNames.length,
            totalStatus,
        };
    }, [productNames]);

    const handleManualRefresh = useCallback(() => {
        if (onRefresh) {
            onRefresh();
        }
    }, [onRefresh]);

    const handleFilter = (status) => onFilter(status);

    // Loading skeleton
    if (loading) {
        return (
            <div className="space-y-4">
                <div className="flex justify-between gap-3">
                    <div className="h-10 bg-muted rounded-lg animate-pulse flex-1" />
                    <div className="h-10 w-24 bg-muted rounded-lg animate-pulse" />
                </div>
            </div>
        );
    }

    const { totalProductNames, totalStatus } = summary;

    return (
        <div className="space-y-4">
            {/* Mobile Filter Dropdown */}
            <div className="flex sm:hidden justify-between gap-3">
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm" className="gap-1">
                            Filter status:
                            {activeFilter === null ? (
                                <span className="text-primary capitalize">
                                    All products
                                </span>
                            ) : (
                                <span className="text-primary capitalize">
                                    {activeFilter}
                                </span>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuGroup>
                            {STATUSES.map(({ key, label }) => {
                                const count =
                                    key === null
                                        ? totalProductNames
                                        : totalStatus[key];
                                return (
                                    <DropdownMenuItem
                                        key={key ?? "all"}
                                        onClick={() => handleFilter(key)}
                                    >
                                        <span className="flex-1">{label}</span>
                                        <DropdownMenuShortcut>
                                            {count || 0}
                                        </DropdownMenuShortcut>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuGroup>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button
                    size="sm"
                    onClick={handleManualRefresh}
                    disabled={loading}
                    className="bg-secondary text-secondary-foreground hover:bg-secondary-hover w-max group"
                >
                    <span className="group-hover:rotate-45 duration-200">
                        <RefreshCcwIcon className="h-4 w-4" />
                    </span>
                    Refresh
                </Button>
            </div>

            {/* Desktop Tabs */}
            <div className="flex justify-between gap-3">
                <Tabs
                    value={activeFilter ?? "all"}
                    onValueChange={(value) => {
                        const status = value === "all" ? null : value;
                        handleFilter(status);
                    }}
                    className="hidden sm:block w-full"
                >
                    <TabsList className="flex gap-2 bg-slate-100">
                        {STATUSES.map(({ key, label }) => {
                            const value = key ?? "all";
                            const count =
                                key === null
                                    ? totalProductNames
                                    : totalStatus[key];

                            return (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary hover:bg-primary/10 flex items-center gap-1.5 justify-center w-max transition duration-200"
                                >
                                    <span className="text-sm font-medium capitalize">
                                        {label}
                                    </span>
                                    <span className="text-xs bg-muted/80 data-[state=active]:bg-primary/20 px-1.5 py-0.5 rounded-md font-mono">
                                        {count || 0}
                                    </span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>

                <Button
                    size="sm"
                    onClick={handleManualRefresh}
                    disabled={loading}
                    className="hidden sm:flex items-center bg-secondary text-secondary-foreground hover:bg-secondary-hover w-max group"
                >
                    <span className="group-hover:rotate-45 duration-200">
                        <RefreshCcwIcon className="h-4 w-4" />
                    </span>
                    Refresh
                </Button>
            </div>
        </div>
    );
}

export default SummaryProductName;
