import { createClient } from "@/lib/supabase/server";

export async function getProductNameList(userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("product_name")
        .select("*")
        .eq("user_id", userId)
        .order("product_name", { ascending: true });

    if (error) {
        console.error("Get product names error:", error);
        throw new Error(error.message);
    }

    return data;
}
