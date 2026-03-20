import { createClient } from "@/lib/supabase/server";

export async function updateProductBrand(id, payload, userId) {
    const supabase = await createClient();

    const updateData = {
        updated_at: new Date().toISOString(),
        brand: payload.brand,
        note: payload.note,
        brand_status: payload.brand_status,
    };

    if (payload.brand_status === "deleted") {
        updateData.deleted_at = payload.deleted_at || new Date().toISOString();
    }

    const { data, error } = await supabase
        .from("product_brand")
        .update(updateData)
        .eq("id", id)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        console.error("Update error:", error);
        throw new Error(error.message);
    }
    
    return data;
}
