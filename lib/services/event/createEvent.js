import { createClient } from "@/lib/supabase/server";

export async function createEvent(userId, eventData) {
    const supabase = await createClient();

    const insertData = {
        user_id: userId,
        event_description: eventData.event_description,
        impact_direction: eventData.impact_direction,
        event_date: eventData.event_date,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("event_list")
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error("Failed to create event:", error);
        throw new Error(error.message);
    }

    return data;
}
