import { z } from "zod";

export const feeSchema = z.object({
    fee_name: z
        .string()
        .min(3, "Fee name must be at least 3 characters")
        .max(100, "Fee name must not exceed 100 characters"),
    fee: z
        .string()
        .min(1, "Fee amount is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Fee must be a positive number",
        }),
    fee_date: z.date({
        required_error: "Please select a fee date",
    }),
});
