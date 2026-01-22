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
import { quantityUpdateSchema } from "@/schemas/productQuantity";
import { createQuantityUpdate } from "@/lib/api/productQuantity";

export default function AddQuantity({ product, onAdded }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(quantityUpdateSchema),
        defaultValues: {
            quantity_added: 1,
            price: 0,
            purchase_date: new Date(),
            note: "",
        },
    });

    const { control, handleSubmit, watch, reset } = form;
    const quantityAdded = watch("quantity_added");
    const pricePerUnit = watch("price");
    const totalPrice = quantityAdded * pricePerUnit;

    const onSubmit = async (values) => {
        setLoading(true);
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
            console.error("Submit error:", err);
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Add Stock
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>📦 Add Stock</DialogTitle>
                    <DialogDescription>
                        Record new stock purchase for {product.brand}{" "}
                        {product.type} {product.product}
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
                        {/* Quantity Added */}
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
                                            className="font-medium font-mono text-lg"
                                            min={1}
                                        />
                                    </FormControl>
                                    <p className="text-xs text-muted-foreground">
                                        Current stock: {product.quantity}
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
                                            step="0.01"
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    Number(e.target.value),
                                                )
                                            }
                                            className="font-medium font-mono text-lg"
                                            min={0}
                                        />
                                    </FormControl>
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
                                            placeholder="e.g. Bought from Tokopedia"
                                            className="text-sm font-medium resize-vertical min-h-[80px]"
                                            rows={3}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button
                                    type="button"
                                    variant="outline"
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
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
