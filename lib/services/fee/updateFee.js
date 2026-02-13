import { createClient } from "@/lib/supabase/server";

export async function updateFee(userId, feeId, payload) {
    if (!userId) {
        throw new Error("User ID is required");
    }
    if (!feeId) {
        throw new Error("Fee ID is required");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("fee_list")
        .update({
            ...payload,
            updated_at: new Date().toISOString(),
        })
        .eq("id", feeId)
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        console.error("Failed to update fee:", error);
        throw new Error(error.message || "Failed to update fee");
    }

    if (!data) {
        throw new Error("Fee not found");
    }

    return data;
}
