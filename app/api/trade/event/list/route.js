import { getEventList } from "@/lib/services/event/getEventList";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const eventList = await getEventList();
        return NextResponse.json(
            { success: true, events: eventList },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
