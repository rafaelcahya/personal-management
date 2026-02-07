import { createClient } from "@/lib/supabase/client";

export async function getProductById(id) {
    const { data, error } = await supabase
        .from("product_list")
        .select("*")
        .eq("id", Number(id))
        .single();

    if (error) throw new Error(error.message);

    return data;
}
