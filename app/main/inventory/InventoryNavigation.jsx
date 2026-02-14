"use client";

import { useRouter, usePathname } from "next/navigation";
import {
    PackageIcon,
    TagIcon,
    BoxIcon,
    HistoryIcon,
    ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
    {
        name: "Product List",
        description: "All products",
        value: "product-list",
        href: "/main/inventory/product-list",
        icon: PackageIcon,
        color: "violet",
        gradient: "from-violet-500 to-purple-600",
    },
    {
        name: "Product Brand",
        description: "Brand management",
        value: "product-brand",
        href: "/main/inventory/product-brand",
        icon: TagIcon,
        color: "blue",
        gradient: "from-blue-500 to-cyan-600",
    },
    {
        name: "Product Name",
        description: "Name catalog",
        value: "product-name",
        href: "/main/inventory/product-name",
        icon: BoxIcon,
        color: "amber",
        gradient: "from-amber-500 to-orange-600",
    },
    {
        name: "Product History",
        description: "Activity log",
        value: "product-history",
        href: "/main/inventory/product-history",
        icon: HistoryIcon,
        color: "red",
        gradient: "from-red-500 to-rose-600",
    },
];

const colorMap = {
    violet: {
        text: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-200",
        activeBg: "bg-gradient-to-br from-violet-500 to-purple-600",
        ring: "ring-2 ring-violet-200/50",
    },
    blue: {
        text: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-200",
        activeBg: "bg-gradient-to-br from-blue-500 to-cyan-600",
        ring: "ring-2 ring-blue-200/50",
    },
    amber: {
        text: "text-amber-600",
        bg: "bg-amber-50",
        border: "border-amber-200",
        activeBg: "bg-gradient-to-br from-amber-500 to-orange-600",
        ring: "ring-2 ring-amber-200/50",
    },
    red: {
        text: "text-red-600",
        bg: "bg-red-50",
        border: "border-red-200",
        activeBg: "bg-gradient-to-br from-red-500 to-rose-600",
        ring: "ring-2 ring-red-200/50",
    },
};

export default function InventoryNavigation() {
    const router = useRouter();
    const pathname = usePathname();

    const activeItem = navigationItems.find((item) => pathname === item.href);

    const handleNavigation = (href) => {
        router.push(href);
    };

    return (
        <div className="w-full">
            {/* Desktop Navigation - Compact Cards */}
            <div className="hidden md:grid md:grid-cols-4 gap-2">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    const colors = colorMap[item.color];

                    return (
                        <button
                            key={item.value}
                            onClick={() => handleNavigation(item.href)}
                            className={cn(
                                "group relative overflow-hidden rounded-lg border transition-all duration-200",
                                "hover:shadow-md active:scale-[0.99]",
                                isActive
                                    ? `${colors.border} shadow-sm ${colors.ring}`
                                    : "border-slate-200 hover:border-slate-300",
                            )}
                        >
                            {/* Background Gradient (Active State) */}
                            {isActive && (
                                <div
                                    className={cn(
                                        "absolute inset-0 opacity-5",
                                        `bg-gradient-to-br ${item.gradient}`,
                                    )}
                                />
                            )}

                            {/* Content */}
                            <div className="relative p-3 text-left flex items-center gap-2.5 bg-white">
                                <div
                                    className={cn(
                                        "p-2 rounded-lg transition-all duration-200",
                                        isActive
                                            ? `${colors.activeBg} text-white shadow-md`
                                            : `${colors.bg} ${colors.text} group-hover:scale-105`,
                                    )}
                                >
                                    <Icon className="size-4" />
                                </div>
                                <div>
                                    <h3
                                        className={cn(
                                            "font-semibold text-sm transition-colors",
                                            isActive
                                                ? colors.text
                                                : "text-slate-700 group-hover:text-slate-900",
                                        )}
                                    >
                                        {item.name}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Mobile Navigation - Horizontal Scroll Pills */}
            <div className="md:hidden bg-white border rounded-lg shadow-sm p-2">
                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {navigationItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        const colors = colorMap[item.color];

                        return (
                            <button
                                key={item.value}
                                onClick={() => handleNavigation(item.href)}
                                className={cn(
                                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 whitespace-nowrap flex-shrink-0",
                                    isActive
                                        ? `${colors.activeBg} text-white shadow-md`
                                        : `${colors.bg} ${colors.text} hover:scale-105 active:scale-95`,
                                )}
                            >
                                <Icon className="size-4" />
                                <span className="text-sm font-medium">
                                    {item.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Breadcrumb Context - Subtle */}
            {activeItem && (
                <div className="mt-5 flex items-center gap-2 text-xs text-slate-500">
                    <PackageIcon className="size-3.5" />
                    <ChevronRight className="size-3" />
                    <span className="font-medium text-slate-700">
                        {activeItem.name}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span>{activeItem.description}</span>
                </div>
            )}
        </div>
    );
}
