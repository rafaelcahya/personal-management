import { createClient } from "@/lib/supabase/server";

export async function getProductHistoryList(userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("product_history")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Get product history error:", error);
        throw new Error(error.message);
    }

    return data;
}
