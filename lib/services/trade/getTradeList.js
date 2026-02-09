import { createClient } from "@/lib/supabase/server";

export async function getTradeList(userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("trade_list")
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("trade_date", { ascending: false });

    if (error) {
        console.error("Failed to fetch trades:", error);
        throw new Error(error.message);
    }

    return data || [];
}
