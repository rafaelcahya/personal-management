import { createClient } from "@/lib/supabase/server";

export async function createQuantityUpdate(userId, payload) {
    const supabase = await createClient();

    // Verify product exists and belongs to user
    const { data: product, error: productError } = await supabase
        .from("product_list")
        .select("id, quantity")
        .eq("id", payload.product_list_id)
        .eq("user_id", userId)
        .single();

    if (productError) {
        console.error("Product fetch error:", productError);
        throw new Error(`Product not found: ${productError.message}`);
    }

    if (!product) {
        throw new Error("Product not found or unauthorized");
    }

    // Prepare insert data
    const insertData = {
        user_id: userId,
        product_list_id: parseInt(payload.product_list_id),
        quantity_added: parseInt(payload.quantity_added),
        price: parseFloat(payload.price),
        purchase_date: payload.purchase_date,
        note: payload.note || "",
        created_at: new Date().toISOString(),
    };

    // Insert quantity update record
    const { data: quantityUpdate, error: insertError } = await supabase
        .from("product_quantity")
        .insert(insertData)
        .select()
        .single();

    if (insertError) {
        console.error("Insert quantity update error:", insertError);
        throw new Error(`Failed to insert: ${insertError.message}`);
    }

    // Update product_list quantity
    const newQuantity = product.quantity + parseInt(payload.quantity_added);

    const { error: updateError } = await supabase
        .from("product_list")
        .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
        })
        .eq("id", payload.product_list_id)
        .eq("user_id", userId);

    if (updateError) {
        console.error("Update product quantity error:", updateError);
        throw new Error(`Failed to update quantity: ${updateError.message}`);
    }

    return quantityUpdate;
}
