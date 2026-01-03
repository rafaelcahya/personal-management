import { z } from "zod";

export const productSchema = z.object({
    image: z
        .any()
        .optional()
        .refine(
            (val) => !val || (val && val.size < 5 * 1024 * 1024), // < 5MB
            { message: "Max 5MB" }
        ),
    product_brand: z.string().min(1, "Please select a product brand"),
    type: z.string().min(1, "Please select a type"),
    product_name: z.string().min(1, "Product name cannot be empty"),
    product_status: z.literal("active").default("active"),
    notes: z.string(),
});
