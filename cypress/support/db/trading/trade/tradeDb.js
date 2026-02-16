const TABLE_NAME = "trade_list";

/**
 * Get all trades for a user from database
 */
async function getTradesFromDb(supabase, userId) {
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
 * Get total trades count from database
 */
async function getTotalTradesFromDb(supabase, userId) {
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
 * Get total wins from database (realized_gain > 0)
 */
async function getTotalWinsFromDb(supabase, userId) {
    const trades = await getTradesFromDb(supabase, userId);

    const wins = trades.filter((trade) => {
        const gain = parseFloat(trade.realized_gain);
        return !isNaN(gain) && gain > 0;
    });

    return wins.length;
}

/**
 * Get total losses from database (realized_gain < 0)
 */
async function getTotalLossesFromDb(supabase, userId) {
    const trades = await getTradesFromDb(supabase, userId);

    const losses = trades.filter((trade) => {
        const gain = parseFloat(trade.realized_gain);
        return !isNaN(gain) && gain < 0;
    });

    return losses.length;
}

/**
 * Get stock type summary from database
 */
async function getStockTypeSummaryFromDb(supabase, userId) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("stock_type_option")
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        throw new Error(`DB query failed: ${error.message}`);
    }

    const summary = {};
    data?.forEach((trade) => {
        const type = trade.stock_type_option;
        if (type) {
            summary[type] = (summary[type] || 0) + 1;
        }
    });

    return summary;
}

/**
 * Get entry session summary from database
 */
async function getEntrySessionSummaryFromDb(supabase, userId) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("entry_session_option")
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        throw new Error(`DB query failed: ${error.message}`);
    }

    const summary = {};
    data?.forEach((trade) => {
        const session = trade.entry_session_option;
        if (session) {
            summary[session] = (summary[session] || 0) + 1;
        }
    });

    return summary;
}

/**
 * Get entry occasion summary from database
 */
async function getEntryOccasionSummaryFromDb(supabase, userId) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("entry_occasion_option")
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        throw new Error(`DB query failed: ${error.message}`);
    }

    const summary = {};
    data?.forEach((trade) => {
        const occasion = trade.entry_occasion_option;
        if (occasion) {
            summary[occasion] = (summary[occasion] || 0) + 1;
        }
    });

    return summary;
}

module.exports = {
    getTradesFromDb,
    getTotalTradesFromDb,
    getTotalWinsFromDb,
    getTotalLossesFromDb,
    getStockTypeSummaryFromDb,
    getEntrySessionSummaryFromDb,
    getEntryOccasionSummaryFromDb,
};
