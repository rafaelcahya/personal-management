import { createAdminClient } from "@/lib/supabase/admin";

export async function insertProductHistory(product) {
    const supabaseAdmin = createAdminClient();

    const depletedQty = Number(product.depleted_quantity);

    if (isNaN(depletedQty) || depletedQty < 0) {
        throw new Error(
            `Invalid depleted_quantity: ${product.depleted_quantity}`,
        );
    }

    const quantityBefore = Number(product.quantity);
    const remainingQty = Number(product.remaining_quantity);

    if (quantityBefore !== depletedQty + remainingQty) {
        throw new Error(
            `Quantity mismatch: ${quantityBefore} !== ${depletedQty} + ${remainingQty}`,
        );
    }

    const historyData = {
        product_list_id: product.id,
        quantity: quantityBefore,
        depleted_quantity: depletedQty,
        remaining_quantity: remainingQty,
        start_usage_date: product.usage_date || new Date().toISOString(),
        status: product.product_status || "active",
        note: product.note || null,
        user_id: product.user_id,
        product: product.product,
        type: product.type || null,
        brand: product.brand || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
        .from("product_history")
        .insert([historyData])
        .select()
        .single();

    if (error) {
        console.error("Insert error:", error);
        throw new Error(`Failed to insert history: ${error.message}`);
    }

    return data;
}
