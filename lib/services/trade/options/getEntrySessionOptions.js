import { createClient } from "@/lib/supabase/server";

export async function getEntrySessionOptions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("entry_session_option")
        .select("*")
        .order("entry_session_option", { ascending: true });

    if (error) {
        console.error("Failed to fetch entry session options:", error);
        throw new Error(error.message);
    }

    return data || [];
}
