import { supabase } from "../../supabase/client";

export async function getUpdateSettings(
    initial_margin,
    bi_risk_free_rate,
    personal_risk_free_rate,
    margin_of_error
) {
    const { data, error } = await supabase
        .from("settings")
        .upsert(
            {
                id: 1,
                initial_margin: Number(initial_margin),
                bi_risk_free_rate: Number(bi_risk_free_rate),
                personal_risk_free_rate: Number(personal_risk_free_rate),
                margin_of_error: Number(margin_of_error),
            },
            { onConflict: "id" }
        )
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
