import { supabase } from "@/lib/supabase/client";

export async function getDeleteProductName(id) {
    try {
        const { data, error } = await supabase
            .from("product_name")
            .delete()
            .eq("id", Number(id))
            .select();

        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        throw new Error("Failed to delete product name: " + err.message);
    }
}
