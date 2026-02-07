import { createClient } from "@/lib/supabase/server";

export async function updateProductName(id, payload, userId) {
    const supabase = await createClient();

    const updateData = {
        product_name: payload.product_name,
        product_name_status: payload.product_name_status,
        note: payload.note,
        updated_at: new Date().toISOString(),
    };

    if (payload.product_name_status === "deleted") {
        updateData.deleted_at = payload.deleted_at || new Date().toISOString();
    }

    const { data, error } = await supabase
        .from("product_name")
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
