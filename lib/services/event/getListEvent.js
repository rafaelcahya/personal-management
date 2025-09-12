import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export async function getListEvent() {
    const { data, error } = await supabase
        .from("event_list")
        .select("*")
        .order("event_date", { ascending: false });

    if (error) {
        toast.error("Supabase error:", error);
        throw new Error(error.message);
    }

    const list = data;

    return list;
}
