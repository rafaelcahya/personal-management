import { supabase } from "@/lib/supabase/client";

export async function getUpdateEvent(id, values) {
    const { event_description, impact_direction, event_date } = values;

    const { data, error } = await supabase
        .from("event_list")
        .update({
            updated_at: new Date().toISOString(),
            event_description,
            impact_direction,
            event_date,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
