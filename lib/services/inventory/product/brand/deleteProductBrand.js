import { createClient } from "@/lib/supabase/server";

export async function deleteProductBrand(id, userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("product_brand")
        .update({
            brand_status: "deleted",
            deleted_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("user_id", userId)
        .select();

    if (error) {
        throw new Error(error.message);
    }

    if (!data || data.length === 0) {
        throw new Error("Product brand not found or unauthorized");
    }

    return data[0];
}
