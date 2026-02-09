import { createClient } from "@/lib/supabase/client";

export async function fetchEventList() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("event_list")
        .select("*")
        .is("deleted_at", null)
        .order("event_date", { ascending: false });

    if (error) {
        console.error("Fetch events error:", error);
        throw new Error(error.message);
    }

    return data || [];
}

export async function createEvent(payload) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
        .from("event_list")
        .insert([{ ...payload, user_id: user.id }])
        .select()
        .single();

    if (error) {
        console.error("Create event error:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function updateEvent(id, payload) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("event_list")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Update event error:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function deleteEvent(id) {
    const supabase = createClient();

    const { error } = await supabase
        .from("event_list")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

    if (error) {
        console.error("Delete event error:", error);
        throw new Error(error.message);
    }

    return { success: true };
}

export async function favoriteEvent(id, isFavorite) {
    const supabase = createClient();

    const { error } = await supabase
        .from("event_list")
        .update({ is_favorite: isFavorite })
        .eq("id", id);

    if (error) {
        console.error("Favorite event error:", error);
        throw new Error(error.message);
    }

    return { success: true };
}
