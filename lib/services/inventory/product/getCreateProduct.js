import { supabase } from "../../../supabase/client";

export async function getCreateProduct(
    product,
    brand,
    type,
    product_status,
    quantity,
    on_hand_quantity,
    note,
    product_image
) {
    const { data, error } = await supabase
        .from("product_list")
        .insert([
            {
                product: product,
                brand: brand,
                type: type,
                product_status: product_status,
                quantity: Number(quantity),
                on_hand_quantity: Number(on_hand_quantity),
                note: note,
                product_image: product_image,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
