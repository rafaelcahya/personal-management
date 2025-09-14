import { supabase } from "@/lib/supabase/client";
import { toast } from "sonner";

export async function getUserById(userId) {
    const { data, error } = await supabase
        .from("users")
        .select("id, username, nickname, avatar")
        .eq("id", userId)
        .single();

    if (error) {
        toast.error("Supabase error: " + error.message);
        throw new Error(error.message);
    }

    return data;
}

export async function updateUserProfile(userId, values) {
    const { error } = await supabase
        .from("users")
        .update(values)
        .eq("id", userId);

    if (error) {
        toast.error("Supabase error: " + error.message);
        throw new Error(error.message);
    }
    return true;
}

export async function uploadAvatar(userId, file) {
    const fileExt = file.name.split(".").pop();
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    // Upload ke bucket 'avatar'
    const { error } = await supabase.storage
        .from("avatar")
        .upload(filePath, file);
    if (error) throw new Error(error.message);

    // Ambil URL publik
    const { data } = supabase.storage.from("avatar").getPublicUrl(filePath);
    if (!data?.publicUrl) throw new Error("Failed to get public URL");

    return data.publicUrl;
}
