import { createClient } from "@/lib/supabase/server";

export async function deleteFee(userId, feeId) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("fee_list")
        .update({
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", feeId)
        .eq("user_id", userId)

    if (error) {
        console.error("Failed to soft delete fee:", error);
        throw new Error(error.message || "Failed to delete fee");
    }

    return { success: true };
}
