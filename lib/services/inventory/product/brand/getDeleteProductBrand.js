import { supabase } from "@/lib/supabase/client";

export async function getDeleteProductBrand(id) {
    try {
        const { data, error } = await supabase
            .from("product_brand")
            .update({
                brand_status: "deleted",
                deleted_at: new Date().toISOString(),
            })
            .eq("id", Number(id))
            .select();

        if (error) throw new Error(error.message);
        if (!data) throw new Error("Product brand not found");

        return data[0];
    } catch (err) {
        throw new Error("Failed to delete product brand: " + err.message);
    }
}
