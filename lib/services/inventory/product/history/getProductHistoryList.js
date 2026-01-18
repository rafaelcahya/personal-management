import { supabase } from "@/lib/supabase/client";

export async function getProductHistoryList() {
    const { data, error } = await supabase
        .from("product_history")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data;
}
