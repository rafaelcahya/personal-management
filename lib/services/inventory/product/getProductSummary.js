import { createClient } from "@/lib/supabase/server";

export async function getProductSummary(userId) {
    const supabase = await createClient();

    const { data: products, error } = await supabase
        .from("product_list")
        .select("product_status, quantity, usage_quantity, is_favorite")
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    if (!products || products.length === 0) {
        return {
            totalProducts: 0,
            activeProducts: 0,
            inactiveProducts: 0,
            totalQuantity: 0,
            totalUsageQuantity: 0,
            favoriteProducts: 0,
        };
    }

    return products.reduce(
        (acc, product) => {
            acc.totalProducts += 1;

            if (product.product_status === "active") acc.activeProducts += 1;
            else if (product.product_status === "inactive")
                acc.inactiveProducts += 1;

            acc.totalQuantity += Number(product.quantity) || 0;
            acc.totalUsageQuantity += Number(product.usage_quantity) || 0;

            if (product.is_favorite) acc.favoriteProducts += 1;

            return acc;
        },
        {
            totalProducts: 0,
            activeProducts: 0,
            inactiveProducts: 0,
            totalQuantity: 0,
            totalUsageQuantity: 0,
            favoriteProducts: 0,
        },
    );
}
