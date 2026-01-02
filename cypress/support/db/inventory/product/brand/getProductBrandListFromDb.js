import { toProductBrandListDto } from "./productBrandListDto";

export async function getProductBrandListFromDb(supabase, productBrandId) {
    const { data, error } = await supabase
        .from("product_brand")
        .select("*")
        .eq("id", productBrandId)
        .is("deleted_at", null)
        .single();

    if (error && error.code === "PGRST116") {
        return null;
    }

    if (error) throw new Error(error.message);

    return toProductBrandListDto(data);
}
