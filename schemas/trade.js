import { z } from "zod";

export const tradeSchema = z.object({
    trade_date: z.date({
        required_error: "Please select a trade date",
    }),
    ticker: z
        .string()
        .min(1, "Ticker is required")
        .max(10, "Ticker must not exceed 10 characters")
        .transform((val) => val.toUpperCase()),
    margin: z
        .string()
        .min(1, "Margin is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Margin must be a positive number",
        }),
    proceeds: z
        .string()
        .min(1, "Proceeds is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
            message: "Proceeds must be a positive number",
        }),
    return_percent: z.string().optional(),
    realized_gain: z.string().optional(),
    stock_type_option: z.string().min(1, "Stock type is required"),
    entry_session_option: z.string().min(1, "Entry session is required"),
    entry_occasion_option: z.string().min(1, "Entry occasion is required"),
    buy_reason_option: z.string().min(1, "Buy reason is required"),
    sell_reason_option: z.string().min(1, "Sell reason is required"),
    notes: z.string().optional(),
});
