"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { productBrandSchema } from "@/schemas/productBrand";
import { addProductBrand } from "@/lib/api/productBrand";

export default function AddProduct({ onAdded }) {
    const [open, setOpen] = useState(false);
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

    const handleAddNewProductBrand = async (values) => {
        setLoading(true);
        try {
            await addProductBrand(values);
            toast.success("New product brand added successfully!");
            setOpen(false);
            onAdded?.();
            reset();
        } catch (err) {
            toast.error(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild id="addNewProductBrandBtn">
                <Button>Add New Product Brand</Button>
            </DialogTrigger>
            <DialogContent
                className="sm:max-w-md"
                id="addNewProductBrandDialogForm"
            >
                <DialogHeader>
                    <DialogTitle>Add New Product Brand</DialogTitle>
                    <DialogDescription>
                        Create a new product brand to organize your inventory —
                        keep stock levels accurate and operations smooth.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={handleSubmit(handleAddNewProductBrand)}
                        className="space-y-4"
                    >
                        <FormField
                            control={control}
                            name="brand"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel className="font-medium">
                                        Product brand
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            placeholder="e.g. Clear"
                                            id="brandField"
                                            className={`text-sm font-medium focus-visible:ring-violet-200 focus-visible:border-violet-600 selection:bg-violet-500 ${
                                                fieldState.error
                                                    ? "border-rose-500"
                                                    : ""
                                            }`}
                                        />
                                    </FormControl>
                                    <FormMessage
                                        id="productBrandMessage"
                                        className="font-medium"
                                    >
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
                                            placeholder="Additional notes"
                                            id="noteField"
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
                                    id="cancelNewProductBrandBtn"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={loading}
                                id="submitNewProductBrandBtn"
                            >
                                {loading && (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                )}
                                {loading ? "Adding..." : "Add Product Brand"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
