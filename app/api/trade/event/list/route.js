import { getListEvent } from "@/lib/services/event/getListEvent";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const eventList = await getListEvent();
        return NextResponse.json({ success: true, eventList }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
