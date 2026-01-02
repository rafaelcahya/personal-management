import { supabase } from "@/lib/supabase/client";

export async function getUpdateProductBrand(id, values) {
    const { brand, note, brand_status, brand_image } = values;

    const { data, error } = await supabase
        .from("product_brand")
        .update({
            updated_at: new Date().toISOString(),
            brand,
            note,
            brand_status,
            brand_image,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) throw new Error(error.message);
    return data;
}
