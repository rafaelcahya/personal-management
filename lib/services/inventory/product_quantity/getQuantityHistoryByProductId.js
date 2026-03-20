import { createClient } from "@/lib/supabase/server";

export async function getQuantityHistoryByProductId(userId, productListId) {
    const supabase = await createClient();

    const { data: product, error: productError } = await supabase
        .from("product_list")
        .select("id")
        .eq("id", productListId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (productError || !product) {
        throw new Error("Product not found");
    }

    const { data, error } = await supabase
        .from("product_quantity")
        .select("*")
        .eq("product_list_id", productListId)
        .eq("user_id", userId)
        .order("purchase_date", { ascending: false });

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data || [];
}
