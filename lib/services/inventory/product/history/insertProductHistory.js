import { supabaseAdmin } from "@/lib/supabase/admin";

export async function insertProductHistory(product) {
    const usageQty = Number(product.usage_quantity);

    if (isNaN(usageQty) || usageQty <= 0) {
        throw new Error(`Invalid usage_quantity: ${product.usage_quantity}`);
    }

    const historyData = {
        product_list_id: product.id,
        quantity: String(usageQty),
        remaining_quantity: String(usageQty),
        depleted_quantity: "0",
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
