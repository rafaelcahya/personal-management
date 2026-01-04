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

import { productNameSchema } from "@/schemas/productName";
import { updateProductName } from "@/lib/api/productName";
import DeleteProductName from "./DeleteProductName";

export default function ProductNameUpdate({ productName, onClose, onUpdated }) {
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(productNameSchema),
        defaultValues: {
            product_name: "",
            product_name_status: "active",
            note: "",
        },
    });

    const { control, handleSubmit, reset } = form;

    useEffect(() => {
        if (productName) {
            reset({
                product_name: productName.product_name || "",
                product_name_status:
                    productName.product_name_status || "active",
                note: productName.note || "",
            });
        }
    }, [productName, reset]);

    const handleUpdate = async (values) => {
        setLoading(true);
        try {
            await updateProductName(productName.id, values);
            toast.success("Product name updated successfully!");
            onUpdated();
            onClose();
        } catch (err) {
            toast.error(err.message || "Failed to update product name");
        } finally {
            setLoading(false);
        }
    };

    const isDeleted = productName?.product_name_status === "deleted";

    if (!productName) return null;

    return (
        <Dialog open={!!productName} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Update Product Name</DialogTitle>
                    <DialogDescription>
                        Edit name details including name, status, and notes.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleUpdate)}
                        className="space-y-4"
                    >
                        <FormField
                            control={control}
                            name="product_name"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Product Name
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
                            name="product_name_status"
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
                                            form.formState.errors.product_name_status
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
                                    <DeleteProductName
                                        productName={productName}
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
