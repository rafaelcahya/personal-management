import { z } from "zod";

export const productSchema = z.object({
    image: z.any().optional(),
    product_brand: z.string().min(1, "Please select a product brand"),
    type: z.string().min(1, "Type is required"),
    product_name: z.string().min(1, "Please select a product name"),
    note: z.string().optional(),
    product_status: z.literal("active").default("active"),
});