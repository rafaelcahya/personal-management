import { supabase } from "@/lib/supabase/client";

export async function getDeleteProductName(id) {
    try {
        const { data, error } = await supabase
            .from("product_name")
            .update({
                product_name_status: "deleted",
                deleted_at: new Date().toISOString(),
            })
            .eq("id", Number(id))
            .select();

        if (error) throw new Error(error.message);
        if (!data) throw new Error("Product name not found");

        return data[0];
    } catch (err) {
        throw new Error("Failed to delete product name: " + err.message);
    }
}
