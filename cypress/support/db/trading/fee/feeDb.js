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
        throw new Error(`DB query failed: ${error.message}`);
    }

    return data || [];
}

/**
 * Get all fees for a user from database
 */
export async function getFeesFromDb(supabase, userId) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        throw new Error(`DB query failed: ${error.message}`);
    }

    return data || [];
}

/**
 * Get total transactions from database
 */
export async function getTotalTransactionsFromDb(supabase, userId) {
    const { count, error } = await supabase
        .from(TABLE_NAME)
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        throw new Error(`DB query failed: ${error.message}`);
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
