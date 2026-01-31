"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
    PackageIcon,
    CheckCircle2Icon,
    XCircleIcon,
    BoxesIcon,
    StarIcon,
    TrendingUpIcon,
} from "lucide-react";
import { getProductSummary } from "@/lib/api/product";

function ProductListSummary() {
    const [summary, setSummary] = useState({
        totalProducts: 0,
        activeProducts: 0,
        inactiveProducts: 0,
        totalQuantity: 0,
        totalUsageQuantity: 0,
        favoriteProducts: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchSummary() {
            try {
                const data = await getProductSummary();
                setSummary(data);
            } catch (err) {
                console.error("Failed to fetch summary:", err);
            } finally {
                setLoading(false);
            }
        }
        fetchSummary();
    }, []);

    const stats = [
        {
            title: "Total Products",
            value: summary.totalProducts,
            icon: PackageIcon,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            title: "Active",
            value: summary.activeProducts,
            icon: CheckCircle2Icon,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            title: "Inactive",
            value: summary.inactiveProducts,
            icon: XCircleIcon,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
        {
            title: "Total Stock",
            value: summary.totalQuantity,
            icon: BoxesIcon,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            title: "In Use",
            value: summary.totalUsageQuantity,
            icon: TrendingUpIcon,
            color: "text-orange-600",
            bgColor: "bg-orange-50",
        },
        {
            title: "Favorites",
            value: summary.favoriteProducts,
            icon: StarIcon,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
    ];

    if (loading) {
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardContent className="p-4">
                            <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
                            <div className="h-8 bg-slate-200 rounded w-12"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="p-0 shadow-none">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-sm font-medium text-slate-600">
                                    {stat.title}
                                </p>
                                <div
                                    className={`p-2 rounded-lg ${stat.bgColor}`}
                                >
                                    <Icon className={`size-4 ${stat.color}`} />
                                </div>
                            </div>
                            <p className="text-xl font-semibold">
                                {stat.value}
                            </p>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
}

export default ProductListSummary;
