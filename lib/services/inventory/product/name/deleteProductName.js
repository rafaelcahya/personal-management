import { createClient } from "@/lib/supabase/server";

export async function deleteProductName(id, userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("product_name")
        .update({
            product_name_status: "deleted",
            deleted_at: new Date().toISOString(),
        })
        .eq("id", Number(id))
        .eq("user_id", userId)
        .select()

    if (error) {
        throw new Error(error.message);
    }

    if (!data || data.length === 0) {
        throw new Error("Product name not found or unauthorized");
    }

    return data[0];
}
