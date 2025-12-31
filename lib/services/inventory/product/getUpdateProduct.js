import { supabase } from "@/lib/supabase/client";

export async function getUpdateProduct(id, values) {
    const {
        product,
        brand,
        type,
        product_status,
        quantity,
        on_hand_quantity,
        note,
        product_image,
    } = values;

    const { data, error } = await supabase
        .from("product_list")
        .update({
            updated_at: new Date().toISOString(),
            product,
            brand,
            type,
            quantity: Number(quantity),
            on_hand_quantity: Number(on_hand_quantity),
            product_status,
            note,
            product_image,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
