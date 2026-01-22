import { supabase } from "@/lib/supabase/client";

export async function getQuantityHistoryByProductId(productListId) {
    const { data, error } = await supabase
        .from("product_quantity_history")
        .select("*")
        .eq("product_list_id", Number(productListId))
        .order("purchase_date", { ascending: false })
        .limit(10);

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data || [];
}
