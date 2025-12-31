import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export async function getListProduct() {
    const { data, error } = await supabase
        .from("product_list")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        toast.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data;
}
