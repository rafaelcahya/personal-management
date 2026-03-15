const TABLE_NAME = "fee_list";

/**
 * Get single fees for a user from database
 */
export async function getSingleFeeFromDb(supabase, feeId, userId) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", feeId)
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        throw new Error(
            `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`,
        );
    }

    return data || [];
}

/**
 * Get all fees for a user from database
 */
export async function getFeesFromDb(supabase, userId) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const PAGE_SIZE = 1000;
    let allFees = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .eq("user_id", userId)
            .is("deleted_at", null)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            throw new Error(
                `DB query failed: ${error.message || error.details || JSON.stringify(error)}`
            );
        }

        allFees = [...allFees, ...(data || [])];
        hasMore = data?.length === PAGE_SIZE;
        from += PAGE_SIZE;
    }

    return allFees;
}

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


/**
 * Get total fees from database
 */
export async function getTotalFeesFromDb(supabase, userId) {
    const { count, error } = await supabase
        .from(TABLE_NAME)
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        throw new Error(
            `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`,
        );
    }

    return count || 0;
}

/**
 * Get total fees paid from database
 */
export async function getTotalFeesPaidFromDb(supabase, userId) {
    const fees = await getFeesFromDb(supabase, userId);

    const totalFeesPaid = fees.reduce((sum, fee) => {
        return sum + parseFloat(fee.fee || 0);
    }, 0);

    return totalFeesPaid;
}
