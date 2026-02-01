"use client";

import { useRouter, usePathname } from "next/navigation";
import { PackageIcon, TagIcon, BoxIcon, HistoryIcon } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const navigationItems = [
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
        icon: BoxIcon,
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

    const activeTab =
        navigationItems.find((item) => pathname === item.href)?.value ||
        "product-list";

    const handleTabChange = (value) => {
        const item = navigationItems.find((nav) => nav.value === value);
        if (item) {
            router.push(item.href);
        }
    };

    return (
        <div className="border-b bg-white rounded-lg shadow-sm overflow-x-auto">
            <Tabs
                value={activeTab}
                onValueChange={handleTabChange}
                className="w-full"
            >
                <TabsList className="h-auto p-0 bg-transparent border-0 w-full justify-start rounded-none inline-flex">
                    <TooltipProvider>
                        {navigationItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.value;

                            return (
                                <Tooltip key={item.value} delayDuration={300}>
                                    <TooltipTrigger asChild>
                                        <TabsTrigger
                                            value={item.value}
                                            className={cn(
                                                "flex items-center gap-2 px-3 sm:px-4 py-3 text-sm font-medium border-b-2 transition-colors rounded-none whitespace-nowrap data-[state=active]:shadow-none",
                                                isActive
                                                    ? "text-violet-600 bg-violet-50"
                                                    : "border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50",
                                            )}
                                        >
                                            <Icon className="size-4 flex-shrink-0" />
                                            <span className="hidden md:inline">
                                                {item.name}
                                            </span>
                                        </TabsTrigger>
                                    </TooltipTrigger>
                                    <TooltipContent
                                        side="bottom"
                                        className="md:hidden"
                                    >
                                        <p>{item.name}</p>
                                    </TooltipContent>
                                </Tooltip>
                            );
                        })}
                    </TooltipProvider>
                </TabsList>
            </Tabs>
        </div>
    );
}
