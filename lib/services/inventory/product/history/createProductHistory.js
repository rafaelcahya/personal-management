import { supabase } from "@/lib/supabase/client";

export async function createProductHistory(historyData) {
    const { data, error } = await supabase
        .from("product_history")
        .insert([
            {
                ...historyData,
                status: "active",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        ])
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create history record: ${error.message}`);
    }

    return data;
}
