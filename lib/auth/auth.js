import bcrypt from "bcryptjs";
import { supabase } from "../../supabase/client";

export async function loginUser(username, password) {
    const { data: user, error } = await supabase
        .from("users")
        .select("*")
        .eq("username", username)
        .single();

    if (error || !user) throw new Error("User not found");

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new Error("Invalid password");

    return user;
}
