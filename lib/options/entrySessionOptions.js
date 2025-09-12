import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export async function getEntrySessionOptions() {
    const { data, error } = await supabase
        .from("entry_session_options")
        .select("*");

    if (error) {
        toast.error("Supabase error:", error);
        throw new Error(error.message);
    }

    const options = data;

    return options;
}
