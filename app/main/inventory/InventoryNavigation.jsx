"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { PackageIcon, TagIcon, BoxIcon, HistoryIcon } from "lucide-react";

const navigationItems = [
    {
        name: "Product List",
        href: "/main/inventory/product-list",
        icon: PackageIcon,
    },
    {
        name: "Product Brand",
        href: "/main/inventory/product-brand",
        icon: TagIcon,
    },
    {
        name: "Product Name",
        href: "/main/inventory/product-name",
        icon: BoxIcon,
    },
    {
        name: "Product History",
        href: "/main/inventory/product-history",
        icon: HistoryIcon,
    },
];

export default function InventoryNavigation() {
    const pathname = usePathname();

    return (
        <div className="border-b bg-white rounded-lg shadow-sm">
            <nav className="flex overflow-x-auto">
                {navigationItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                isActive
                                    ? "border-blue-600 text-blue-600 bg-blue-50"
                                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                            )}
                        >
                            <Icon className="size-4" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}
