import { createClient } from "@/lib/supabase/server";

export async function createQuantityUpdate(userId, payload) {
    const supabase = await createClient();

    const { data: product, error: productError } = await supabase
        .from("product_list")
        .select("id, quantity")
        .eq("id", payload.product_list_id)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (productError || !product) {
        throw new Error("Product not found");
    }

    const productListId = parseInt(payload.product_list_id);
    const quantityToAdd = parseInt(payload.quantity_added);
    const price = parseFloat(payload.price);

    const currentQuantity = Number(product.quantity);
    const newQuantity = currentQuantity + quantityToAdd;

    const insertData = {
        user_id: userId,
        product_list_id: productListId,
        quantity_added: quantityToAdd,
        price: price,
        purchase_date: payload.purchase_date,
        note: payload.note || null,
        created_at: new Date().toISOString(),
    };

    const { data: quantityUpdate, error: insertError } = await supabase
        .from("product_quantity")
        .insert(insertData)
        .select()
        .single();

    if (insertError) {
        throw new Error(`Failed to insert: ${insertError.message}`);
    }

    const { error: updateError } = await supabase
        .from("product_list")
        .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
        })
        .eq("id", productListId)
        .eq("user_id", userId);

    if (updateError) {
        await supabase
            .from("product_quantity")
            .delete()
            .eq("id", quantityUpdate.id);

        throw new Error(`Failed to update quantity: ${updateError.message}`);
    }

    return quantityUpdate;
}
