import { supabase } from "@/lib/supabase/client";

export async function getUpdateProductName(id, values) {
    const { product_name, product_name_status, note } = values;

    const { data, error } = await supabase
        .from("product_name")
        .update({
            updated_at: new Date().toISOString(),
            product_name,
            product_name_status,
            note,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
