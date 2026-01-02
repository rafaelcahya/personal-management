import { supabase } from "@/lib/supabase/client";

export async function getCreateProductBrand(brand, note, brand_status, brand_image) {
    const { data, error } = await supabase
        .from("product_brand")
        .insert([
            {
                brand,
                note,
                brand_status,
                brand_image,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ])
        .select()
        .single();

    if (error) throw new Error(error.message);

    return data;
}
