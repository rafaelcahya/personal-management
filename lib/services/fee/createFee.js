import { createClient } from "@/lib/supabase/server";

export async function createFee(userId, payload) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    if (!payload) {
        throw new Error("Fee data is required");
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("fee_list")
        .insert([{ ...payload, user_id: userId }])
        .select()
        .single();

    if (error) {
        console.error("Failed to create fee:", error);
        throw new Error(error.message || "Failed to create fee");
    }

    return data;
}
