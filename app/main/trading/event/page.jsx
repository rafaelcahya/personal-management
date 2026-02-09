import { requireAuth } from "@/lib/auth/utils";
import { getEventList } from "@/lib/services/event/getEventList";
import EventsPageClient from "./EventsPageClient";

export default async function EventsPage() {
    const user = await requireAuth();

    if (!user || !user.id) {
        throw new Error("User ID is missing after authentication");
    }

    const events = await getEventList(user.id);

    return <EventsPageClient initialEvents={events} />;
}
