import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export async function getListFee() {
    const { data, error } = await supabase
        .from("fee_list")
        .select("*")
        .order("fee_date", { ascending: false });

    if (error) {
        toast.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data;
}
