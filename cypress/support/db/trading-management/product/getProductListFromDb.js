import { toProductListDto } from "./productListDto";

export async function getProductListFromDb(supabase, productId) {
    const { data, error } = await supabase
        .from("product_list")
        .select("*")
        .eq("id", productId)
        .is("deleted_at", null)
        .single();

    if (error && error.code === "PGRST116") {
        return null;
    }

    if (error) throw new Error(error.message);

    return toProductListDto(data);
}

export async function getTotalProductSummaryFromDb(supabase, metric = "totalProducts") {
    let query = supabase
        .from("product_list")
        .select("id", { count: "exact" })
        .is("deleted_at", null);

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data.length;
}