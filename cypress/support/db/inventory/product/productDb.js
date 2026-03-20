export async function getSingleProductFromDb(supabase, productId, userId) {
    const { data, error } = await supabase
        .from("product_list")
        .select("*")
        .eq("id", productId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(`DB query failed: ${error.message}`);
    }
    return data;
}

export async function getProductListFromDb(supabase, userId) {
    const { data, error } = await supabase
        .from("product_list")
        .select("*")
        .eq("user_id", userId)
        .is("deleted_at", null)
        .order("is_favorite", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) throw new Error(`DB query failed: ${error.message}`);
    return data || [];
}

export async function getTotalProductsFromDb(supabase, userId) {
    const { count, error } = await supabase
        .from("product_list")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) throw new Error(`DB query failed: ${error.message}`);
    return count || 0;
}

export async function getProductSummaryFromDb(supabase, userId) {
    const { data, error } = await supabase
        .from("product_list")
        .select("product_status, quantity, usage_quantity, is_favorite")
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) throw new Error(`DB query failed: ${error.message}`);

    const products = data || [];

    return products.reduce(
        (acc, product) => {
            acc.totalProducts += 1;

            if (product.product_status === "active") acc.activeProducts += 1;
            else if (product.product_status === "inactive")
                acc.inactiveProducts += 1;

            acc.totalQuantity += Number(product.quantity) || 0;
            acc.totalUsageQuantity += Number(product.usage_quantity) || 0;

            if (product.is_favorite) acc.favoriteProducts += 1;

            return acc;
        },
        {
            totalProducts: 0,
            activeProducts: 0,
            inactiveProducts: 0,
            totalQuantity: 0,
            totalUsageQuantity: 0,
            favoriteProducts: 0,
        },
    );
}

export async function getSingleProductIncludeDeletedFromDb(
    supabase,
    productId,
    userId,
) {
    const { data, error } = await supabase
        .from("product_list")
        .select("*")
        .eq("id", productId)
        .eq("user_id", userId)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(`DB query failed: ${error.message}`);
    }
    return data;
}

export async function getProductWithQuantityFromDb(
    supabase,
    productId,
    userId,
) {
    const { data, error } = await supabase
        .from("product_list")
        .select(
            "id, quantity, usage_quantity, product_status, usage_date, note, updated_at",
        )
        .eq("id", productId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(`DB query failed: ${error.message}`);
    }
    return data;
}

export async function getLatestProductHistoryFromDb(
    supabase,
    productListId,
    userId,
) {
    const { data, error } = await supabase
        .from("product_history")
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

export async function setProductQuantityInDb(supabase, productId, quantity) {
    const { data, error } = await supabase
        .from("product_list")
        .update({ quantity })
        .eq("id", productId)
        .select()
        .single();

    if (error) throw new Error(`Failed to set quantity: ${error.message}`);
    return data;
}

export async function getProductHistoryCountFromDb(
    supabase,
    productId,
    userId,
) {
    const { count, error } = await supabase
        .from("product_history")
        .select("*", { count: "exact", head: true })
        .eq("product_list_id", productId)
        .eq("user_id", userId);

    if (error) throw new Error(`DB query failed: ${error.message}`);
    return count;
}

export async function getProductFavoriteStatusFromDb(
    supabase,
    productId,
    userId,
) {
    const { data, error } = await supabase
        .from("product_list")
        .select("id, is_favorite, updated_at")
        .eq("id", productId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") return null;
        throw new Error(`DB query failed: ${error.message}`);
    }
    return data;
}