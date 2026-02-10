"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DollarSign, Receipt, ChevronDown, ChevronUp } from "lucide-react";

export default function FeeListSummary({ fees }) {
    const [isOpen, setIsOpen] = useState(false);

    const stats = useMemo(() => {
        const totalFees = fees.length;
        const totalAmount = fees.reduce(
            (sum, fee) => sum + Number(fee.fee || 0),
            0,
        );

        return [
            {
                title: "Total Transactions",
                value: totalFees,
                icon: Receipt,
                color: "text-blue-600",
                bgColor: "bg-blue-50",
            },
            {
                title: "Total Fees Paid",
                value: `Rp ${totalAmount.toLocaleString("id-ID")}`,
                icon: DollarSign,
                color: "text-red-600",
                bgColor: "bg-red-50",
            },
        ];
    }, [fees]);

    // Calculate primary stat for mobile header
    const totalAmount = useMemo(() => {
        return fees.reduce((sum, fee) => sum + Number(fee.fee || 0), 0);
    }, [fees]);

    return (
        <>
            {/* Desktop View - Always Visible Grid */}
            <div className="hidden sm:grid sm:grid-cols-2 gap-4">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index} className="p-0 shadow-none">
                            <CardContent className="px-4 py-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-slate-600 mb-1">
                                            {stat.title}
                                        </p>
                                        <p className="text-xl font-semibold">
                                            {stat.value}
                                        </p>
                                    </div>
                                    <div
                                        className={`p-3 rounded-lg ${stat.bgColor}`}
                                    >
                                        <Icon
                                            className={`size-5 ${stat.color}`}
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Mobile View - Collapsible */}
            <Collapsible
                open={isOpen}
                onOpenChange={setIsOpen}
                className="sm:hidden w-full"
            >
                <Card className="py-2">
                    <CardContent className="px-0">
                        {/* Header - Always Visible */}
                        <CollapsibleTrigger asChild>
                            <Button
                                variant="ghost"
                                className="w-full flex items-center justify-between bg-white"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-red-50">
                                        <DollarSign className="size-4 text-red-600" />
                                    </div>
                                    <div className="text-left">
                                        <p className="text-sm font-semibold">
                                            Fee Summary
                                        </p>
                                        <p className="text-xs font-medium text-red-600">
                                            Total: Rp{" "}
                                            {totalAmount.toLocaleString(
                                                "id-ID",
                                            )}
                                        </p>
                                    </div>
                                </div>
                                {isOpen ? (
                                    <ChevronUp className="size-5 text-slate-400" />
                                ) : (
                                    <ChevronDown className="size-5 text-slate-400" />
                                )}
                            </Button>
                        </CollapsibleTrigger>

                        {/* Collapsible Content */}
                        <CollapsibleContent className="px-4 pt-2">
                            <div className="pt-2 grid grid-cols-2 gap-3">
                                {stats.map((stat, index) => {
                                    const Icon = stat.icon;
                                    return (
                                        <div
                                            key={index}
                                            className="p-3 rounded-lg border bg-slate-50/50"
                                        >
                                            <div className="flex items-center gap-2 mb-2">
                                                <div
                                                    className={`p-1.5 rounded-md ${stat.bgColor}`}
                                                >
                                                    <Icon
                                                        className={`size-3.5 ${stat.color}`}
                                                    />
                                                </div>
                                                <p className="text-xs font-medium text-slate-600">
                                                    {stat.title}
                                                </p>
                                            </div>
                                            <p className="text-lg font-bold ml-0.5">
                                                {stat.value}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </CollapsibleContent>
                    </CardContent>
                </Card>
            </Collapsible>
        </>
    );
}
