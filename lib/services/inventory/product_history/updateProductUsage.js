import { getSupabaseAdmin } from "@/lib/supabase/admin";

export async function updateProductUsage(historyId, data) {
    const supabaseAdmin = getSupabaseAdmin();
    const { depleted_quantity, end_usage_date } = data;

    const { data: currentHistory, error: fetchError } = await supabaseAdmin
        .from("product_history")
        .select(
            "quantity, status, product_list_id, depleted_quantity, remaining_quantity",
        )
        .eq("id", historyId)
        .single();

    if (fetchError) {
        throw new Error(
            `Failed to fetch history record: ${fetchError.message}`,
        );
    }

    const newDepletedQty = Number(depleted_quantity);
    const originalQty = Number(currentHistory.quantity);
    const previousDepletedQty = Number(currentHistory.depleted_quantity || 0);
    const previousRemainingQty = Number(
        currentHistory.remaining_quantity || originalQty,
    );

    if (isNaN(newDepletedQty) || isNaN(originalQty)) {
        throw new Error("Invalid quantity values");
    }

    if (newDepletedQty > previousRemainingQty) {
        throw new Error(
            `Depleted quantity (${newDepletedQty}) cannot exceed original quantity (${originalQty})`,
        );
    }

    const newRemainingQty = originalQty - newDepletedQty;

    const depletedDelta = newDepletedQty - previousDepletedQty;

    const newStatus = newRemainingQty === 0 ? "inactive" : "active";

    const { data: updatedHistory, error: updateError } = await supabaseAdmin
        .from("product_history")
        .update({
            depleted_quantity: String(newDepletedQty),
            remaining_quantity: String(newRemainingQty),
            end_usage_date:
                end_usage_date ||
                (newRemainingQty === 0 ? new Date().toISOString() : null),
            status: newStatus,
            updated_at: new Date().toISOString(),
        })
        .eq("id", historyId)
        .select()
        .single();

    if (updateError) {
        throw new Error(`Failed to update history: ${updateError.message}`);
    }

    const { data: currentProduct, error: productFetchError } =
        await supabaseAdmin
            .from("product_list")
            .select("id, quantity, usage_quantity, product_status")
            .eq("id", currentHistory.product_list_id)
            .single();

    if (productFetchError) {
        throw new Error(
            `Failed to fetch product: ${productFetchError.message}`,
        );
    }

    if (depletedDelta !== 0) {
        const currentUsageQty = Number(currentProduct.usage_quantity);
        const newUsageQty = Math.max(0, currentUsageQty - depletedDelta);

        const productStatus = newUsageQty > 0 ? "active" : "inactive";

        const { data: updatedProduct, error: productUpdateError } =
            await supabaseAdmin
                .from("product_list")
                .update({
                    usage_quantity: String(newUsageQty),
                    product_status: productStatus,
                    updated_at: new Date().toISOString(),
                })
                .eq("id", currentHistory.product_list_id)
                .select()
                .single();

        if (productUpdateError) {
            throw new Error(
                `Failed to update product: ${productUpdateError.message}`,
            );
        }

        return {
            history: updatedHistory,
            product: updatedProduct,
        };
    }

    return {
        history: updatedHistory,
        product: currentProduct,
    };
}
