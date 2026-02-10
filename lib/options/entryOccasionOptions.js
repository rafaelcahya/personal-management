export async function getEntryOccasionOptions() {
    const { data, error } = await supabase
        .from("entry_occasion_options")
        .select("*");

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    const options = data;

    return options;
}
