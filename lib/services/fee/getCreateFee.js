import { supabase } from "../../supabase/client";

export async function getCreateFee(fee_name, fee, fee_date) {
    const { data, error } = await supabase
        .from("fee_list")
        .insert([
            {
                fee_name: fee_name,
                fee: Number(fee),
                fee_date: fee_date,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
