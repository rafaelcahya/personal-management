import { createClient } from "@/lib/supabase/server";

export async function deleteTrade(userId, tradeId) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("trade_list")
        .update({
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", tradeId)
        .eq("user_id", userId);

    if (error) {
        console.error("Failed to delete trade:", error);
        throw new Error(error.message);
    }

    return { success: true };
}
