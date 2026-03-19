const TABLE_NAME = "product_brand";

export async function getSingleProductBrandFromDb(supabase, productBrandId, userId) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", productBrandId)
        .eq("user_id", userId)

    if (error) {
        throw new Error(
            `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`,
        );
    }

    return data || [];
}

export async function getTotalProductBrandsFromDb(supabase, userId) {
    const { count, error } = await supabase
        .from(TABLE_NAME)
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        throw new Error(
            `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`,
        );
    }

    return count || 0;
}