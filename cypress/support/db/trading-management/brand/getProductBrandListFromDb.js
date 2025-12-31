import { toProductBrandListDto } from "./productBrandListDto";

export async function getProductBrandListFromDb(supabase, brandId) {
    const { data, error } = await supabase
        .from("product_brand")
        .select("*")
        .eq("id", brandId)
        .is("deleted_at", null)
        .single();

    if (error && error.code === "PGRST116") {
        return null;
    }

    if (error) throw new Error(error.message);

    return toProductBrandListDto(data);
}