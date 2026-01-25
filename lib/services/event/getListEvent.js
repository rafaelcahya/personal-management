import { supabase } from "@/lib/supabase/client";

export async function getListEvent() {
    const { data, error } = await supabase
        .from("event_list")
        .select("*")
        .order("event_date", { ascending: false });

    if (error) {
        throw new Error(error.message);
    }

    return data;
}
