import React, { useCallback, useEffect, useRef, useState } from "react";
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
import { toast } from "sonner";
import { getProductBrandSummary } from "../../../../../lib/api/productBrand";
import { RefreshCcwIcon } from "lucide-react";

const STATUSES = [
    { key: null, label: "All products" },
    { key: "active", label: "Active" },
    { key: "inactive", label: "Inactive" },
    { key: "deleted", label: "Deleted" },
];

function SummaryProductBrand({
    onFilter,
    activeFilter,
    onRefresh,
    loading: parentLoading,
}) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);

    const refreshSummary = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getProductBrandSummary();
            setSummary(data);
        } catch (err) {
            toast.error("Failed to refresh summary");
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial + refresh triggers
    useEffect(() => {
        refreshSummary();
    }, [refreshSummary]);

    useEffect(() => {
        if (parentLoading) {
            refreshSummary();
        }
    }, [parentLoading, refreshSummary]);

    const handleManualRefresh = useCallback(() => {
        onRefresh?.current?.();
        refreshSummary();
    }, [onRefresh, refreshSummary]);

    const handleFilter = (status) => onFilter(status);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(4)
                    .fill(0)
                    .map((_, i) => (
                        <div
                            key={i}
                            className="h-20 bg-muted rounded-lg animate-pulse"
                        />
                    ))}
            </div>
        );
    }

    if (!summary) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array(4)
                    .fill("No data")
                    .map((text, i) => (
                        <div key={i} className="h-20 p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                {text}
                            </p>
                        </div>
                    ))}
            </div>
        );
    }

    const { totalProductBrands, totalStatus } = summary;

    return (
        <div className="space-y-4">
            {/* Filter Controls */}
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
                                <>
                                    <span className="text-primary capitalize">
                                        {activeFilter}
                                    </span>
                                </>
                            )}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="start">
                        <DropdownMenuGroup>
                            {STATUSES.map(({ key, label }) => {
                                const count =
                                    key === null
                                        ? totalProductBrands
                                        : totalStatus[key];
                                return (
                                    <DropdownMenuItem key={key ?? "all"}>
                                        <button
                                            className="w-full text-left"
                                            onClick={() => handleFilter(key)}
                                        >
                                            {label}
                                        </button>
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
                        <RefreshCcwIcon />
                    </span>
                    Refresh
                </Button>
            </div>

            {/* Tabs */}
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
                                    ? totalProductBrands
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
                        <RefreshCcwIcon />
                    </span>
                    Refresh
                </Button>
            </div>
        </div>
    );
}

export default SummaryProductBrand;
