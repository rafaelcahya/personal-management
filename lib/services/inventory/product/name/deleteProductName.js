import { createClient } from "@/lib/supabase/server";

export async function deleteProductName(id, userId) {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("product_name")
        .update({
            product_name_status: "deleted",
            deleted_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
        })
        .eq("id", Number(id))
        .eq("user_id", userId)
        .select()
        .single();

    if (error) {
        console.error("Delete error:", error);
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error("Product name not found or unauthorized");
    }

    return data;
}
