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

export async function getTotalTransactionsFromDb(supabase) {
    const { data, error } = await supabase
        .from("fee_list")
        .select("*", { count: "exact" })
        .is("deleted_at", null);
    if (error) throw new Error(error.message);
    return { total_transactions: data.length };
}

export async function getTotalFeeFromDb(supabase) {
    const { data, error } = await supabase
        .from("fee_list")
        .select("fee")
        .is("deleted_at", null);

    if (error) throw new Error(error.message);

    const totalFee = data.reduce((sum, row) => sum + Number(row.fee || 0), 0);
    return { total_fee: totalFee };
}
