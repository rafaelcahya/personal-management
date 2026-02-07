import { createClient } from "@/lib/supabase/client";

export async function deleteProductName(id) {
    const supabase = createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("Unauthorized");
    }

    try {
        const { data, error } = await supabase
            .from("product_name")
            .update({
                product_name_status: "deleted",
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq("id", Number(id))
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) throw new Error(error.message);
        if (!data) throw new Error("Product name not found or unauthorized");

        return data;
    } catch (err) {
        throw new Error(err.message || "Failed to delete product name");
    }
}
