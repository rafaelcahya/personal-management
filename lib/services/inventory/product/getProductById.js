import { createClient } from "@/lib/supabase/server"

export async function getProductById(userId, id) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("product_list")
        .select("*")
        .eq("id", Number(id))
        .eq("user_id", userId) 
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(error.message);
    }

    const { data: productName } = await supabase
        .from("product_name")
        .select("product_name")
        .eq("id", data.product_id)
        .eq("user_id", userId)
        .single();

    const { data: brand } = await supabase
        .from("product_brand")
        .select("brand")
        .eq("id", data.brand_id)
        .eq("user_id", userId)
        .single();

    return {
        ...data,
        product: productName?.product_name || data.product || "-",
        brand: brand?.brand || data.brand || "-",
    };
}
