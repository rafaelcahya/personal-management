import { toTradeDto } from "./tradeDto";

export async function getTradeFromDb(supabase, tradeId) {
    const { data, error } = await supabase
        .from("trade_list")
        .select("*")
        .eq("id", tradeId)
        .is("deleted_at", null)
        .single();

    if (error && error.code === "PGRST116") {
        // record not found
        return null;
    }

    if (error) throw new Error(error.message);

    return toTradeDto(data);
}
