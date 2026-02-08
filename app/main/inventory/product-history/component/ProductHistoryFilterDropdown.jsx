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
import { Filter, Check } from "lucide-react";
import { useMemo } from "react";

const FILTER_OPTIONS = [
    { value: null, label: "All History", icon: "📦" },
    { value: "active", label: "Active", icon: "✅" },
    { value: "inactive", label: "Inactive", icon: "⏸️" },
    { value: "completed", label: "Completed", icon: "✔️" },
];

export default function ProductHistoryFilterDropdown({
    filter,
    onFilterChange,
    productHistories = [],
}) {
    const summary = useMemo(() => {
        const totalStatus = {
            active: 0,
            inactive: 0,
            completed: 0,
        };

        productHistories.forEach((history) => {
            const status = history.status;
            if (totalStatus.hasOwnProperty(status)) {
                totalStatus[status]++;
            }
        });

        return {
            totalHistories: productHistories.length,
            totalStatus,
        };
    }, [productHistories]);

    const currentFilter = FILTER_OPTIONS.find((opt) => opt.value === filter);

    const getFilterCount = (filterValue) => {
        if (filterValue === null) return summary.totalHistories;
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
                        {currentFilter?.label || "All History"}
                    </span>
                    <span className="sm:hidden">Filter</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Filter History</span>
                    {filter && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 px-2 text-xs"
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
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <span className="flex items-center gap-2">
                            {option.icon} <span>{option.label}</span>
                        </span>
                        <span className="flex items-center gap-2 text-muted-foreground text-xs">
                            {getFilterCount(option.value)}
                            {filter === option.value && (
                                <Check className="size-4 text-foreground" />
                            )}
                        </span>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
