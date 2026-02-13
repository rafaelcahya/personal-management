import { createClient } from "@/lib/supabase/server";

export async function favoriteEvent(userId, eventId, isFavorite) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("event_list")
        .update({
            is_favorite: isFavorite,
            updated_at: new Date().toISOString(),
        })
        .eq("id", eventId)
        .eq("user_id", userId);

    if (error) {
        console.error("Failed to favorite event:", error);
        throw new Error(error.message);
    }

    return { success: true };
}
