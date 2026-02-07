import { createClient } from "@/lib/supabase/server";

export async function deleteProduct(userId, productId) {
    const supabase = await createClient();

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

    if (!data) {
        throw new Error("Product not found or unauthorized");
    }

    return data;
}
