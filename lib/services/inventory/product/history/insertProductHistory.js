import { supabase } from "@/lib/supabase/client";

export async function insertProductHistory(productData) {
    const historyData = {
        uuid: productData.uuid,
        product: productData.product,
        brand: productData.brand,
        type: productData.type,
        quantity: productData.usage_quantity,
        usage_date: productData.usage_date,
        status: productData.product_status,
        note: productData.note,
        product_image: productData.product_image,
        product_list_id: productData.product_list_id,
    };

    const { data, error } = await supabase
        .from("product_history")
        .insert(historyData)
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
