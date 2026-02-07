import { createClient } from "@/lib/supabase/client";

export async function getCreateProduct(payload) {
    // Fetch product name
    const { data: productData, error: productError } = await supabase
        .from("product_name")
        .select("product_name")
        .eq("id", payload.product_id)
        .single();

    if (productError) {
        console.error("Product fetch error:", productError);
        throw new Error("Failed to fetch product name");
    }

    // Fetch brand name
    const { data: brandData, error: brandError } = await supabase
        .from("product_brand")
        .select("brand")
        .eq("id", payload.brand_id)
        .single();

    if (brandError) {
        console.error("Brand fetch error:", brandError);
        throw new Error("Failed to fetch brand name");
    }

    // Insert with both text values AND foreign keys
    const { data, error } = await supabase
        .from("product_list")
        .insert([
            {
                // Text columns (for backward compatibility)
                product: productData.product_name,
                brand: brandData.brand,
                type: payload.type,

                // Foreign key columns (new)
                product_id: parseInt(payload.product_id),
                brand_id: parseInt(payload.brand_id),

                // Other fields
                product_status: "inactive",
                usage_quantity: parseInt(payload.usage_quantity) || 0,
                quantity: 0,
                product_image: payload.product_image || "",
                note: payload.note || "",
                usage_date: null,
                is_favorite: false,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(error.message);
    }

    return data;
}
