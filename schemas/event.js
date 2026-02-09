import { z } from "zod";

export const eventSchema = z.object({
    event_description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must not exceed 500 characters"),
    impact_direction: z.enum(["UP", "DOWN"], {
        required_error: "Please select an impact direction",
    }),
    event_date: z.date({
        required_error: "Please select an event date",
    }),
});
