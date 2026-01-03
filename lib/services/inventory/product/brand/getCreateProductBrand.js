import { supabase } from "@/lib/supabase/client";

export async function getCreateProductBrand(
    brand,
    note,
    brand_status,
    deleted_at = null
) {
    const insertData = {
        brand: brand,
        note: note,
        brand_status: brand_status || "active",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    if (brand_status === "deleted") {
        insertData.deleted_at = deleted_at || new Date().toISOString();
    }

    const { data, error } = await supabase
        .from("product_brand")
        .insert(insertData)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
