import { createClient } from "@/lib/supabase/server";

export async function updateTrade(userId, tradeId, tradeData) {
    const supabase = await createClient();

    const updateData = {
        ...tradeData,
        margin: parseFloat(tradeData.margin),
        proceeds: parseFloat(tradeData.proceeds),
        realized_gain: parseFloat(tradeData.realized_gain),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("trade_list")
        .update(updateData)
        .eq("id", tradeId)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        console.error("Failed to update trade:", error);
        throw new Error(error.message);
    }

    return data;
}
