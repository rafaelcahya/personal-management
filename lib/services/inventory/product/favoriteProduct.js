import { createClient } from "@/lib/supabase/server";

export async function favoriteProduct(userId, productId, isFavorite) {
    const supabase = await createClient();

    const { data: existing, error: fetchError } = await supabase
        .from("product_list")
        .select("id, is_favorite")
        .eq("id", productId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (fetchError || !existing) {
        throw new Error("Product not found or unauthorized");
    }

    const { data, error } = await supabase
        .from("product_list")
        .update({
            is_favorite: isFavorite,
            updated_at: new Date().toISOString(),
        })
        .eq("id", productId)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        console.error("Favorite product error:", error);
        throw new Error(error.message);
    }

    return data;
}
