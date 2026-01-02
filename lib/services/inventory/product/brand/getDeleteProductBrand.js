import { supabase } from "@/lib/supabase/client";

export async function getDeleteProductBrand(id) {
    try {
        const { data, error } = await supabase
            .from("product_brand")
            .delete()
            .eq("id", Number(id))
            .select();

        if (error) throw new Error(error.message);
        return data;
    } catch (err) {
        throw new Error("Failed to delete product brand: " + err.message);
    }
}
