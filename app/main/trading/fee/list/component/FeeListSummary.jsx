"use client";

import { DollarSign, Receipt } from "lucide-react";

export default function FeeListSummary({ fees }) {
    const totalFees = fees.length;
    const totalAmount = fees.reduce(
        (sum, fee) => sum + Number(fee.fee || 0),
        0,
    );

    const stats = [
        {
            label: "Total Transactions",
            value: totalFees,
            icon: Receipt,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            label: "Total Fees Paid",
            value: `Rp ${totalAmount.toLocaleString("id-ID")}`,
            icon: DollarSign,
            color: "text-red-600",
            bgColor: "bg-red-50",
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <div
                        key={index}
                        className="border rounded-xl p-4 bg-white hover:shadow-sm transition-shadow"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-500 mb-1">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold">
                                    {stat.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                                <Icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
