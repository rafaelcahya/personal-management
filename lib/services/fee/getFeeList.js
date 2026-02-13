import { createClient } from "@/lib/supabase/server";

export async function getFeeList(userId) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("fee_list")
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("fee_date", { ascending: false });

    if (error) {
        console.error("Failed to fetch fees:", error);
        throw new Error(error.message || "Failed to fetch fees");
    }

    return data || [];
}
