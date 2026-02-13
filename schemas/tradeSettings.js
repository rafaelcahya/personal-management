import { z } from "zod";

export const tradeSettingsSchema = z.object({
    initial_margin: z
        .string()
        .min(1, "Initial margin is required")
        .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
            message: "Initial margin must be a positive number",
        }),
    bi_risk_free_rate: z
        .string()
        .min(1, "BI risk free rate is required")
        .refine(
            (val) =>
                !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
            {
                message: "BI risk free rate must be between 0 and 100",
            },
        ),
    personal_risk_free_rate: z
        .string()
        .min(1, "Personal risk free rate is required")
        .refine(
            (val) =>
                !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
            {
                message: "Personal risk free rate must be between 0 and 100",
            },
        ),
    margin_of_error: z
        .string()
        .min(1, "Margin of error is required")
        .refine(
            (val) =>
                !isNaN(Number(val)) && Number(val) >= 0 && Number(val) <= 100,
            {
                message: "Margin of error must be between 0 and 100",
            },
        ),
});
