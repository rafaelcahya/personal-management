import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { endUsageSchema } from "@/schemas/product";
import { updateProductUsage } from "@/lib/api/productHistory";

export default function UpdateUsageForm({ historyItem, onUpdate, onCancel }) {
    const form = useForm({
        resolver: zodResolver(endUsageSchema),
        defaultValues: {
            depleted_quantity: historyItem.quantity || 0,
            end_usage_date: historyItem.end_usage_date
                ? new Date(historyItem.end_usage_date)
                : new Date(),
        },
    });

    const { control, handleSubmit, formState } = form;
    const { isSubmitting } = formState;

    const onSubmit = async (values) => {
        try {
            await updateProductUsage(historyItem.id, {
                depleted_quantity: Number(values.depleted_quantity),
                end_usage_date: values.end_usage_date.toISOString(),
            });

            toast.success("Usage record updated successfully");
            await onUpdate?.();
            onCancel?.();
        } catch (err) {
            console.error("Update error:", err);
            toast.error("Failed to update usage record");
        }
    };

    return (
        <div className="max-w-2xl">
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-slate-900">
                    {historyItem.status === "active"
                        ? "Mark Product as Depleted"
                        : "Product Already Depleted"}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 whitespace-normal">
                    {historyItem.status === "active"
                        ? `Currently ${historyItem.remaining_quantity || historyItem.quantity} units remaining. How many have been depleted?`
                        : "This product usage has already been marked as depleted. You can update the details below."}
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {/* Depleted Quantity */}
                        <FormField
                            control={control}
                            name="depleted_quantity"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-xs font-medium">
                                        Depleted Quantity
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="font-mono"
                                            min={1}
                                            max={historyItem.remaining_quantity}
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">
                                        Max: {historyItem.remaining_quantity}{" "}
                                        units
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* End Usage Date */}
                        <FormField
                            control={control}
                            name="end_usage_date"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel className="text-xs font-medium">
                                        End Usage Date{" "}
                                        <span className="text-red-500">*</span>
                                    </FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                className={cn(
                                                    "w-full pl-3 text-left font-medium justify-start",
                                                    fieldState.error &&
                                                        "border-rose-500",
                                                    !field.value &&
                                                        "text-slate-500",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {field.value
                                                    ? format(field.value, "PPP")
                                                    : "Pick a date"}
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
                                                disabled={(date) =>
                                                    date <
                                                    new Date(
                                                        historyItem.start_usage_date,
                                                    )
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-xs text-muted-foreground">
                                        When did this run out?
                                    </p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={onCancel}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" size="sm" disabled={isSubmitting}>
                            {isSubmitting && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {isSubmitting ? "Updating..." : "Update Record"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
