import { supabase } from "@/lib/supabase/client";
import { insertProductHistory } from "./history/insertProductHistory";

export async function getUpdateProduct(id, payload) {
    const { usage_quantity, product_status, usage_date, note } = payload;

    if (!payload) {
        throw new Error("Payload is required");
    }

    const updateData = {
        updated_at: new Date().toISOString(),
        usage_quantity,
        product_status,
        usage_date,
        note,
    };

    if (payload.usage_date) {
        updateData.usage_date = payload.usage_date;
    }

    const { data: updatedProduct, error: updateError } = await supabase
        .from("product_list")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (updateError) throw new Error(updateError.message);

    try {
        await insertProductHistory(updatedProduct);
    } catch (historyError) {
        console.error("Failed to insert history:", historyError);
    }

    return updatedProduct;
}
