import { z } from "zod";

export const eventSchema = z.object({
    event_description: z.string().min(1, "Event description cannot be empty"),
    impact_direction: z.string().min(1, "Impact description cannot be empty"),
    event_date: z.date({ required_error: "Event date is required" }),
});
