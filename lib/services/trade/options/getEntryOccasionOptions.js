import { createClient } from "@/lib/supabase/server";

export async function getEntryOccasionOptions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("entry_occasion_option")
        .select("*")
        .order("entry_occasion_option", { ascending: true });

    if (error) {
        console.error("Failed to fetch entry occasion options:", error);
        throw new Error(error.message);
    }

    return data || [];
}
