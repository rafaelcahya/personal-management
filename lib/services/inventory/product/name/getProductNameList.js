import { supabase } from "@/lib/supabase/client";

export async function getProductNameList() {
    const { data, error } = await supabase
        .from("product_name")
        .select("*")
        .order("product_name", { ascending: true });

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data;
}
