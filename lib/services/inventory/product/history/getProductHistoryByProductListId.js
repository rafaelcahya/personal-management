import { supabase } from "@/lib/supabase/client";

export async function getProductHistoryByProductListId(productListId) {
    const { data, error } = await supabase
        .from("product_history")
        .select("*")
        .eq("product_list_id", Number(productListId))
        .order("usage_date", { ascending: false })
        .limit(5);

    if (error) throw new Error(error.message);

    return data || [];
}
