import { supabase } from "../../../supabase/client";

export async function getDeleteProduct(id) {
    try {
        const { data, error } = await supabase
            .from("product_list")
            .delete()
            .eq("id", Number(id))
            .select();

        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        throw new Error("Failed to delete product: " + err.message);
    }
}
