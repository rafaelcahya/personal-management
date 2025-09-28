import { getUpdateEvent } from "@/lib/services/event/getUpdateEvent";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updateEvent = await getUpdateEvent(id, body);

        return new Response(JSON.stringify({ success: true, event: updateEvent }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (err) {
        return new Response(
            JSON.stringify({ success: false, error: err.message }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
