import { supabase } from "@/lib/supabase/client";

export async function getUpdateFee(id, values) {
    const { fee_date, fee, fee_name } = values;

    const { data, error } = await supabase
        .from("fee_list")
        .update({
            updated_at: new Date().toISOString(),
            fee_date,
            fee: Number(fee),
            fee_name,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
