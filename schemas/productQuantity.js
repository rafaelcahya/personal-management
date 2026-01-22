import { z } from "zod";

export const quantityUpdateSchema = z.object({
    quantity_added: z
        .number()
        .positive("Quantity must be greater than 0")
        .int("Quantity must be a whole number"),
    price: z
        .number()
        .nonnegative("Price cannot be negative")
        .multipleOf(0.01, "Price must have at most 2 decimal places"),
    purchase_date: z.date({
        required_error: "Purchase date is required",
    }),
    note: z.string().optional(),
});
