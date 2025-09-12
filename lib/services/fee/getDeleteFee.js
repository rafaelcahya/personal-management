import { supabase } from "../../supabase/client";

export async function getDeleteFee(id) {
    try {
        const { data, error } = await supabase
            .from("fee_list")
            .delete()
            .eq("id", Number(id))
            .select();

        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        throw new Error("Failed to delete fee: " + err.message);
    }
}
