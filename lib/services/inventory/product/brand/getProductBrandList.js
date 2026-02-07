import { createClient } from "@/lib/supabase/client";

export async function getProductBrandList() {
    const { data, error } = await supabase
        .from("product_brand")
        .select("*")
        .order("brand", { ascending: true });

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data;
}
