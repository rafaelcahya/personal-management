import { createClient } from "@/lib/supabase/server";

export async function deleteProduct(userId, productId) {
    const supabase = await createClient();

    const { data: existing, error: fetchError } = await supabase
        .from("product_list")
        .select("id")
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
            product_status: "deleted",
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", productId)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        console.error("Delete product error:", error);
        throw new Error(error.message);
    }

    return data;
}
