import { supabase } from "../../../supabase/client";

export async function getDeleteBrand(id) {
    try {
        const { data, error } = await supabase
            .from("product_brand")
            .delete()
            .eq("id", Number(id))
            .select();

        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        throw new Error("Failed to delete brand: " + err.message);
    }
}
