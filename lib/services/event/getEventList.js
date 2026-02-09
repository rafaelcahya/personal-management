import { createClient } from "@/lib/supabase/server";

export async function getEventList(userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("event_list")
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("event_date", { ascending: false });

    if (error) {
        console.error("Failed to fetch events:", error);
        throw new Error(error.message);
    }

    return data || [];
}
