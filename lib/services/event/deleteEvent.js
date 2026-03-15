import { createClient } from "@/lib/supabase/server";

export async function deleteEvent(userId, eventId) {
    if (!userId) {
        throw new Error("User ID is required");
    }
    if (!eventId) {
        throw new Error("Event ID is required");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("event_list")
        .update({
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", eventId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .select()

    if (error) {
        console.error("Failed to soft delete event:", error);
        throw new Error(error.message || "Failed to delete event");
    }

    if (!data) {
        throw new Error("Event not found or already deleted");
    }

    return data;
}
