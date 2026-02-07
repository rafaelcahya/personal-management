import { createClient } from "@/lib/supabase/client";

export async function getDeleteEvent(id) {
    try {
        const { data, error } = await supabase
            .from("event_list")
            .delete()
            .eq("id", Number(id))
            .select();

        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        throw new Error("Failed to delete event: " + err.message);
    }
}
