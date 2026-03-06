import { createClient } from "@/lib/supabase/server";

export async function createFee(userId, payload) {
    const supabase = await createClient();
    
    const request = {
        user_id: userId,
        fee_date: payload.fee_date,
        fee: parseFloat(payload.fee),
        fee_name: payload.fee_name,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
        .from("fee_list")
        .insert(request)
        .select()
        .single();

    if (error) {
        console.error("Failed to create fee:", error);
        throw new Error(error.message || "Failed to create fee");
    }

    return data;
}
