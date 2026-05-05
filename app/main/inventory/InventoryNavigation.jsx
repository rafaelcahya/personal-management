"use client";

import { useRouter, usePathname } from "next/navigation";
import { LayoutDashboardIcon, PackageIcon, TagIcon, TypeIcon, HistoryIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const navigationItems = [
    {
        name: "Dashboard",
        value: "dashboard",
        href: "/main/inventory",
        icon: LayoutDashboardIcon,
    },
    {
        name: "Product List",
        value: "product-list",
        href: "/main/inventory/product-list",
        icon: PackageIcon,
    },
    {
        name: "Product Brand",
        value: "product-brand",
        href: "/main/inventory/product-brand",
        icon: TagIcon,
    },
    {
        name: "Product Name",
        value: "product-name",
        href: "/main/inventory/product-name",
        icon: TypeIcon,
    },
    {
        name: "Product History",
        value: "product-history",
        href: "/main/inventory/product-history",
        icon: HistoryIcon,
    },
];

export default function InventoryNavigation() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="w-full">
            {/* Desktop Navigation - Unified Tab Bar */}
            <div className="hidden md:flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <button
                            key={item.value}
                            onClick={() => router.push(item.href)}
                            className={cn(
                                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex-1 justify-center focus:outline-none",
                                isActive
                                    ? "bg-white text-violet-700 shadow-sm"
                                    : "text-slate-500 hover:text-slate-700 hover:bg-white/60",
                            )}
                        >
                            <Icon
                                className={cn(
                                    "size-4",
                                    isActive ? "text-violet-600" : "text-slate-400",
                                )}
                            />
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </div>

            {/* Mobile Navigation - Horizontal Scroll Pills */}
            <div className="md:hidden flex gap-1.5 overflow-x-auto py-1 scrollbar-hide">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <button
                            key={item.value}
                            onClick={() => router.push(item.href)}
                            className={cn(
                                "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all duration-200 focus:outline-none",
                                isActive
                                    ? "bg-violet-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                            )}
                        >
                            <Icon className="size-4" />
                            <span>{item.name}</span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
