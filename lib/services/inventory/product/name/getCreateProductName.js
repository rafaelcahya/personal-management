import { supabase } from "@/lib/supabase/client";

export async function getCreateProductName(
    product_name,
    product_name_status,
    note,
    deleted_at = null
) {
    const insertData = {
        product_name: product_name,
        product_name_status: product_name_status || "active",
        note: note,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    if (product_name_status === "deleted") {
        insertData.deleted_at = deleted_at || new Date().toISOString();
    }

    const { data, error } = await supabase
        .from("product_name")
        .insert(insertData)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
