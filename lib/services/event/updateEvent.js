import { createClient } from "@/lib/supabase/server";

export async function updateEvent(userId, eventId, eventData) {
    const supabase = await createClient();

    const updateData = {
        ...eventData,
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("event_list")
        .update(updateData)
        .eq("id", eventId)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        console.error("Failed to update event:", error);
        throw new Error(error.message);
    }

    return data;
}
