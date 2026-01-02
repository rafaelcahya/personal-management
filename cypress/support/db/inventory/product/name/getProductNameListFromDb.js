import { toProductNameListDto } from "./productNameListDto";

export async function getProductNameListFromDb(supabase, productNameId) {
    const { data, error } = await supabase
        .from("product_name")
        .select("*")
        .eq("id", productNameId)
        .is("deleted_at", null)
        .single();

    if (error && error.code === "PGRST116") {
        return null;
    }

    if (error) throw new Error(error.message);

    return toProductNameListDto(data);
}
