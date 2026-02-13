import { createClient } from "@/lib/supabase/server";

export async function updateSettings(userId, settingsData) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("settings")
        .update({
            initial_margin: settingsData.initial_margin,
            bi_risk_free_rate: settingsData.bi_risk_free_rate,
            personal_risk_free_rate: settingsData.personal_risk_free_rate,
            margin_of_error: settingsData.margin_of_error,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        console.error("Failed to update settings:", error);
        throw new Error(error.message);
    }

    return data;
}
