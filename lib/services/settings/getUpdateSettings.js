import { supabase } from "../../supabase/client";

export async function getUpdateSettings(
    initial_margin,
    bi_risk_free_rate,
    personal_risk_free_rate
) {
    const { data, error } = await supabase
        .from("settings")
        .upsert(
            {
                id: 1,
                initial_margin: Number(initial_margin),
                bi_risk_free_rate: Number(bi_risk_free_rate),
                personal_risk_free_rate: Number(personal_risk_free_rate),
            },
            { onConflict: "id" }
        )
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
