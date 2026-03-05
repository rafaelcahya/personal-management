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
import { getProductLogByProductListId } from "@/lib/api/productHistory";
import ProductSummary from "./ProductSummary";
import ProductUsageLog from "./ProductUsageLog";
import RecordUsageForm from "./RecordUsageForm";

export default function StockAdjustment({ product, onClose, onUpdated }) {
    const [productLog, setProductLog] = useState([]);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchProductHistory = async (productId) => {
        try {
            setIsRefreshing(true);
            const log = await getProductLogByProductListId(productId);
            setProductLog(log);
        } catch (err) {
            console.error("Failed to fetch log:", err.message);
        } finally {
            setIsRefreshing(false);
        }
    };

    const handleUpdated = async () => {
        if (product?.id) {
            await fetchProductHistory(product.id);
        }

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
            <DialogContent className="sm:max-w-lg md:max-w-3xl lg:max-w-4xl flex flex-col max-h-[90vh]">
                <DialogHeader className="text-left shrink-0">
                    <DialogTitle>📦 Track Product Usage</DialogTitle>
                    <DialogDescription className="text-slate-foreground">
                        Let's track when you started using this product 🎯
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto">
                    <div className="flex flex-col sm:flex-row gap-5 w-full">
                        {/* Product Summary */}
                        <ProductSummary product={product} />

                        <Tabs
                            defaultValue="productUsageLog"
                            className="w-full sm:w-2/3 space-y-5"
                        >
                            <TabsList className="bg-violet-50/75 w-full flex flex-col sm:flex-row sm:grid sm:grid-cols-2 h-auto gap-1">
                                <TabsTrigger
                                    value="productUsageLog"
                                    id="productUsageLogTab"
                                    className="text-sm sm:text-sm py-2.5 px-4 w-full justify-start sm:justify-center"
                                >
                                    <div>📊 Product Usage Log</div>
                                </TabsTrigger>
                                <TabsTrigger
                                    value="recordNewUsage"
                                    id="recordNewUsageTab"
                                    className="text-sm sm:text-sm py-2.5 px-4 w-full justify-start sm:justify-center"
                                >
                                    <div>➕ Record New Usage</div>
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="productUsageLog">
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-slate-700">
                                                📋 Product Usage Log
                                            </h3>
                                            {isRefreshing && (
                                                <span className="text-xs text-muted-foreground">
                                                    Refreshing...
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            See when this product was activated,
                                            how long it lasted, and usage notes
                                            🔍
                                        </p>
                                    </div>
                                    <ProductUsageLog
                                        log={productLog}
                                        onUpdate={handleUpdated}
                                    />
                                </div>
                            </TabsContent>

                            <TabsContent value="recordNewUsage">
                                <div className="space-y-5">
                                    <div>
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-semibold text-slate-700">
                                                📋 Let's Log Your Usage!
                                            </h3>
                                            {isRefreshing && (
                                                <span className="text-xs text-muted-foreground">
                                                    Refreshing...
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Pop in the details below so we can
                                            track when you opened this. Super
                                            helpful for knowing how fast you go
                                            through stuff! 💡
                                        </p>
                                    </div>
                                    <RecordUsageForm
                                        product={product}
                                        onUpdated={handleUpdated}
                                        onClose={onClose}
                                    />
                                </div>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
