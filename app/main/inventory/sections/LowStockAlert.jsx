"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import StatusBadge from "../components/StatusBadge";
import SkeletonRows from "../components/SkeletonRows";

function StockBadge({ quantity }) {
    if (quantity === 0) {
        return (
            <span className="bg-red-100 text-red-700 border border-red-200 rounded-full px-2 py-0.5 text-xs font-medium">
                Out of Stock
            </span>
        );
    }
    return (
        <span className="bg-orange-100 text-orange-700 border border-orange-200 rounded-full px-2 py-0.5 text-xs font-medium">
            Low: {quantity} left
        </span>
    );
}

function LowStockTable({ items }) {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide w-8">No</th>
                        <th className="text-left py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Product</th>
                        <th className="text-center py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Status</th>
                        <th className="text-right py-3 px-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item, index) => (
                        <tr key={item.id} className="border-b border-slate-100 hover:bg-violet-50/30 transition-colors">
                            <td className="py-3 px-3 text-slate-400 text-xs">{index + 1}</td>
                            <td className="py-3 px-3">
                                <p className="text-xs text-slate-400">{item.brand || "—"}</p>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <p className="font-medium text-slate-700 truncate max-w-[120px] sm:max-w-none">{item.product}</p>
                                    {item.type && (
                                        <span className="text-xs bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded shrink-0">{item.type}</span>
                                    )}
                                </div>
                            </td>
                            <td className="py-3 px-3 text-center hidden sm:table-cell">
                                <StatusBadge status={item.product_status} />
                            </td>
                            <td className="py-3 px-3 text-right">
                                <StockBadge quantity={item.quantity} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default function LowStockAlert({ items, loading }) {
    const [modalOpen, setModalOpen] = useState(false);
    const top5 = items.slice(0, 5);

    return (
        <>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm shadow-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100">
                    <h2 className="text-base font-semibold text-slate-800">🚨 Low Stock Alert</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Products running low — restock soon</p>
                </div>
                <div className="px-2 py-2">
                    {loading ? (
                        <SkeletonRows count={3} />
                    ) : items.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-slate-400">All good! Stock levels are healthy 🎉</p>
                        </div>
                    ) : (
                        <LowStockTable items={top5} />
                    )}
                </div>
                {!loading && items.length > 0 && (
                    <div className="px-5 py-3 border-t border-slate-100 flex justify-end">
                        <button
                            onClick={() => setModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium text-violet-700 border border-violet-200 hover:bg-violet-50 focus:outline-none transition-colors"
                        >
                            View All
                        </button>
                    </div>
                )}
            </div>

            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent className="max-w-2xl w-full max-h-[85vh] flex flex-col p-0 gap-0">
                    <DialogHeader className="px-6 py-4 border-b border-slate-100 shrink-0">
                        <DialogTitle className="text-base font-semibold text-slate-800">
                            All Low Stock Products
                        </DialogTitle>
                        <p className="text-xs text-slate-400 mt-0.5">Sorted by lowest stock first</p>
                    </DialogHeader>
                    <div className="overflow-y-auto flex-1 px-2 py-2">
                        <LowStockTable items={items} />
                    </div>
                </DialogContent>
            </Dialog>
        </>
    );
}
