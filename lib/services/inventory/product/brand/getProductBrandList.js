import { createClient } from "@/lib/supabase/server";

export async function getProductBrandList(userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("product_brand")
        .select("*")
        .eq("user_id", userId)
        .order("brand", { ascending: true });

    if (error) {
        console.error("Get product brands error:", error);
        throw new Error(error.message);
    }

    return data;
}
