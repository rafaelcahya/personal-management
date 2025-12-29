import { supabase } from "../../supabase/client";

export async function getDeleteTrade(id) {
    try {
        const { data, error } = await supabase
            .from("trade_list")
            .delete()
            .eq("id", Number(id))
            .select();

        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        throw new Error("Failed to delete trade: " + err.message);
    }
}
