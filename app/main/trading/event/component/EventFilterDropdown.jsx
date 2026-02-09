"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    Filter,
    TrendingUp,
    TrendingDown,
    Star,
    Calendar,
    Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function EventFilterDropdown({
    filter,
    onFilterChange,
    events,
}) {
    const filterOptions = [
        {
            value: null,
            label: "All Events",
            icon: Filter,
            count: events.length,
        },
        {
            value: "bullish",
            label: "Bullish",
            icon: TrendingUp,
            count: events.filter((e) => e.impact_direction === "UP").length,
        },
        {
            value: "bearish",
            label: "Bearish",
            icon: TrendingDown,
            count: events.filter((e) => e.impact_direction === "DOWN").length,
        },
        {
            value: "favorite",
            label: "Favorites",
            icon: Star,
            count: events.filter((e) => e.is_favorite).length,
        },
        {
            value: "upcoming",
            label: "Upcoming",
            icon: Calendar,
            count: events.filter((e) => new Date(e.event_date) >= new Date())
                .length,
        },
        {
            value: "past",
            label: "Past Events",
            icon: Clock,
            count: events.filter((e) => new Date(e.event_date) < new Date())
                .length,
        },
    ];

    const activeFilter = filterOptions.find((opt) => opt.value === filter);

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {activeFilter ? activeFilter.label : "Filter"}
                    {filter && (
                        <Badge variant="secondary" className="ml-1">
                            {activeFilter?.count || 0}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                {filterOptions.map((option, index) => {
                    const Icon = option.icon;
                    const isActive = filter === option.value;

                    return (
                        <div key={option.value || "all"}>
                            {index === 4 && <DropdownMenuSeparator />}
                            <DropdownMenuItem
                                onClick={() => onFilterChange(option.value)}
                                className={`cursor-pointer ${
                                    isActive ? "bg-violet-50" : ""
                                }`}
                            >
                                <Icon className="h-4 w-4 mr-2" />
                                <span className="flex-1">{option.label}</span>
                                <Badge variant="secondary">
                                    {option.count}
                                </Badge>
                            </DropdownMenuItem>
                        </div>
                    );
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
