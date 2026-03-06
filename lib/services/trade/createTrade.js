import { createClient } from "@/lib/supabase/server";

export async function createTrade(userId, payload) {
    const supabase = await createClient();

    const request = {
        user_id: userId,
        trade_date: payload.trade_date,
        ticker: payload.ticker,
        margin: parseFloat(payload.margin),
        proceeds: parseFloat(payload.proceeds),
        return_percent: payload.return_percent,
        realized_gain: parseFloat(payload.realized_gain),
        stock_type_option: payload.stock_type_option,
        entry_session_option: payload.entry_session_option,
        entry_occasion_option: payload.entry_occasion_option,
        buy_reason_option: payload.buy_reason_option,
        sell_reason_option: payload.sell_reason_option,
        notes: payload.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("trade_list")
        .insert(request)
        .select()
        .single();

    if (error) {
        console.error("Failed to create trade:", error);
        throw new Error(error.message);
    }

    return data;
}
