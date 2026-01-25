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
import { adjustStock } from "@/lib/api/product";

function RecordUsageForm({ product, onUpdated, onClose }) {
    const [serverError, setServerError] = useState(null);

    const form = useForm({
        defaultValues: {
            usage_quantity: 0,
            start_usage_date: new Date(),
            note: "",
        },
    });

    const { control, handleSubmit, formState, watch } = form;
    const { isSubmitting } = formState;
    const watchQty = watch("usage_quantity");

    const onSubmit = useCallback(
        async (values) => {
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
                setServerError(err.message || "Failed to adjust stock");
            }
        },
        [product, onUpdated, onClose],
    );

    if (!product) return null;

    return (
        <Form {...form}>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="space-y-5"
                id="recordUsageForm"
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
                                    id="usageQuantityField-recordUsageForm"
                                    {...field}
                                    value={field.value ?? ""}
                                    onChange={(e) => {
                                        const val =
                                            e.target.value === ""
                                                ? 0
                                                : Number(e.target.value);
                                        field.onChange(val);
                                    }}
                                    className="font-medium font-mono text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600"
                                    min={0}
                                    max={product.quantity}
                                />
                            </FormControl>
                            <p className="text-xs text-muted-foreground">
                                {watchQty > 0
                                    ? `✅ ${watchQty} units in use (active). Max: ${product.quantity} units left`
                                    : "How many are you using? 🔢"}
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
                                            !field.value && "text-slate-500",
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
                                Started Using On 🗓️
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
                                    id="noteField-recordUsageForm"
                                    {...field}
                                    placeholder="Jot down anything worth remembering... ✍️"
                                    className="text-sm font-medium resize-vertical min-h-[80px] focus-visible:ring-violet-200 focus-visible:border-violet-600"
                                    rows={3}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Server Error */}
                {serverError && (
                    <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                        <div className="flex gap-3">
                            <div className="flex-1">
                                <p className="text-sm font-semibold text-red-900 mb-1">
                                    ⚠️ Unable to Record Usage
                                </p>
                                <p
                                    className="text-sm text-red-800"
                                    id="serverErrorMsg-recordUsageForm"
                                >
                                    {serverError}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
                        id="cancelBtn-recordUsageForm"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        id="startTrackingBtn-recordUsageForm"
                    >
                        {isSubmitting && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        {isSubmitting ? "Saving..." : "Start tracking"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}

export default RecordUsageForm;
