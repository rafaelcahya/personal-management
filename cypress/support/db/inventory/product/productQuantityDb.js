export async function getLatestProductQuantityFromDb(
    supabase,
    productListId,
    userId,
) {
    const { data, error } = await supabase
        .from("product_quantity")
        .select("*")
        .eq("product_list_id", productListId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(`DB query failed: ${error.message}`);
    }
    return data;
}

export async function getProductQuantityCountFromDb(
    supabase,
    productListId,
    userId,
) {
    const { count, error } = await supabase
        .from("product_quantity")
        .select("*", { count: "exact", head: true })
        .eq("product_list_id", productListId)
        .eq("user_id", userId);

    if (error) throw new Error(`DB query failed: ${error.message}`);
    return count;
}

export async function getProductQuantityListFromDb(
    supabase,
    productListId,
    userId,
) {
    const { data, error } = await supabase
        .from("product_quantity")
        .select("*")
        .eq("product_list_id", productListId)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

    if (error) throw new Error(`DB query failed: ${error.message}`);
    return data;
}

export async function getProductQuantityHistoryFromDb(
    supabase,
    productListId,
    userId,
) {
    const { data, error } = await supabase
        .from("product_quantity")
        .select("*")
        .eq("product_list_id", productListId)
        .eq("user_id", userId)
        .order("purchase_date", { ascending: false });

    if (error) throw new Error(`DB query failed: ${error.message}`);
    return data || [];
}
