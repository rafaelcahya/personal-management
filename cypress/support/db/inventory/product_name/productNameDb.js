const TABLE_NAME = "product_name";

export async function getSingleProductNameFromDb(supabase, productNameId, userId) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", productNameId)
        .eq("user_id", userId)

    if (error) {
        throw new Error(
            `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`,
        );
    }

    return data || [];
}

export async function getTotalProductNamesFromDb(supabase, userId) {
    const { count, error } = await supabase
        .from(TABLE_NAME)
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)

    if (error) {
        throw new Error(
            `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`,
        );
    }

    return count || 0;
}