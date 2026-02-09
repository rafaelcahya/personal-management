import { createClient } from "@/lib/supabase/client";

export async function fetchFeeList() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("fee_list")
        .select("*")
        .is("deleted_at", null)
        .order("fee_date", { ascending: false });

    if (error) {
        console.error("Fetch fees error:", error);
        throw new Error(error.message);
    }

    return data || [];
}

export async function createFee(payload) {
    const supabase = createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("User not authenticated");
    }

    const { data, error } = await supabase
        .from("fee_list")
        .insert([{ ...payload, user_id: user.id }])
        .select()
        .single();

    if (error) {
        console.error("Create fee error:", error);
        throw new Error(error.message);
    }

    return data;
}

export async function updateFee(id, payload) {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("fee_list")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

    if (error) {
        console.error("Update fee error:", error);
        throw new Error(error.message);
    }

    return data;
}
export async function deleteFee(id) {
    const supabase = createClient();

    const { error } = await supabase
        .from("fee_list")
        .update({ deleted_at: new Date().toISOString() })
        .eq("id", id);

    if (error) {
        console.error("Delete fee error:", error);
        throw new Error(error.message);
    }

    return { success: true };
}


export async function fetchFeeSummary() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("fee_list")
        .select("fee")
        .is("deleted_at", null);

    if (error) {
        console.error("Fetch fee summary error:", error);
        throw new Error(error.message);
    }

    const feeCount = data?.length || 0;
    const totalFee =
        data?.reduce((sum, item) => sum + Number(item.fee), 0) || 0;

    return { feeCount, totalFee };
}
