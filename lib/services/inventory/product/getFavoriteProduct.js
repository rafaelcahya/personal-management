import { createClient } from "@/lib/supabase/client";

export async function getFavoriteProduct(productId, payload) {
    const { data, error } = await supabase
        .from("product_list")
        .update(payload)
        .eq("id", productId)
        .select()
        .single();

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data;
}
