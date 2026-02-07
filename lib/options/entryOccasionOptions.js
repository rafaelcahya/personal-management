import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export async function getEntryOccasionOptions() {
    const { data, error } = await supabase
        .from("entry_occasion_options")
        .select("*");

    if (error) {
        toast.error("Supabase error:", error);
        throw new Error(error.message);
    }

    const options = data;

    return options;
}
