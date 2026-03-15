import { createClient } from "@/lib/supabase/server";

export async function getFeeSummary(userId) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const supabase = await createClient();
    const PAGE_SIZE = 1000;
    let allFees = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from("fee_list")
            .select("fee")
            .eq("user_id", userId)
            .is("deleted_at", null)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error("Failed to fetch fee summary:", error);
            throw new Error(error.message || "Failed to fetch fee summary");
        }

        allFees = [...allFees, ...(data || [])];
        hasMore = data?.length === PAGE_SIZE;
        from += PAGE_SIZE;
    }

    const feeCount = allFees.length;
    const totalFee = allFees.reduce((sum, item) => sum + Number(item.fee), 0);

    return { feeCount, totalFee };
}

