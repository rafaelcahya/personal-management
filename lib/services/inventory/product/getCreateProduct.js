import { supabase } from "../../../supabase/client";

export async function getCreateProduct(
    productId,
    brandId,
    type,
    productStatus,
    usageQuantity,
    productImage,
    note
) {
    try {
        const { data: productData, error: productError } = await supabase
            .from("product_name")
            .select("product_name")
            .eq("id", productId)
            .single();

        if (productError || !productData) {
            throw new Error("Product not found");
        }

        const { data: brandData, error: brandError } = await supabase
            .from("product_brand")
            .select("brand")
            .eq("id", brandId)
            .single();

        if (brandError || !brandData) {
            throw new Error("Brand not found");
        }

        const { data: newProduct, error: insertError } = await supabase
            .from("product_list")
            .insert({
                product: productData.product_name,
                brand: brandData.brand,
                type: type,
                product_status: productStatus,
                usage_quantity: Number(usageQuantity),
                product_image: productImage,
                note: note,
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        if (insertError) {
            throw insertError;
        }

        return newProduct;
    } catch (error) {
        console.error("getCreateProduct error:", error);
        throw error;
    }
}
