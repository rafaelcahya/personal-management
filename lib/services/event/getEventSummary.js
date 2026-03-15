import { createClient } from "@/lib/supabase/server";

export async function getEventSummary(userId) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const supabase = await createClient();
    const PAGE_SIZE = 1000;
    let allEvents = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from("event_list")
            .select("impact_direction, is_favorite")
            .eq("user_id", userId)
            .is("deleted_at", null)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            console.error("Failed to fetch event summary:", error);
            throw new Error(error.message || "Failed to fetch event summary");
        }

        allEvents = [...allEvents, ...(data || [])];
        hasMore = data?.length === PAGE_SIZE;
        from += PAGE_SIZE;
    }

    const totalEvents = allEvents.length;

    const totalBullish = allEvents.filter(
        (event) => event.impact_direction === "UP",
    ).length;

    const totalBearish = allEvents.filter(
        (event) => event.impact_direction === "DOWN",
    ).length;

    const totalFavorite = allEvents.filter(
        (event) => event.is_favorite === true,
    ).length;

    return {
        totalEvents,
        totalBullish,
        totalBearish,
        totalFavorite,
    };
}
