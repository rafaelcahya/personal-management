import { createClient } from "@/lib/supabase/server";

export async function favoriteProduct(userId, productId, isFavorite) {
    const supabase = await createClient();
    
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

    if (!data) {
        throw new Error("Product not found or unauthorized");
    }

    return data;
}
