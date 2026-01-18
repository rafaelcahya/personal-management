"use client";

import { useEffect, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adjustStock } from "../../../../../lib/api/product";
import { stockAdjustmentSchema } from "@/schemas/product";
import { getProductHistoryByProductListId } from "@/lib/api/productHistory";
import ProductSummary from "./ProductSummary";
import ProductHistoryTable from "./ProductHistoryTable";

export default function StockAdjustment({ product, onClose, onUpdated }) {
    const [productHistory, setProductHistory] = useState([]);
    const form = useForm({
        resolver: zodResolver(stockAdjustmentSchema),
        defaultValues: {
            usage_quantity: 0,
            usage_date: new Date(),
            note: "",
        },
    });

    const { control, handleSubmit, watch, formState } = form;
    const { isSubmitting, errors } = formState;
    const watchQty = watch("usage_quantity");

    // Debug errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.error("Form Validation Errors:", errors);
        }
    }, [errors]);

    const fetchProductHistoryByProductListId = async (productListId) => {
        try {
            const history = await getProductHistoryByProductListId(
                productListId
            );
            setProductHistory(history);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        if (product?.product_list_id) {
            fetchProductHistoryByProductListId(product.product_list_id);
        }
    }, [product]);

    const onSubmit = useCallback(
        async (values) => {
            if (!product) {
                console.error("No product selected");
                return;
            }

            try {
                const payload = {
                    usage_quantity: values.usage_quantity,
                    usage_date: values.usage_date.toISOString(),
                    note: values.note || "",
                };

                const result = await adjustStock(product.id, payload);

                toast.success(
                    values.usage_quantity > 0
                        ? "Product activated!"
                        : "Product marked as out of stock"
                );

                await onUpdated?.();
            } catch (err) {
                console.error("Submit error:", err || "Failed to adjust stock");
            }
        },
        [product, onUpdated]
    );

    if (!product) return null;

    return (
        <Dialog open={!!product} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>📦 Stock Adjustment</DialogTitle>
                    <DialogDescription className="text-slate-foreground">
                        {watchQty > 0
                            ? "Record when you start using this product"
                            : "Mark product as out of stock"}
                    </DialogDescription>
                </DialogHeader>

                {/* Product Summary */}
                <ProductSummary product={product} />

                {/* Product History Table */}
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-slate-700">
                        Recent History (3 latest)
                    </h3>
                    <ProductHistoryTable history={productHistory} />
                </div>

                {/* Show validation errors */}
                {Object.keys(errors).length > 0 && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700">
                        <p className="font-semibold">Validation Errors:</p>
                        <ul className="list-disc ml-4">
                            {Object.entries(errors).map(([key, error]) => (
                                <li key={key}>
                                    {key}: {error.message}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Usage Quantity */}
                        <FormField
                            control={control}
                            name="usage_quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Usage Quantity
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            {...field}
                                            value={field.value ?? ""}
                                            onChange={(e) => {
                                                const val =
                                                    e.target.value === ""
                                                        ? 0
                                                        : Number(
                                                              e.target.value
                                                          );
                                                field.onChange(val);
                                            }}
                                            className="font-medium font-mono text-lg focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                            min={0}
                                            max={product.quantity}
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">
                                        {watchQty > 0
                                            ? `✅ ${watchQty} units in use (active)`
                                            : product.usage_quantity == 0
                                            ? "⚠️ Product not currently in use (inactive)"
                                            : "⚠️ The product you were using has now run out."}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Usage Date */}
                        <FormField
                            control={control}
                            name="usage_date"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="font-medium">
                                        {watchQty > 0
                                            ? "Start Date"
                                            : "End Date"}
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-medium",
                                                    fieldState.error &&
                                                        "border-rose-500",
                                                    !field.value &&
                                                        "text-slate-500"
                                                )}
                                            >
                                                {field.value
                                                    ? format(field.value, "PPP")
                                                    : "Pick a date"}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            className="w-auto p-0"
                                            align="start"
                                        >
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-xs text-muted-foreground">
                                        {watchQty > 0
                                            ? "When did you start using this?"
                                            : "When did this run out?"}
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Note */}
                        <FormField
                            control={control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Note (Optional)
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Additional notes..."
                                            className="text-sm font-medium resize-vertical min-h-[80px] focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500"
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {isSubmitting ? "Saving..." : "Save Adjustment"}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
