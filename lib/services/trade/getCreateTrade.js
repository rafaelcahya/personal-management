import { supabase } from "../../supabase/client";

export async function getCreateTrade(
    trade_date,
    ticker,
    margin,
    proceeds,
    return_percent,
    realized_gain,
    stock_type_option,
    entry_session_option,
    entry_occasion_option,
    sell_reason_option,
    buy_reason_option,
    notes
) {
    const { data, error } = await supabase
        .from("trade_list")
        .insert([
            {
                trade_date: trade_date,
                ticker,
                margin: Number(margin),
                proceeds: Number(proceeds),
                return_percent: return_percent,
                realized_gain: Number(realized_gain),
                stock_type_option: stock_type_option,
                entry_session_option: entry_session_option,
                entry_occasion_option: entry_occasion_option,
                sell_reason_option: sell_reason_option,
                buy_reason_option: buy_reason_option,
                notes,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
