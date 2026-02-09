import { createClient } from "@/lib/supabase/server";

export async function getFeeList(userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("fee_list")
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("fee_date", { ascending: false });

    if (error) {
        console.error("Failed to fetch fees:", error);
        throw new Error(error.message);
    }

    return data || [];
}
