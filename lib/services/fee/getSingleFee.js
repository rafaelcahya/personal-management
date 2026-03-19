import { createClient } from "@/lib/supabase/server";

const TABLE_NAME = "fee_list";

export async function getSingleFee(userId, feeId) {
    if (!userId) throw new Error("User ID is required");
    if (!feeId) throw new Error("Fee ID is required");

    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", feeId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return null;
        }
        throw new Error(
            `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`,
        );
    }

    return data;
}
