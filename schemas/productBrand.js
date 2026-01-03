import { z } from "zod";

export const productBrandSchema = z.object({
    brand: z.string().min(1, "Product brand cannot be empty").max(100),
    brand_status: z.enum(["active", "inactive", "deleted"]),
    note: z.string().max(500).optional(),
});
