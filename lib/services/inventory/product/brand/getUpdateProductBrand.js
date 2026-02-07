import { createClient } from "@/lib/supabase/client";

export async function getUpdateProductBrand(id, values) {
    const { brand, note, brand_status, deleted_at = null } = values;

    const updateData = {
        updated_at: new Date().toISOString(),
        brand,
        note,
        brand_status,
    };

    if (brand_status === "deleted") {
        updateData.deleted_at = deleted_at || new Date().toISOString();
    } else {
        updateData.deleted_at = null;
    }

    const { data, error } = await supabase
        .from("product_brand")
        .update(updateData)
        .eq("id", Number(id))
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
