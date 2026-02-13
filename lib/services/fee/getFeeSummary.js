import { createClient } from "@/lib/supabase/server";

export async function getFeeSummary(userId) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("fee_list")
        .select("fee")
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        console.error("Failed to fetch fee summary:", error);
        throw new Error(error.message || "Failed to fetch fee summary");
    }

    const feeCount = data?.length || 0;
    const totalFee =
        data?.reduce((sum, item) => sum + Number(item.fee), 0) || 0;

    return { feeCount, totalFee };
}
