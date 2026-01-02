import { supabase } from "@/lib/supabase/client";

export async function getCreateProductName(
    product_name,
    product_name_status,
    note
) {
    const { data, error } = await supabase
        .from("product_name")
        .insert([
            {
                product_name,
                product_name_status,
                note,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
