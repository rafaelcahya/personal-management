import { toProductBrandListDto } from "./productBrandListDto";

export async function getProductBrandListFromDb(supabase, productBrandId) {
    const { data, error } = await supabase
        .from("product_brand")
        .select("*")
        .eq("id", productBrandId)
        .single();

    if (error && error.code === "PGRST116") {
        return null;
    }

    if (error) throw new Error(error.message);

    return toProductBrandListDto(data);
}

export async function getProductBrandSummaryFromDb(supabase) {
    const { count: total, error: totalError } = await supabase
        .from("product_brand")
        .select("*", { count: "exact", head: true });

    if (totalError) throw new Error(totalError.message);

    // Three separate efficient count queries (no .group() needed)
    const [activeRes, inactiveRes, deletedRes] = await Promise.all([
        supabase
            .from("product_brand")
            .select("*", { count: "exact", head: true })
            .eq("brand_status", "active"),
        supabase
            .from("product_brand")
            .select("*", { count: "exact", head: true })
            .eq("brand_status", "inactive"),
        supabase
            .from("product_brand")
            .select("*", { count: "exact", head: true })
            .eq("brand_status", "deleted"),
    ]);

    if (activeRes.error) throw new Error(activeRes.error.message);
    if (inactiveRes.error) throw new Error(inactiveRes.error.message);
    if (deletedRes.error) throw new Error(deletedRes.error.message);

    return {
        totalProductBrands: total || 0,
        totalStatus: {
            active: activeRes.count || 0,
            inactive: inactiveRes.count || 0,
            deleted: deletedRes.count || 0,
        },
    };
}
