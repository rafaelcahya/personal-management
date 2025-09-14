"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { feeSchema } from "@/schemas/fee";
import { createFee } from "@/lib/api/fee";
import { formatRupiah } from "@/lib/utils/currencyFormatter";
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
    DialogTrigger,
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

export default function AddFee({ onAdded }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(feeSchema),
        defaultValues: {
            fee_date: new Date(),
            fee: "",
            fee_name: "",
        },
    });

    const { control, handleSubmit, reset } = form;

    const handleAddNewFee = async (values) => {
        setLoading(true);
        try {
            await createFee(values);
            toast.success("New fee added successfully!");
            setOpen(false);
            onAdded?.();
            reset();
        } catch (err) {
            toast.error(err.message || "Something went wrong");
            toast.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-violet-600 hover:bg-violet-700 text-white">
                    Add New Fee
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-lg overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Fee</DialogTitle>
                    <DialogDescription>
                        Log your fee details to make sure your performance
                        calculations stay accurate.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleAddNewFee)}
                        className="space-y-6"
                    >
                        {/* Fee Date */}
                        <FormField
                            control={control}
                            name="fee_date"
                            render={({ field, fieldState }) => (
                                <FormItem className="flex flex-col">
                                    <FormLabel>Fee Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-[240px] pl-3 text-left font-normal",
                                                    fieldState.error &&
                                                        "border-rose-500 text-rose-500",
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
                                    <FormLabel>Fee Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. Admin Fee"
                                            className={cn(
                                                "focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500",
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
                                    <FormLabel>Fee</FormLabel>
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
                                                "focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500",
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
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-violet-600 hover:bg-violet-700 dark:text-white"
                            >
                                {loading ? "Submitting..." : "Submit new fee"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
