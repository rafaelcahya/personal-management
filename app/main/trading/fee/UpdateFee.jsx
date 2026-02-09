"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { Loader2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { feeSchema } from "@/schemas/fee";
import { updateFee } from "@/lib/api/fee";
import { formatRupiah } from "@/lib/utils/currencyFormatter";
import DeleteFee from "./DeleteFee";

export default function UpdateFee({ fee, onClose, onUpdated }) {
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);

    const form = useForm({
        resolver: zodResolver(feeSchema),
        defaultValues: {
            fee_name: "",
            fee: "",
            fee_date: new Date(),
        },
    });

    const { control, reset } = form;

    // Reset form saat fee berubah
    useEffect(() => {
        if (fee) {
            reset({
                fee_name: fee.fee_name,
                fee: fee.fee?.toString() || "",
                fee_date: new Date(fee.fee_date),
            });
            setServerError(null);
        }
    }, [fee, reset]);

    const onSubmit = async (values) => {
        setLoading(true);
        setServerError(null);

        try {
            const payload = {
                fee_name: values.fee_name,
                fee: values.fee,
                fee_date: values.fee_date.toISOString().split("T")[0],
            };

            await updateFee(fee.id, payload);

            toast.success("Fee updated successfully! ✅");
            onUpdated?.();
        } catch (err) {
            console.error("Update error:", err);
            setServerError(err.message || "Failed to update fee");
        } finally {
            setLoading(false);
        }
    };

    if (!fee) return null;

    return (
        <Dialog open={!!fee} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh]">
                <DialogHeader className="text-left shrink-0">
                    <DialogTitle>✏️ Update Fee</DialogTitle>
                    <DialogDescription>
                        Adjust your fee details to keep your records accurate
                        and reliable
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {/* Fee Date */}
                            <FormField
                                control={control}
                                name="fee_date"
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="font-medium">
                                            Fee Date
                                        </FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <FormControl>
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
                                                        {field.value ? (
                                                            format(
                                                                field.value,
                                                                "PPP",
                                                            )
                                                        ) : (
                                                            <span>
                                                                Pick a date
                                                            </span>
                                                        )}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
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
                                            When was this fee charged? 📅
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Fee Name */}
                            <FormField
                                control={control}
                                name="fee_name"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">
                                            Fee Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g., Admin Fee, Trading Commission"
                                                className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                                                    fieldState.error
                                                        ? "border-rose-500"
                                                        : ""
                                                }`}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            What type of fee is this? 🏷️
                                        </p>
                                        <FormMessage className="font-medium">
                                            {fieldState.error?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* Fee Amount */}
                            <FormField
                                control={control}
                                name="fee"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">
                                            Fee Amount
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                value={
                                                    field.value
                                                        ? formatRupiah(
                                                              field.value,
                                                          )
                                                        : ""
                                                }
                                                placeholder="e.g., 10000"
                                                className={`focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium ${
                                                    fieldState.error
                                                        ? "border-rose-500"
                                                        : ""
                                                }`}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value.replace(
                                                            /\D/g,
                                                            "",
                                                        ),
                                                    )
                                                }
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            How much did you pay? 💸
                                        </p>
                                        <FormMessage className="font-medium">
                                            {fieldState.error?.message}
                                        </FormMessage>
                                    </FormItem>
                                )}
                            />

                            {/* Server Error Display */}
                            {serverError && (
                                <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-red-900 mb-1">
                                                ⚠️ Unable to Update Fee
                                            </p>
                                            <p className="text-sm text-red-800">
                                                {serverError}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="shrink-0 pt-4 flex-col sm:flex-row gap-2">
                            <DeleteFee
                                fee={fee}
                                onDeleted={onUpdated}
                                onClose={onClose}
                            />

                            <div className="flex gap-2 flex-1 justify-end">
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={onClose}
                                    disabled={loading}
                                    className="bg-transparent hover:bg-secondary-hover text-secondary-foreground hover:text-secondary-foreground border-none"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    {loading && (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    {loading ? "Updating..." : "Update Fee"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
