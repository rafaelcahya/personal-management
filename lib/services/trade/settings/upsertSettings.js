import { createClient } from "@/lib/supabase/server";

export async function upsertSettings(userId, settingsData) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("settings")
        .upsert(
            {
                user_id: userId,
                initial_margin: settingsData.initial_margin || 0,
                bi_risk_free_rate: settingsData.bi_risk_free_rate || 0,
                personal_risk_free_rate:
                    settingsData.personal_risk_free_rate || 0,
                margin_of_error: settingsData.margin_of_error || 10,
                updated_at: new Date().toISOString(),
            },
            {
                onConflict: "user_id",
            },
        )
        .select()
        .single();

    if (error) {
        console.error("Failed to upsert settings:", error);
        throw new Error(error.message);
    }

    return data;
}
