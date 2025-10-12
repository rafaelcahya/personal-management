import { toEventDto } from "./eventDto";

export async function getEventFromDb(supabase, eventId) {
    const { data, error } = await supabase
        .from("event_list")
        .select("*")
        .eq("id", eventId)
        .is("deleted_at", null)
        .single();

    if (error && error.code === "PGRST116") {
        return null;
    }

    if (error) throw new Error(error.message);

    return toEventDto(data);
}
