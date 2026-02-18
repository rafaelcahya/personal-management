import { createClient } from "@/lib/supabase/server";

const TABLE_NAME = "trade_list";

export async function getSingleTradeFromDb(userId, tradeId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", tradeId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            console.log(`Trade ${tradeId} not found for user ${userId}`);
            return null;
        }
        throw new Error(`DB query failed: ${error.message}`);
    }

    return data;
}
