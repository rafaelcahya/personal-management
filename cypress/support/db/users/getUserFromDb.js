import { toUserDto } from "./userDto";

export async function getUserFromDb(supabase, userId) {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) throw new Error(error.message);

    return toUserDto(data);
}
