import { z } from "zod";

export const productNameSchema = z.object({
    product_name: z.string().min(1, "Product name cannot be empty").max(100),
    product_name_status: z.enum(["active", "inactive", "deleted"]),
    note: z.string().max(500).optional(),
});
