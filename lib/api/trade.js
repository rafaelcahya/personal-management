import { createClient } from "@/lib/supabase/client";

export async function fetchTradeList() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("trade_list")
        .select("*")
        .is("deleted_at", null)
        .order("trade_date", { ascending: false });

    if (error) {
        console.error("Fetch trades error:", error);
        throw new Error(error.message);
    }

    return data || [];
}

export async function createTrade(payload) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
        .from("trade_list")
        .insert([{ ...payload, user_id: user.id }])
        .select()
        .single();

    if (error) {
        console.error("Create trade error:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function updateTrade(id, payload) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("trade_list")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Update trade error:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function deleteTrade(id) {
    const supabase = createClient();

    const { error } = await supabase
        .from("trade_list")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

    if (error) {
        console.error("Delete trade error:", error);
        throw new Error(error.message);
    }

    return { success: true };
}

export async function fetchTradeOptions(optionType) {
    const supabase = createClient();
    const tableMap = {
        stockType: "stock_type_options",
        entrySession: "entry_session_options",
        entryOccasion: "entry_occasion_options",
        buyReason: "buy_reason_options",
        sellReason: "sell_reason_options",
    };

    const columnMap = {
        stockType: "stock_type_option",
        entrySession: "entry_session_option",
        entryOccasion: "entry_occasion_option",
        buyReason: "buy_reason_option",
        sellReason: "sell_reason_option",
    };

    const tableName = tableMap[optionType];
    const columnName = columnMap[optionType];
    if (!tableName) throw new Error("Invalid option type");

    const { data, error } = await supabase
        .from(tableName)
        .select("*")
        .order(columnName, { ascending: true });

    if (error) {
        console.error(`Fetch ${optionType} error:`, error);
        throw new Error(error.message);
    }

    return data || [];
}
