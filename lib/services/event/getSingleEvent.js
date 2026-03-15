import { createClient } from "@/lib/supabase/server";

const TABLE_NAME = "event_list";

export async function getSingleEvent(userId, eventId) {
    if (!userId) throw new Error("User ID is required");
    if (!eventId) throw new Error("Event ID is required");

    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", eventId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            console.log(`Event ${eventId} not found for user ${userId}`);
            return null;
        }
        throw new Error(
            `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`,
        );
    }

    return data;
}
