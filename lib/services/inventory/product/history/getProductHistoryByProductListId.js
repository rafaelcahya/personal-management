import { supabaseAdmin } from "@/lib/supabase/admin";

export async function getProductHistoryByProductListId(productId) {
    const { data, error } = await supabaseAdmin
        .from("product_history")
        .select("*")
        .eq("product_list_id", Number(productId))
        .order("start_usage_date", { ascending: false })
        .limit(5);

    if (error) {
        console.error("Query error:", error);
        throw new Error(error.message);
    }

    return data || [];
}
