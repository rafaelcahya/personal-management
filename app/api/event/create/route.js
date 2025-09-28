import { getCreateEvent } from "@/lib/services/event/getCreateEvent";

export async function POST(req) {
    try {
        const { event_description, impact_direction, event_date } =
            await req.json();

        const newEvent = await getCreateEvent(
            event_description,
            impact_direction,
            event_date
        );

        return new Response(
            JSON.stringify({ success: true, event: newEvent }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
        });
    }
}
