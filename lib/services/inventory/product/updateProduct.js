import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { insertProductHistory } from "../product_history/insertProductHistory";

export async function updateProduct(userId, id, payload) {
    if (!payload) throw new Error("Payload is required");

    const supabaseAdmin = getSupabaseAdmin();
    const { usage_quantity, product_status, usage_date, note } = payload;

    const { data: currentProduct, error: fetchError } = await supabaseAdmin
        .from("product_list")
        .select("quantity, usage_quantity, user_id, product, type, brand")
        .eq("id", id)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (fetchError || !currentProduct) {
        throw new Error("Product not found");
    }

    const currentOnHand = Number(currentProduct.quantity);
    const currentInUse = Number(currentProduct.usage_quantity) || 0;
    const usageQtyToAdd = Number(usage_quantity);

    const newOnHand = currentOnHand - usageQtyToAdd;
    const newInUse = currentInUse + usageQtyToAdd;

    if (newOnHand < 0) {
        throw new Error(
            `Insufficient stock. Available: ${currentOnHand}, Requested: ${usageQtyToAdd}`,
        );
    }

    const updateData = {
        quantity: newOnHand,
        usage_quantity: newInUse,
        product_status,
        note,
        updated_at: new Date().toISOString(),
    };

    if (usage_date) {
        updateData.usage_date = usage_date;
    }

    const { data: updatedProduct, error: updateError } = await supabaseAdmin
        .from("product_list")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (updateError) throw new Error(updateError.message);

    try {
        const historyPayload = {
            id: updatedProduct.id,
            product_list_id: updatedProduct.product_list_id,
            usage_date: usage_date || new Date().toISOString(),
            product_status,
            note,
            user_id: currentProduct.user_id,
            product: currentProduct.product,
            type: currentProduct.type,
            brand: currentProduct.brand,
            quantity: usageQtyToAdd,
            usage_quantity: usageQtyToAdd,
            depleted_quantity: 0,
            remaining_quantity: usageQtyToAdd,
        };

        await insertProductHistory(historyPayload);
    } catch (historyError) {
        throw new Error(historyError.message);
    }

    return updatedProduct;
}
