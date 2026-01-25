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
import { Loader2 } from "lucide-react";
import { productSchema } from "@/schemas/product";
import { createProduct } from "@/lib/api/product";
import { getProductBrands } from "@/lib/api/productBrand";
import { getProductNames } from "@/lib/api/productName";

export default function AddProductForm({ onAdded }) {
    const [open, setOpen] = useState(false);
    const [productBrands, setProductBrands] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const form = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            image: null,
            product_brand: "",
            product_name: "",
            type: "",
            quantity: "",
            note: "",
            product_status: "active",
        },
    });

    const { watch, control } = form;
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

    // Fetch product brands
    const fetchProductBrands = async () => {
        try {
            const brands = await getProductBrands();
            setProductBrands(brands);
        } catch (err) {
            console.error(err.message);
        }
    };

    // Fetch product names
    const fetchProductNames = async () => {
        try {
            const names = await getProductNames();
            setProductNames(names);
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        if (open) {
            fetchProductBrands();
            fetchProductNames();
        }
    }, [open]);

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            await createProduct({
                product_id: values.product_name,
                brand_id: values.product_brand,
                type: values.type,
                product_status: values.product_status,
                usage_quantity: 0,
                product_image: "",
                usage_date: new Date().toISOString(),
                note: values.note || "",
            });

            toast.success("Product added successfully");
            setOpen(false);
            form.reset();
            setImagePreview(null);
            onAdded?.();
        } catch (err) {
            console.error("Submit error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Add New Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader className="text-left">
                    <DialogTitle>🛍️ Add New Product</DialogTitle>
                    <DialogDescription>
                        Got a new item? Let's add it to your inventory!
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                                const files = e.target.files;
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
                                                <SelectValue placeholder="Select product brand" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            {productBrands?.length === 0 ? (
                                                <div className="p-8 text-center text-muted-foreground">
                                                    No product brands available
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
                                                            {productBrand.brand}
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
                                                <SelectValue placeholder="Select product name" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-60 overflow-y-auto">
                                            {productNames?.length === 0 ? (
                                                <div className="p-8 text-center text-muted-foreground">
                                                    No product names available
                                                </div>
                                            ) : (
                                                productNames?.map(
                                                    (productName) => (
                                                        <SelectItem
                                                            key={productName.id}
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
                                        What kind is it? (serum, lotion, toner,
                                        etc.) 💡
                                    </p>
                                    <FormMessage className="font-medium">
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

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
                                            placeholder="Any details worth remembering..."
                                            className="focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 text-sm font-medium"
                                        />
                                    </FormControl>
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
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
