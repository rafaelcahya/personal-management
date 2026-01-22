import { z } from "zod";

export const productSchema = z.object({
    image: z.any().optional(),
    product_brand: z.string().min(1, "Please select a product brand"),
    type: z.string().min(1, "Type is required"),
    product_name: z.string().min(1, "Please select a product name"),
    notes: z.string().optional(),
    product_status: z.literal("active").default("active"),
});

export const stockAdjustmentSchema = z.object({
    usage_quantity: z.number().min(0, "Quantity must be 0 or more"),
    usage_date: z.date({ required_error: "Date is required" }),
    note: z.string().optional(),
});
