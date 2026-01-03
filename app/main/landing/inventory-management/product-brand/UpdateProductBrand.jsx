"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
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
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { productBrandSchema } from "@/schemas/productBrand";
import { updateProductBrand } from "@/lib/api/productBrand";
import ProductBrandDelete from "./DeleteProductBrand";

export default function ProductBrandUpdate({
    productBrand,
    onClose,
    onUpdated,
}) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(productBrandSchema),
        defaultValues: {
            brand: "",
            brand_status: "active",
            note: "",
        },
    });

    const { control, handleSubmit, reset } = form;

    useEffect(() => {
        if (productBrand) {
            reset({
                brand: productBrand.brand || "",
                brand_status: productBrand.brand_status || "active",
                note: productBrand.note || "",
            });
        }
    }, [productBrand, reset]);

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            await updateProductBrand(productBrand.id, values);
            toast.success("Product brand updated successfully!");
            onUpdated();
            onClose();
        } catch (err) {
            toast.error(err.message || "Failed to update product brand");
        } finally {
            setLoading(false);
        }
    };

    const isDeleted = productBrand?.brand_status === "deleted";

    if (!productBrand) return null;

    return (
        <Dialog open={!!productBrand} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Product Brand</DialogTitle>
                    <DialogDescription>
                        Edit brand details including name, status, and notes.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleUpdate)}
                        className="space-y-4"
                    >
                        {/* Brand Name */}
                        <FormField
                            control={control}
                            name="brand"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Brand Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. Clear"
                                            className={cn(
                                                "text-sm font-medium capitalize focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500",
                                                fieldState.error &&
                                                    "border-red-500 focus-visible:ring-red-500"
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage>
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Status Select */}
                        <FormField
                            control={control}
                            name="brand_status"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Status
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="active">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-green-500 rounded-full" />
                                                    <span>Active</span>
                                                </div>
                                            </SelectItem>
                                            <SelectItem value="inactive">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                                                    <span>Inactive</span>
                                                </div>
                                            </SelectItem>
                                            {isDeleted && (
                                                <SelectItem
                                                    value="deleted"
                                                    className="text-red-600 hover:bg-red-50"
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                                                        <span>Deleted</span>
                                                    </div>
                                                </SelectItem>
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage>
                                        {
                                            form.formState.errors.brand_status
                                                ?.message
                                        }
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        {/* Notes */}
                        <FormField
                            control={control}
                            name="note"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Note
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Additional notes about this brand..."
                                            className="text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 resize-vertical min-h-[80px]"
                                            rows={3}
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="gap-2">
                            <div
                                className={cn(
                                    "flex justify-between w-full",
                                    isDeleted && "justify-end"
                                )}
                            >
                                {!isDeleted && (
                                    <ProductBrandDelete
                                        productBrand={productBrand}
                                        onDeleted={onUpdated}
                                        onClose={onClose}
                                    />
                                )}
                                <div className="space-x-2">
                                    <DialogClose asChild>
                                        <Button
                                            type="button"
                                            className="text-violet-600 bg-white dark:bg-transparent hover:bg-violet-100 dark:hover:bg-violet-500/5 font-medium"
                                        >
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button type="submit" disabled={loading}>
                                        {loading && (
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        {loading
                                            ? "Updating..."
                                            : "Update Product Brand"}
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
