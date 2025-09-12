import { getListEvent } from "@/lib/services/event/getListEvent";

export async function GET() {
    try {
        const eventList = await getListEvent();
        return new Response(JSON.stringify({ success: true, eventList }), {
            status: 200,
            headers: {
                "Cache-Control": "no-store",
            },
        });
    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 401,
        });
    }
}
