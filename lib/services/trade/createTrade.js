import { createClient } from "@/lib/supabase/server";

export async function createTrade(userId, tradeData) {
    const supabase = await createClient();

    const insertData = {
        user_id: userId,
        trade_date: tradeData.trade_date,
        ticker: tradeData.ticker,
        margin: parseFloat(tradeData.margin),
        proceeds: parseFloat(tradeData.proceeds),
        return_percent: tradeData.return_percent,
        realized_gain: parseFloat(tradeData.realized_gain),
        stock_type_option: tradeData.stock_type_option,
        entry_session_option: tradeData.entry_session_option,
        entry_occasion_option: tradeData.entry_occasion_option,
        buy_reason_option: tradeData.buy_reason_option,
        sell_reason_option: tradeData.sell_reason_option,
        notes: tradeData.notes || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("trade_list")
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error("Failed to create trade:", error);
        throw new Error(error.message);
    }

    return data;
}
