"use client";

import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductHistoryByProductListId } from "@/lib/api/productHistory";
import ProductSummary from "./ProductSummary";
import ProductHistoryTable from "./ProductHistoryTable";
import RecordUsage from "./RecordUsage";

export default function StockAdjustment({ product, onClose, onUpdated }) {
    const [productHistory, setProductHistory] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchProductHistory = async (productId) => {
        try {
            setIsRefreshing(true);
            const history = await getProductHistoryByProductListId(productId);
            setProductHistory(history);
        } catch (err) {
            console.error("Failed to fetch history:", err.message);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleUpdated = async () => {
        // Refresh history
        if (product?.id) {
            await fetchProductHistory(product.id);
        }

        // Refresh parent product list
        await onUpdated?.();
    };

    useEffect(() => {
        if (product?.id) {
            fetchProductHistory(product.id);
        }
    }, [product]);

    if (!product) return null;

    return (
        <Dialog open={!!product} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-4xl min-h-[600px] max-h-[90vh] overflow-y-auto flex flex-col gap-6">
                <DialogHeader>
                    <DialogTitle>📦 Stock Adjustment</DialogTitle>
                    <DialogDescription className="text-slate-foreground">
                        Record when you start using this product
                    </DialogDescription>
                </DialogHeader>

                <div className="flex gap-10 w-full">
                    {/* Product Summary */}
                    <ProductSummary product={product} />

                    <Tabs
                        defaultValue="recordUsageLog"
                        className="w-2/3 space-y-5"
                    >
                        <TabsList>
                            <TabsTrigger value="recordUsageLog">
                                Usage History
                            </TabsTrigger>
                            <TabsTrigger value="recordUsage">
                                Record New Usage
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="recordUsageLog">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-slate-700">
                                        Product Usage Log
                                    </h3>
                                    {isRefreshing && (
                                        <span className="text-xs text-muted-foreground">
                                            Refreshing...
                                        </span>
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    See when this product was activated, how
                                    long it lasted, and usage notes
                                </p>
                                <ProductHistoryTable
                                    history={productHistory}
                                    onUpdate={handleUpdated}
                                />
                            </div>
                        </TabsContent>

                        <TabsContent value="recordUsage">
                            <RecordUsage
                                product={product}
                                onUpdated={handleUpdated}
                                onClose={onClose}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </DialogContent>
        </Dialog>
    );
}
