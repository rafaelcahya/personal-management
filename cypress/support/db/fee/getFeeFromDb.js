import { toFeeDto } from "./feeDto";

export async function getFeeFromDb(supabase, feeId) {
    const { data, error } = await supabase
        .from("fee_list")
        .select("*")
        .eq("id", feeId)
        .is("deleted_at", null)
        .single();

    if (error && error.code === "PGRST116") {
        return null;
    }

    if (error) throw new Error(error.message);

    return toFeeDto(data);
}
