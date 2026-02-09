import { createClient } from "@/lib/supabase/server";

export async function getStockTypeOptions() {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("stock_type_option")
        .select("*")
        .order("stock_type_option", { ascending: true });

    if (error) {
        console.error("Failed to fetch stock type options:", error);
        throw new Error(error.message);
    }

    return data || [];
}
