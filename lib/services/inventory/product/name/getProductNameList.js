import { createClient } from "@/lib/supabase/server";

export async function getProductNameList() {
    const supabase = await createClient();

    const {
        data: { user },
        error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
        throw new Error("Unauthorized");
    }

    const { data, error } = await supabase
        .from("product_name")
        .select("*")
        .eq("user_id", user.id)
        .order("product_name", { ascending: true });

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return data;
}
