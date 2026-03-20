import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function createProductName(
    user_id,
    product_name,
    product_name_status,
    note,
    deleted_at = null,
) {
    const supabaseAdmin = getSupabaseAdmin();
    const insertData = {
        user_id: user_id,
        product_name: product_name,
        product_name_status: product_name_status || "active",
        note: note,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    if (product_name_status === "deleted") {
        insertData.deleted_at = deleted_at || new Date().toISOString();
    }

    const { data, error } = await supabaseAdmin
        .from("product_name")
        .insert(insertData)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
