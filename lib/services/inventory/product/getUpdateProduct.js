import { supabaseAdmin } from "@/lib/supabase/admin";
import { insertProductHistory } from "./history/insertProductHistory";

export async function getUpdateProduct(id, payload) {
    const { usage_quantity, product_status, usage_date, note } = payload;

    if (!payload) {
        throw new Error("Payload is required");
    }

    // Fetch current product with user_id
    const { data: currentProduct, error: fetchError } = await supabaseAdmin
        .from("product_list")
        .select("quantity, usage_quantity, user_id, product, type, brand")
        .eq("id", id)
        .single();

    if (fetchError) {
        throw new Error(`Failed to fetch product: ${fetchError.message}`);
    }

    // Calculate new quantities
    const currentOnHand = Number(currentProduct.quantity);
    const currentInUse = Number(currentProduct.usage_quantity) || 0;
    const usageQtyToAdd = Number(usage_quantity);

    const newOnHand = currentOnHand - usageQtyToAdd;
    const newInUse = currentInUse + usageQtyToAdd;

    // Validate enough stock
    if (newOnHand < 0) {
        throw new Error(
            `Insufficient stock. Available: ${currentOnHand}, Requested: ${usageQtyToAdd}`,
        );
    }

    // Prepare update data
    const updateData = {
        quantity: String(newOnHand),
        usage_quantity: String(newInUse),
        product_status,
        note,
        updated_at: new Date().toISOString(),
    };

    if (usage_date) {
        updateData.usage_date = usage_date;
    }

    // Update product
    const { data: updatedProduct, error: updateError } = await supabaseAdmin
        .from("product_list")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (updateError) {
        throw new Error(updateError.message);
    }

    // Insert history - IMPORTANT: use usageQtyToAdd, not updatedProduct.usage_quantity
    try {
        const historyPayload = {
            id: updatedProduct.id,
            usage_quantity: String(usageQtyToAdd),
            usage_date: usage_date || new Date().toISOString(),
            product_status,
            note,
            user_id: currentProduct.user_id,
            product: currentProduct.product,
            type: currentProduct.type,
            brand: currentProduct.brand,
        };

        await insertProductHistory(historyPayload);
    } catch (historyError) {
        throw new Error(`${historyError.message}`);
    }

    return updatedProduct;
}
