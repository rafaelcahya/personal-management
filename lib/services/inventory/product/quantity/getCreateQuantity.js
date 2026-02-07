import { createClient } from "@/lib/supabase/client";

export async function createQuantityUpdate(payload) {
    const { product_list_id, quantity_added, price, purchase_date, note } =
        payload;

    const { data: productExists, error: checkError } = await supabase
        .from("product_list")
        .select("product_list_id, quantity")
        .eq("product_list_id", product_list_id)
        .single();

    if (checkError || !productExists) {
        throw new Error(`Product with ID ${product_list_id} not found`);
    }

    const { data: historyData, error: historyError } = await supabase
        .from("product_quantity_history")
        .insert({
            product_list_id: Number(product_list_id),
            quantity_added,
            price,
            purchase_date,
            note: note || "",
        })
        .select()
        .single();

    if (historyError) {
        throw new Error(historyError.message);
    }

    const currentQuantity = Number(productExists.quantity) || 0;
    const newQuantity = currentQuantity + quantity_added;

    const { data: updatedProduct, error: updateError } = await supabase
        .from("product_list")
        .update({
            quantity: String(newQuantity),
            updated_at: new Date().toISOString(),
        })
        .eq("product_list_id", product_list_id)
        .select()
        .single();

    if (updateError) {
        throw new Error(updateError.message);
    }

    return {
        history: historyData,
        product: updatedProduct,
    };
}
