"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// Schema validation
const formSchema = z.object({
    product_brand: z.string().min(1, "Please select a product brand"),
    type: z.string().min(1, "Please select a type"),
    product_name: z.string().min(1, "Please select a product name"),
});

export default function AddProduct({ onAdded }) {
    const [open, setOpen] = useState(false);
    const [productBrands, setProductBrands] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [loading, setLoading] = useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            product_brand: "",
            product_name: "",
            type: "",
        },
    });

    const { watch, setValue, control, handleSubmit, reset } = form;

    // Fetch product brands
    const fetchProductBrands = async () => {
        try {
            const res = await fetch("/api/inventory/product/brand/list");
            const data = await res.json();
            if (data.success) {
                setProductBrands(data.productBrands || []);
            }
        } catch (err) {
            toast.error("Failed to load product brands");
        }
    };

    useEffect(() => {
        if (open) {
            fetchProductBrands();
        }
    }, [open]);

    // Fetch product names
    const fetchProductNames = async () => {
        try {
            const res = await fetch("/api/inventory/product/name/list");
            const data = await res.json();
            if (data.success) {
                setProductNames(data.productNames || []);
            }
        } catch (err) {
            toast.error("Failed to load product names");
        }
    };

    useEffect(() => {
        if (open) {
            fetchProductNames();
        }
    }, [open]);

    const onSubmit = async (values) => {
        setLoading(true);
        try {
            const res = await fetch("/api/inventory/products", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
            });

            if (res.ok) {
                toast.success("Product added successfully");
                setOpen(false);
                form.reset();
                onAdded?.(); // Refresh list
            } else {
                toast.error("Failed to add product");
            }
        } catch (err) {
            toast.error("Network error");
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
                <DialogHeader>
                    <DialogTitle>Add New Product</DialogTitle>
                    <DialogDescription>
                        Select brand and details
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4"
                    >
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
                                                <SelectValue
                                                    placeholder={
                                                        loading
                                                            ? "Loading..."
                                                            : "Select product brand"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {loading ? (
                                                <div className="p-8 text-center text-muted-foreground">
                                                    Loading options...
                                                </div>
                                            ) : productBrands.length === 0 ? (
                                                <div className="p-8 text-center text-muted-foreground">
                                                    No product brands available
                                                </div>
                                            ) : (
                                                productBrands.map(
                                                    (productBrand) => (
                                                        <SelectItem
                                                            key={
                                                                productBrand.id
                                                            }
                                                            value={productBrand.id.toString()}
                                                        >
                                                            {productBrand.brand}
                                                        </SelectItem>
                                                    )
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={control}
                            id="type"
                            name="type"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Type
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. Whitening"
                                            className={` text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                                fieldState.error
                                                    ? "border-rose-500"
                                                    : ""
                                            }`}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        id="typeMessage"
                                        className="font-medium"
                                    >
                                        {fieldState.error?.message}
                                    </FormMessage>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
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
                                                <SelectValue
                                                    placeholder={
                                                        loading
                                                            ? "Loading..."
                                                            : "Select product name"
                                                    }
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {loading ? (
                                                <div className="p-8 text-center text-muted-foreground">
                                                    Loading options...
                                                </div>
                                            ) : productNames.length === 0 ? (
                                                <div className="p-8 text-center text-muted-foreground">
                                                    No product names available
                                                </div>
                                            ) : (
                                                productNames.map(
                                                    (productName) => (
                                                        <SelectItem
                                                            key={productName.id}
                                                            value={productName.id.toString()}
                                                        >
                                                            {
                                                                productName.product_name
                                                            }
                                                        </SelectItem>
                                                    )
                                                )
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
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
