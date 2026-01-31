"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { feeSchema } from "@/schemas/fee";
import { updateFee } from "@/lib/api/fee";
import { formatRupiah } from "@/lib/utils/currencyFormatter";
import safeDate from "@/lib/utils/safeDate";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Calendar } from "@/components/ui/calendar";
import DeleteFee from "./DeleteFee";

export default function UpdateFee({ fee, onClose, onUpdated }) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(feeSchema),
        defaultValues: {},
    });

    const { control, handleSubmit, reset } = form;

    useEffect(() => {
        if (fee) {
            reset({
                fee_date: safeDate(fee.fee_date),
                fee: fee.fee?.toString() ?? "",
                fee_name: fee.fee_name ?? "",
            });
        }
    }, [fee, reset]);

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            const payload = {
                ...values,
                fee_date: values.fee_date
                    ? format(values.fee_date, "yyyy-MM-dd")
                    : null,
            };
            await updateFee(fee.id, payload);
            toast.success("Fee updated successfully!");
            onUpdated?.();
            onClose();
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!fee) return null;

    return (
        <Dialog open={!!fee} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-lg overflow-y-auto font-medium">
                <DialogHeader>
                    <DialogTitle>Update Fee</DialogTitle>
                    <DialogDescription>
                        Adjust your fee details to ensure your records stay
                        precise and your performance analysis remains reliable.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleUpdate)}
                        className="space-y-6"
                    >
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
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-medium",
                                                    fieldState.error &&
                                                        "border-rose-500 text-trade-loss",
                                                    !field.value &&
                                                        "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
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
                                                className="calendar-02"
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
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
                                            placeholder="e.g. Admin Fee"
                                            className={cn(
                                                "text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500",
                                                fieldState.error &&
                                                    "border-rose-500"
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Fee */}
                        <FormField
                            control={control}
                            name="fee"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Fee
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            type="text"
                                            value={
                                                field.value
                                                    ? formatRupiah(field.value)
                                                    : ""
                                            }
                                            placeholder="e.g. 1000"
                                            className={cn(
                                                "text-sm focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500",
                                                fieldState.error &&
                                                    "border-rose-500"
                                            )}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value.replace(
                                                        /\D/g,
                                                        ""
                                                    )
                                                )
                                            }
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <div className="flex justify-between w-full">
                                <DeleteFee
                                    fee={fee}
                                    onDeleted={onUpdated}
                                    onClose={onClose}
                                />
                                <div className="space-x-2">
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            className="font-medium bg-transparent hover:bg-secondary-hover text-secondary-foreground hover:text-secondary-foreground"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        type="submit"
                                        disabled={loading}
                                        className="font-medium bg-primary hover:bg-primary-hover text-primary-foreground"
                                    >
                                        {loading ? "Updating..." : "Update Fee"}
                                    </Button>
                                </div>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
