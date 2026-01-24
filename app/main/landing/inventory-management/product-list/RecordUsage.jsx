import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { format } from "date-fns";
import { Loader2, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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

function RecordUsage({ product, onUpdated, onClose }) {
    const form = useForm({
        resolver: zodResolver(stockAdjustmentSchema),
        defaultValues: {
            usage_quantity: 0,
            start_usage_date: new Date(),
            note: "",
        },
    });

    const { control, handleSubmit, formState, watch } = form;
    const { isSubmitting, errors } = formState;
    const watchQty = watch("usage_quantity");

    // Debug errors
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            console.error("Form Validation Errors:", errors);
        }
    }, [errors]);

    const onSubmit = useCallback(
        async (values) => {
            if (!product) {
                console.error("No product selected");
                return;
            }

            try {
                const payload = {
                    usage_quantity: values.usage_quantity,
                    start_usage_date: values.start_usage_date.toISOString(),
                    note: values.note || "",
                };

                await adjustStock(product.id, payload);

                toast.success(
                    values.usage_quantity > 0
                        ? "Product usage recorded!"
                        : "Product marked as depleted",
                );

                await onUpdated?.();
                onClose?.();
            } catch (err) {
                console.error("Submit error:", err);
                toast.error("Failed to adjust stock");
            }
        },
        [product, onUpdated, onClose],
    );

    if (!product) return null;

    return (
        <div className="space-y-4">
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
                                                    : Number(e.target.value);
                                            field.onChange(val);
                                        }}
                                        className="font-medium font-mono text-lg focus-visible:ring-violet-200 focus-visible:border-violet-600"
                                        min={0}
                                        max={product.quantity}
                                    />
                                </FormControl>
                                <p className="text-xs text-muted-foreground">
                                    {watchQty > 0
                                        ? `✅ ${watchQty} units in use (active). Max: ${product.quantity} units left`
                                        : "⚠️ Enter quantity to start tracking usage"}
                                </p>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Start Usage Date */}
                    <FormField
                        control={control}
                        name="start_usage_date"
                        render={({ field, fieldState }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel className="font-medium">
                                    Start Usage Date
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
                                                    "text-slate-500",
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
                                    When did you start using this?
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
                                        className="text-sm font-medium resize-vertical min-h-[80px] focus-visible:ring-violet-200 focus-visible:border-violet-600"
                                        rows={3}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isSubmitting ? "Saving..." : "Record Usage"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}

export default RecordUsage;
