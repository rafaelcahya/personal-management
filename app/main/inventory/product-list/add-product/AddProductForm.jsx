"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, PlusIcon } from "lucide-react";
import { productSchema } from "@/schemas/product";
import { createProduct } from "@/lib/api/product";
import { fetchProductBrand } from "@/lib/api/productBrand";
import { fetchProductName } from "@/lib/api/productName";

export default function AddProductForm({ onAdded }) {
    const [open, setOpen] = useState(false);
    const [productBrands, setProductBrands] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [serverError, setServerError] = useState(null);

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            image: null,
            product_brand: "",
            product_name: "",
            type: "",
            note: "",
        },
    });

    const { watch, control, reset } = form;
    const image = watch("image");

    useEffect(() => {
        if (image && image[0]) {
            const file = image[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setImagePreview(null);
        }
    }, [image]);

    const loadProductBrands = async () => {
        try {
            const brands = await fetchProductBrand();
            const activeBrands =
                brands?.filter((brand) => brand.brand_status === "active") ||
                [];
            setProductBrands(activeBrands);
        } catch (err) {
            console.error("Fetch brands error:", err);
        }
    };

    const loadProductNames = async () => {
        try {
            const names = await fetchProductName();
            const activeNames =
                names?.filter(
                    (name) => name.product_name_status === "active",
                ) || [];
            setProductNames(activeNames);
        } catch (err) {
            console.error("Fetch names error:", err);
        }
    };

    useEffect(() => {
        if (open) {
            loadProductBrands();
            loadProductNames();
        }
    }, [open]);

    const onSubmit = async (values) => {
        setLoading(true);
        setServerError(null);

        try {
            let imageBase64 = "";

            if (values.image && values.image[0]) {
                const file = values.image[0];
                imageBase64 = await new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result);
                    reader.onerror = reject;
                    reader.readAsDataURL(file);
                });
            }

            const payload = {
                product_id: values.product_name,
                brand_id: values.product_brand,
                type: values.type,
                usage_quantity: 0,
                product_image: imageBase64,
                note: values.note || "",
            };

            await createProduct(payload);

            toast.success("Product added successfully!");
            setOpen(false);
            reset();
            setImagePreview(null);
            onAdded?.();
        } catch (err) {
            console.error("Submit error:", err);
            setServerError(err.message || "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    const handleOpenChange = (isOpen) => {
        setOpen(isOpen);
        if (!isOpen) {
            setServerError(null);
            reset();
            setImagePreview(null);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <PlusIcon />
                    <span>Add Product</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh]">
                <DialogHeader className="text-left shrink-0">
                    <DialogTitle>🛍️ Add New Product</DialogTitle>
                    <DialogDescription>
                        Got a new item? Let's add it to your inventory!
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="flex flex-col flex-1 min-h-0"
                    >
                        <div className="flex-1 overflow-y-auto space-y-4">
                            {/* Image Upload */}
                            <FormField
                                control={control}
                                name="image"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">
                                            Product Image
                                        </FormLabel>
                                        <FormControl className="cursor-pointer">
                                            <Input
                                                id="image"
                                                type="file"
                                                accept="image/*"
                                                className="text-sm font-medium"
                                                onChange={(e) => {
                                                    const files =
                                                        e.target.files;
                                                    field.onChange(files);
                                                }}
                                            />
                                        </FormControl>
                                        {imagePreview && (
                                            <div className="mt-2">
                                                <img
                                                    src={imagePreview}
                                                    alt="Preview"
                                                    className="w-24 h-24 object-cover rounded-md border"
                                                />
                                            </div>
                                        )}
                                        <FormMessage>
                                            {fieldState.error?.message}
                                        </FormMessage>
                                        <p className="text-xs text-muted-foreground">
                                            Add a photo to easily identify this
                                            product later 🖼️
                                        </p>
                                    </FormItem>
                                )}
                            />

                            {/* Product Brand */}
                            <FormField
                                control={form.control}
                                name="product_brand"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product brand</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="min-w-full font-medium">
                                                    <SelectValue placeholder="Select brand" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-60 overflow-y-auto">
                                                {productBrands?.length === 0 ? (
                                                    <div className="p-8 text-center text-muted-foreground">
                                                        No active product brands
                                                        available
                                                    </div>
                                                ) : (
                                                    productBrands?.map(
                                                        (productBrand) => (
                                                            <SelectItem
                                                                key={
                                                                    productBrand.id
                                                                }
                                                                value={productBrand.id.toString()}
                                                            >
                                                                {
                                                                    productBrand.brand
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">
                                            Which brand is this from? 🏷️
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Product Name */}
                            <FormField
                                control={control}
                                name="product_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Product name</FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="min-w-full font-medium">
                                                    <SelectValue placeholder="Select name" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-60 overflow-y-auto">
                                                {productNames?.length === 0 ? (
                                                    <div className="p-8 text-center text-muted-foreground">
                                                        No active product names
                                                        available
                                                    </div>
                                                ) : (
                                                    productNames?.map(
                                                        (productName) => (
                                                            <SelectItem
                                                                key={
                                                                    productName.id
                                                                }
                                                                value={productName.id.toString()}
                                                            >
                                                                {
                                                                    productName.product_name
                                                                }
                                                            </SelectItem>
                                                        ),
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-xs text-muted-foreground">
                                            What's the product called? 📦
                                        </p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Type */}
                            <FormField
                                control={control}
                                name="type"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel className="font-medium">
                                            Type
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="e.g. Whitening, Hydrating, SPF 50"
                                                className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                                    fieldState.error
                                                        ? "border-rose-500"
                                                        : ""
                                                }`}
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            What kind is it? (serum, lotion,
                                            toner, etc.) 💡
                                        </p>
                                        <FormMessage className="font-medium">
                                            {fieldState.error?.message}
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
                                            Notes
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                value={field.value || ""}
                                                placeholder="Additional details or reminders..."
                                                className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium"
                                            />
                                        </FormControl>
                                        <p className="text-xs text-muted-foreground">
                                            Optional notes about this product 📝
                                        </p>
                                    </FormItem>
                                )}
                            />

                            {/* Server Error Display */}
                            {serverError && (
                                <div className="rounded-lg border-2 border-red-200 bg-red-50/50 p-4 animate-in fade-in-50 slide-in-from-top-2 duration-200">
                                    <div className="flex gap-3">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-red-900 mb-1">
                                                ⚠️ Unable to Add Product
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
                                    disabled={loading}
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button type="submit" disabled={loading}>
                                {loading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {loading ? "Adding..." : "Add Product"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
