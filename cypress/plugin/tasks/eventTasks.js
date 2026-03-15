import {
    getSingleEventFromDb,
    getEventsFromDb,
    getEventSummaryFromDb,
} from "../../support/db/trading/event/eventDb.js";

export const eventTasks = (supabaseAdmin) => ({
    async getSingleEventFromDb({ eventId, userId }) {
        return getSingleEventFromDb(supabaseAdmin, eventId, userId);
    },

    async getEventsFromDb({ userId }) {
        return getEventsFromDb(supabaseAdmin, userId);
    },

    async getEventSummaryFromDb({ userId }) {
        return getEventSummaryFromDb(supabaseAdmin, userId);
    },
});
