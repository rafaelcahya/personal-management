export async function getEntrySessionOptions() {
    const { data, error } = await supabase
        .from("entry_session_options")
        .select("*");

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    const options = data;

    return options;
}
