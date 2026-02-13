import { createClient } from "@/lib/supabase/server";

export async function deleteFee(userId, feeId) {
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
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", feeId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .select()
        .single();

    if (error) {
        console.error("Failed to soft delete fee:", error);
        throw new Error(error.message || "Failed to delete fee");
    }

    if (!data) {
        throw new Error("Fee not found or already deleted");
    }

    return data;
}
