import { toUserDto } from "./userDto";

export async function getUserFromDb(supabase, userId) {
    const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .is("deleted_at", null)
        .single();

    if (error) throw new Error(error.message);

    return toUserDto(data);
}
