import { createClient } from "@/lib/supabase/client";

export async function getUpdateTrade(id, values) {
    const {
        trade_date,
        ticker,
        margin,
        proceeds,
        return_percent,
        realized_gain,
        stock_type_option,
        entry_session_option,
        entry_occasion_option,
        buy_reason_option,
        sell_reason_option,
        notes,
    } = values;

    const { data, error } = await supabase
        .from("trade_list")
        .update({
            updated_at: new Date().toISOString(),
            trade_date,
            ticker,
            margin: Number(margin),
            proceeds: Number(proceeds),
            return_percent,
            realized_gain: Number(realized_gain),
            stock_type_option,
            entry_session_option,
            entry_occasion_option,
            buy_reason_option,
            sell_reason_option,
            notes,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
