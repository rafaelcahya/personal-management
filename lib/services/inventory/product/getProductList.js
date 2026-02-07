import { createClient } from "@/lib/supabase/server";

export async function getProductList(userId) {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from("product_list")
        .select("*")
        .eq("user_id", userId)
        .order("is_favorite", { ascending: false })
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    if (!products || products.length === 0) {
        return [];
    }

    const { data: productNames } = await supabase
        .from("product_name")
        .select("id, product_name")
        .eq("user_id", userId);

    const { data: brands } = await supabase
        .from("product_brand")
        .select("id, brand")
        .eq("user_id", userId);

    const productNameMap = (productNames || []).reduce((acc, p) => {
        acc[p.id] = p.product_name;
        return acc;
    }, {});

    const brandMap = (brands || []).reduce((acc, b) => {
        acc[b.id] = b.brand;
        return acc;
    }, {});

    const enrichedProducts = products.map((product) => ({
        ...product,
        product: productNameMap[product.product_id] || product.product || "-",
        brand: brandMap[product.brand_id] || product.brand || "-",
    }));

    return enrichedProducts;
}
