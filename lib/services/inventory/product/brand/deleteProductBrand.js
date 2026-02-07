import { createClient } from "@/lib/supabase/client";

export async function deleteProductBrand(id, userId) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("product_brand")
        .update({
            brand_status: "deleted",
            deleted_at: new Date().toISOString(),
        })
        .eq("id", Number(id))
        .eq("user_id", userId)
        .select();

    if (error) {
        console.error("Delete error:", error);
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("Product brand not found or unauthorized");
    }

    return data;
}
