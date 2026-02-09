import { createClient } from "@/lib/supabase/server";

export async function getBuyReasonOptions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("buy_reason_option")
        .select("*")
        .order("buy_reason_option", { ascending: true });

    if (error) {
        console.error("Failed to fetch buy reason options:", error);
        throw new Error(error.message);
    }

    return data || [];
}
