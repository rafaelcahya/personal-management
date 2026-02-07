import { createClient } from "@/lib/supabase/client";

export async function getListSettings() {
    const { data, error } = await supabase
        .from("settings")
        .select("*")
        .order("id", { ascending: false })
        .limit(1)
        .single();

    if (error) throw new Error(error.message);

    return data;
}
