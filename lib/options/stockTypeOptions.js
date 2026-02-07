import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export async function getStockTypeOptions() {
    const { data, error } = await supabase
        .from("stock_type_options")
        .select("*");

    if (error) {
        toast.error("Supabase error:", error);
        throw new Error(error.message);
    }

    const options = data;

    return options;
}
