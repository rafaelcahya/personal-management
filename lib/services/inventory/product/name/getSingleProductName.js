import { createClient } from "@/lib/supabase/server";

const TABLE_NAME = "product_name";

export async function getSingleProductName(userId, productNameId) {
    if (!userId) throw new Error("User ID is required");
    if (!productNameId) throw new Error("Product Name ID is required");

    const supabase = await createClient();

    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", productNameId)
        .eq("user_id", userId)
        .is("deleted_at", null)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            return null;
        }
        throw new Error(
            `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`,
        );
    }

    return data;
}
