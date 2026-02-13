import { createClient } from "@/lib/supabase/server";

// Base function (internal use)
async function fetchOptions(tableName, columnName) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order(columnName, { ascending: true });

    if (error) {
        console.error(`Failed to fetch from ${tableName}:`, error);
        throw new Error(error.message);
    }

    return data || [];
}

// Explicit functions for type safety
export async function getStockTypeOptions() {
    return fetchOptions("stock_type_options", "stock_type_option");
}

export async function getEntrySessionOptions() {
    return fetchOptions("entry_session_options", "entry_session_option");
}

export async function getEntryOccasionOptions() {
    return fetchOptions("entry_occasion_options", "entry_occasion_option");
}

export async function getBuyReasonOptions() {
    return fetchOptions("buy_reason_options", "buy_reason_option");
}

export async function getSellReasonOptions() {
    return fetchOptions("sell_reason_options", "sell_reason_option");
}

// Convenience function to fetch all at once
export async function getAllTradeOptions() {
    try {
        const [stockType, entrySession, entryOccasion, buyReason, sellReason] =
            await Promise.all([
                getStockTypeOptions(),
                getEntrySessionOptions(),
                getEntryOccasionOptions(),
                getBuyReasonOptions(),
                getSellReasonOptions(),
            ]);

        return {
            stockType,
            entrySession,
            entryOccasion,
            buyReason,
            sellReason,
        };
    } catch (error) {
        console.error("Failed to fetch all trade options:", error);
        throw new Error("Failed to fetch trade options");
    }
}

// Dynamic function for flexibility (optional)
export async function getTradeOptionsByType(optionType) {
    const optionMap = {
        stockType: getStockTypeOptions,
        entrySession: getEntrySessionOptions,
        entryOccasion: getEntryOccasionOptions,
        buyReason: getBuyReasonOptions,
        sellReason: getSellReasonOptions,
    };

    const fetchFunction = optionMap[optionType];

    if (!fetchFunction) {
        throw new Error(`Invalid option type: ${optionType}`);
    }

    return fetchFunction();
}
