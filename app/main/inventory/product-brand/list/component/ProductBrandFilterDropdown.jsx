"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Filter, Check, Loader2 } from "lucide-react";
import { getProductBrandSummary } from "@/lib/api/productBrand";
import { useEffect, useState } from "react";

const FILTER_OPTIONS = [
    { value: null, label: "All Brands", icon: "📦" },
    { value: "active", label: "Active", icon: "✅" },
    { value: "inactive", label: "Inactive", icon: "⏸️" },
    { value: "deleted", label: "Deleted", icon: "🗑️" },
];

export default function ProductBrandFilterDropdown({
    filter,
    onFilterChange,
    productBrands = [],
}) {
    const [summary, setSummary] = useState({
        totalProductBrands: 0,
        totalStatus: {
            active: 0,
            inactive: 0,
            deleted: 0,
        },
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSummary() {
            try {
                const data = await getProductBrandSummary();
                setSummary(data);
            } catch (err) {
                console.error("Failed to fetch summary:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSummary();
    }, []);

    const currentFilter = FILTER_OPTIONS.find((opt) => opt.value === filter);

    const getFilterCount = (filterValue) => {
        if (loading) return <Loader2 className="size-3 animate-spin" />;

        if (filterValue === null) return summary.totalProductBrands;
        return summary.totalStatus[filterValue] || 0;
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 focus-visible:ring-0 focus-visible:ring-offset-0"
                >
                    <Filter className="size-4" />
                    <span className="hidden sm:inline">
                        {currentFilter?.label || "All Brands"}
                    </span>
                    <span className="sm:hidden">Filter</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Filter Brands</span>
                    {filter && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs hover:bg-violet-100 text-violet-500 hover:text-violet-500"
                            onClick={(e) => {
                                e.stopPropagation();
                                onFilterChange(null);
                            }}
                        >
                            Clear
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {FILTER_OPTIONS.map((option) => (
                    <DropdownMenuItem
                        key={option.value ?? "all"}
                        onClick={() => onFilterChange(option.value)}
                        className="flex items-center justify-between cursor-pointer hover:bg-violet-50 hover:outline-none focus:bg-violet-50"
                    >
                        <span className="flex items-center gap-2">
                            {option.icon} <span>{option.label}</span>
                        </span>
                        <span className="flex items-center gap-2 text-muted-foreground text-xs">
                            {getFilterCount(option.value)}
                            {filter === option.value && (
                                <Check className="size-4 text-violet-500" />
                            )}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
