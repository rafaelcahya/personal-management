import { createClient } from "@/lib/supabase/server";

export async function getSellReasonOptions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("sell_reason_option")
        .select("*")
        .order("sell_reason_option", { ascending: true });

    if (error) {
        console.error("Failed to fetch sell reason options:", error);
        throw new Error(error.message);
    }

    return data || [];
}
