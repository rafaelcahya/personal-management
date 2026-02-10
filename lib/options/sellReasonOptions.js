export async function getSellReasonOptions() {
    const { data, error } = await supabase
        .from("sell_reason_options")
        .select("*");

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    const options = data;

    return options;
}
