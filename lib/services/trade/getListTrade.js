import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export async function getListTrade() {
    const { data, error } = await supabase
        .from("trade_list")
        .select("*")
        .order("trade_date", { ascending: false });

    if (error) {
        toast.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data;
}
