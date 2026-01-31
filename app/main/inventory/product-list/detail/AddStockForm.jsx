"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { toast } from "sonner";
import { CalendarIcon, Loader2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
import { createQuantityUpdate } from "@/lib/api/productQuantity";

export default function AddStockForm({ product, onAdded }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [serverError, setServerError] = useState(null);

    const form = useForm({
        defaultValues: {
            quantity_added: 1,
            price: 0,
            purchase_date: new Date(),
            note: "",
        },
    });

    const { control, handleSubmit, reset } = form;

    const onSubmit = async (values) => {
        setLoading(true);
        setServerError(null);

        try {
            await createQuantityUpdate({
                product_list_id: product.product_list_id,
                quantity_added: values.quantity_added,
                price: values.price,
                purchase_date: values.purchase_date.toISOString(),
                note: values.note,
            });

            toast.success("Quantity updated successfully!");
            setOpen(false);
            reset();
            onAdded?.();
        } catch (err) {
            setServerError(err.message || "Failed to update quantity");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            setServerError(null);
            reset();
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button
                    size="xs"
                    className="bg-white text-black text-left w-max p-0"
                    id="addStockBtn-productList"
                >
                    Add Stock
                </Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-md flex flex-col max-h-[90vh]"
                id="addStockPopup"
            >
                <DialogHeader className="text-left shrink-0">
                    <DialogTitle>📦 Add More Stock</DialogTitle>
                    <DialogDescription>
                        Restocking {product.brand} {product.type}{" "}
                        {product.product}. Let's add it to your inventory and
                        keep things organized! 🎯
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <div className="flex-1 overflow-y-auto space-y-5">
                            {/* Quantity to Add */}
                            <FormField
                                control={control}
                                name="quantity_added"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">
                                            Quantity to Add
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                id="quantityToAddField"
                                                className="font-medium font-mono focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm"
                                                min={1}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            Right now you've got{" "}
                                            {product.quantity} units in on hand
                                            📦
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Price */}
                            <FormField
                                control={control}
                                name="price"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">
                                            Price (Rp)
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                id="priceField"
                                                step="0.01"
                                                {...field}
                                                onChange={(e) =>
                                                    field.onChange(
                                                        Number(e.target.value),
                                                    )
                                                }
                                                className="font-medium font-mono focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm"
                                                min={0}
                                            />
                                        </FormControl>
                                        {/* TODO:: Add information about the last purchase price and average purchase price */}
                                        <p className="text-xs text-muted-foreground">
                                            How much did you spend on this
                                            restock? 💰
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Purchase Date */}
                            <FormField
                                control={control}
                                name="purchase_date"
                                render={({ field, fieldState }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel className="font-medium">
                                            Purchase Date
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
                                                        ? format(
                                                              field.value,
                                                              "PPP",
                                                          )
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
                                        {/* TODO:: Add information about the last purchase price and average purchase price */}
                                        <p className="text-xs text-muted-foreground">
                                            When did you buy this? 📅
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
                                                id="noteField"
                                                placeholder="e.g. Where'd you buy it? Any special deals? Jot it down here ✍️"
                                                className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-vertical min-h-[80px]"
                                                rows={3}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            {serverError && (
                                <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-red-900 mb-1">
                                                ⚠️ Unable to Add Stock
                                            </p>
                                            <p className="text-sm text-red-800">
                                                {serverError}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <DialogFooter className="shrink-0 pt-4">
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
                                    id="cancelBtn-addStockPopup"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={loading}
                                id="submitBtn-addStockPopup"
                            >
                                {loading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {loading ? "Adding..." : "Add Stock"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
