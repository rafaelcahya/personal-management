const TABLE_NAME = "event_list";

/**
 * Get single events for a user from database
 */
export async function getSingleEventFromDb(supabase, eventId, userId) {
    const { data, error } = await supabase
        .from(TABLE_NAME)
        .select("*")
        .eq("id", eventId)
        .eq("user_id", userId)
        .is("deleted_at", null);

    if (error) {
        throw new Error(
            `DB query failed: ${error.message || error.details || error.hint || JSON.stringify(error)}`,
        );
    }

    return data || [];
}

/**
 * Get all events for a user from database
 */
export async function getEventsFromDb(supabase, userId) {
    if (!userId) {
        throw new Error("User ID is required");
    }

    const PAGE_SIZE = 1000;
    let allEvents = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*")
            .eq("user_id", userId)
            .is("deleted_at", null)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            throw new Error(
                `DB query failed: ${error.message || error.details || JSON.stringify(error)}`,
            );
        }

        allEvents = [...allEvents, ...(data || [])];
        hasMore = data?.length === PAGE_SIZE;
        from += PAGE_SIZE;
    }

    return allEvents;
}

export async function getEventSummaryFromDb(supabase, userId) {
    if (!userId) throw new Error("User ID is required");

    const PAGE_SIZE = 1000;
    let allEvents = [];
    let from = 0;
    let hasMore = true;

    while (hasMore) {
        const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("impact_direction, is_favorite")
            .eq("user_id", userId)
            .is("deleted_at", null)
            .range(from, from + PAGE_SIZE - 1);

        if (error) {
            throw new Error(
                `DB query failed: ${error.message || JSON.stringify(error)}`,
            );
        }

        allEvents = [...allEvents, ...(data || [])];
        hasMore = data?.length === PAGE_SIZE;
        from += PAGE_SIZE;
    }

    return {
        totalEvents: allEvents.length,
        totalBullish: allEvents.filter((e) => e.impact_direction === "UP")
            .length,
        totalBearish: allEvents.filter((e) => e.impact_direction === "DOWN")
            .length,
        totalFavorite: allEvents.filter((e) => e.is_favorite === true).length,
    };
}