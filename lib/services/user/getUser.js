import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export async function getUserById(userId) {
    const { data, error } = await supabase
        .from("users")
        .select("id, username")
        .eq("id", userId)
        .single();

    if (error) {
        toast.error("Supabase error: " + error.message);
        throw new Error(error.message);
    }

    return data;
}
