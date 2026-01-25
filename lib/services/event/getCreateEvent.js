import { supabase } from "@/lib/supabase/client";

export async function getCreateEvent(
    event_description,
    impact_direction,
    event_date,
) {
    const { data, error } = await supabase
        .from("event_list")
        .insert([
            {
                event_date: event_date,
                event_description: event_description,
                impact_direction: impact_direction,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
