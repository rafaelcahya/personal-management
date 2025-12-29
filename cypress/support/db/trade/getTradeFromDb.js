import { toTradeDto } from "./tradeDto";

export async function getTradeFromDb(supabase, tradeId) {
    const { data, error } = await supabase
        .from("trade_list")
        .select("*")
        .eq("id", tradeId)
        .is("deleted_at", null)
        .single();

    if (error && error.code === "PGRST116") {
        return null;
    }

    if (error) throw new Error(error.message);

    return toTradeDto(data);
}

export async function getProgressOverviewSummaryFromDb(supabase, metric = "totalTrades") {
    let query = supabase
        .from("trade_list")
        .select("realized_gain", { count: "exact" })
        .is("deleted_at", null);

    if (metric === "totalWins") query = query.gt("realized_gain", 0);
    if (metric === "totalLosses") query = query.lt("realized_gain", 0);

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data.length;
}

export async function getTotalStockTypeFromDb(supabase, stockType) {
    const { data, error } = await supabase
        .from("trade_list")
        .select("stock_type_option", { count: "exact" })
        .eq("stock_type_option", stockType)
        .is("deleted_at", null);

    if (error) throw new Error(error.message);

    return data.length;
}

export async function getTotalEntrySessionFromDb(supabase, entrySession) {
    const { data, error } = await supabase
        .from("trade_list")
        .select("entry_session_option", { count: "exact" })
        .eq("entry_session_option", entrySession)
        .is("deleted_at", null);

    if (error) throw new Error(error.message);

    return data.length;
}

export async function getTotalEntryOccasionFromDb(supabase, entryOccasion) {
    const { data, error } = await supabase
        .from("trade_list")
        .select("entry_occasion_option", { count: "exact" })
        .eq("entry_occasion_option", entryOccasion)
        .is("deleted_at", null);

    if (error) throw new Error(error.message);

    return data.length;
}