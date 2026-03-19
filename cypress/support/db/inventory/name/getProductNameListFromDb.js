import { toProductNameListDto } from "./productNameListDto";

export async function getProductNameListFromDb(supabase, productNameId) {
    const { data, error } = await supabase
        .from("product_name")
        .select("*")
        .eq("id", productNameId)
        .single();

    if (error && error.code === "PGRST116") {
        return null;
    }

    if (error) throw new Error(error.message);

    return toProductNameListDto(data);
}

export async function getProductNameSummaryFromDb(supabase) {
    const { count: total, error: totalError } = await supabase
        .from("product_name")
        .select("*", { count: "exact", head: true });

    if (totalError) throw new Error(totalError.message);

    const [activeRes, inactiveRes, deletedRes] = await Promise.all([
        supabase
            .from("product_name")
            .select("*", { count: "exact", head: true })
            .eq("product_name_status", "active"),
        supabase
            .from("product_name")
            .select("*", { count: "exact", head: true })
            .eq("product_name_status", "inactive"),
        supabase
            .from("product_name")
            .select("*", { count: "exact", head: true })
            .eq("product_name_status", "deleted"),
    ]);

    if (activeRes.error) throw new Error(activeRes.error.message);
    if (inactiveRes.error) throw new Error(inactiveRes.error.message);
    if (deletedRes.error) throw new Error(deletedRes.error.message);

    return {
        totalProductNames: total || 0,
        totalStatus: {
            active: activeRes.count || 0,
            inactive: inactiveRes.count || 0,
            deleted: deletedRes.count || 0,
        },
    };
}