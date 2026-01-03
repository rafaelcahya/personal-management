import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { getProductBrandSummary } from "../../../../../lib/api/productBrand";

function SummaryProductBrand({
    onFilter,
    activeFilter,
    onRefresh,
    loading: parentLoading,
}) {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef(null);
    const activeLineRef = useRef(null);

    useGSAP(() => {
        if (!activeLineRef.current) return;

        gsap.set(activeLineRef.current, {
            scaleX: 0,
            transformOrigin: "left center",
        });

        return () => {
            gsap.killTweensOf(activeLineRef.current);
        };
    }, [activeFilter]);

    useGSAP(() => {
        if (activeLineRef.current && containerRef.current && summary) {
            const activeLi = containerRef.current.querySelector(
                "[data-active='true']"
            );
            if (activeLi) {
                const rect = activeLi.getBoundingClientRect();
                const containerRect =
                    containerRef.current.getBoundingClientRect();

                gsap.to(activeLineRef.current, {
                    scaleX: 1,
                    x: rect.left - containerRect.left,
                    width: rect.width,
                    duration: 0.4,
                    ease: "back.out(1.7)",
                });
            }
        }
    }, [activeFilter, summary]);

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

    // Initial load
    useEffect(() => {
        refreshSummary();
    }, [refreshSummary]);

    // Refresh trigger
    useEffect(() => {
        if (parentLoading) {
            refreshSummary();
        }
    }, [parentLoading, refreshSummary]);

    // Manual refresh call (AddProductBrand, etc)
    const handleManualRefresh = useCallback(() => {
        if (onRefresh?.current) {
            onRefresh.current();
        }
        refreshSummary();
    }, [onRefresh, refreshSummary]);

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

    const isActiveFilter = (status) => activeFilter === status;
    const handleStatusClick = (status) => onFilter(status);

    return (
        <div className="relative pb-2">
            <ul ref={containerRef} className="flex gap-5 sm:gap-10 relative">
                {/* All */}
                <li
                    data-active={isActiveFilter(null)}
                    className={cn(
                        "flex gap-2 items-center cursor-pointer transition-all hover:text-primary",
                        isActiveFilter(null) ? "text-primary" : "text-gray-700"
                    )}
                    onClick={() => onFilter(null)}
                >
                    <p className="text-sm font-medium">All products</p>
                    <div className={cn(isActiveFilter(null))}>
                        <span className="text-sm font-medium">
                            {totalProductBrands || 0}
                        </span>
                    </div>
                </li>

                {/* Active */}
                <li
                    data-active={isActiveFilter("active")}
                    className={cn(
                        "flex gap-2 items-center cursor-pointer transition-all hover:text-primary",
                        isActiveFilter("active")
                            ? "text-primary"
                            : "text-gray-700"
                    )}
                    onClick={() => handleStatusClick("active")}
                >
                    <p className="text-sm font-medium">Active</p>
                    <div className={cn(isActiveFilter("active"))}>
                        <span className="text-sm font-medium">
                            {totalStatus.active || 0}
                        </span>
                    </div>
                </li>

                {/* Inactive */}
                <li
                    data-active={isActiveFilter("inactive")}
                    className={cn(
                        "flex gap-2 items-center cursor-pointer transition-all hover:text-primary",
                        isActiveFilter("inactive")
                            ? "text-primary"
                            : "text-gray-700"
                    )}
                    onClick={() => handleStatusClick("inactive")}
                >
                    <p className="text-sm font-medium">Inactive</p>
                    <div className={cn(isActiveFilter("inactive"))}>
                        <span className="text-sm font-medium">
                            {totalStatus.inactive || 0}
                        </span>
                    </div>
                </li>

                {/* Deleted */}
                <li
                    data-active={isActiveFilter("deleted")}
                    className={cn(
                        "flex gap-2 items-center cursor-pointer transition-all hover:text-primary",
                        isActiveFilter("deleted")
                            ? "text-primary"
                            : "text-gray-700"
                    )}
                    onClick={() => handleStatusClick("deleted")}
                >
                    <p className="text-sm font-medium">Deleted</p>
                    <div className={cn(isActiveFilter("deleted"))}>
                        <span className="text-sm font-medium">
                            {totalStatus.deleted || 0}
                        </span>
                    </div>
                </li>
            </ul>

            {/* GSAP Animated Line */}
            <div
                ref={activeLineRef}
                className="absolute bottom-0 left-0 h-0.5 bg-primary"
            />
        </div>
    );
}

export default SummaryProductBrand;
