import { createClient } from "@/lib/supabase/server";

export async function createProduct(userId, payload) {
    const supabase = await createClient();

    // Fetch product name dengan user filter
    const { data: productData, error: productError } = await supabase
        .from("product_name")
        .select("product_name")
        .eq("id", payload.product_id)
        .eq("user_id", userId)
        .single();

    if (productError) {
        console.error("Product fetch error:", productError);
        throw new Error("Product name tidak ditemukan");
    }

    // Fetch brand dengan user filter
    const { data: brandData, error: brandError } = await supabase
        .from("product_brand")
        .select("brand")
        .eq("id", payload.brand_id)
        .eq("user_id", userId)
        .single();

    if (brandError) {
        console.error("Brand fetch error:", brandError);
        throw new Error("Brand tidak ditemukan");
    }

    // Prepare insert data
    const insertData = {
        user_id: userId,
        product: productData.product_name,
        brand: brandData.brand,
        type: payload.type,
        product_id: payload.product_id,
        brand_id: payload.brand_id,
        product_status: "inactive",
        usage_quantity: payload.usage_quantity || 0,
        quantity: 0,
        product_image: payload.product_image || "",
        note: payload.note || "",
        usage_date: null,
        is_favorite: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    };

    // Insert product
    const { data, error } = await supabase
        .from("product_list")
        .insert(insertData)
        .select()
        .single();

    if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(error.message);
    }

    return data;
}
