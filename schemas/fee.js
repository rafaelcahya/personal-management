import { z } from "zod";

export const feeSchema = z.object({
    fee_date: z.date({ required_error: "Fee Date is required" }),
    fee: z.string().min(1, "Fee cannot be empty"),
    fee_name: z.string().min(1, "Fee Name cannot be empty"),
});
