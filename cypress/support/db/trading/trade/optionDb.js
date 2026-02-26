import { createClient } from "@/lib/supabase/server";

const BUY_REASON_OPTIONS_TABLE_NAME = "buy_reasons_options";
const ENTRY_OCCASION_OPTIONS_TABLE_NAME = "entry_occasion_options";
const ENTRY_SESSION_OPTIONS_TABLE_NAME = "entry_session_options";
const STOCK_TYPE_OPTIONS_TABLE_NAME = "stock_type_options";
const SELL_REASON_OPTIONS_TABLE_NAME = "sell_reasons_options";

export async function getBuyReasonOptionsFromDb(userId, optionId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(BUY_REASON_OPTIONS_TABLE_NAME)
        .select("*")
        .eq("id", optionId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            console.log(
                `Buy reason option ${optionId} not found for user ${userId}`,
            );
            return null;
        }
        throw new Error(`DB query failed: ${error.message}`);
    }

    return data;
}

export async function getEntryOccasionOptionsFromDb(userId, optionId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(ENTRY_OCCASION_OPTIONS_TABLE_NAME)
        .select("*")
        .eq("id", optionId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            console.log(
                `Entry occasion option ${optionId} not found for user ${userId}`,
            );
            return null;
        }
        throw new Error(`DB query failed: ${error.message}`);
    }

    return data;
}

export async function getEntrySessionOptionsFromDb(userId, optionId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(ENTRY_SESSION_OPTIONS_TABLE_NAME)
        .select("*")
        .eq("id", optionId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            console.log(
                `Entry session option ${optionId} not found for user ${userId}`,
            );
            return null;
        }
        throw new Error(`DB query failed: ${error.message}`);
    }

    return data;
}

export async function getStockTypeOptionsFromDb(userId, optionId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(STOCK_TYPE_OPTIONS_TABLE_NAME)
        .select("*")
        .eq("id", optionId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            console.log(
                `Stock type option ${optionId} not found for user ${userId}`,
            );
            return null;
        }
        throw new Error(`DB query failed: ${error.message}`);
    }

    return data;
}

export async function getSellReasonOptionsFromDb(userId, optionId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from(SELL_REASON_OPTIONS_TABLE_NAME)
        .select("*")
        .eq("id", optionId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            console.log(
                `Sell reason option ${optionId} not found for user ${userId}`,
            );
            return null;
        }
        throw new Error(`DB query failed: ${error.message}`);
    }

    return data;
}
