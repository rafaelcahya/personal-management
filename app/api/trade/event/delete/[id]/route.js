import { getDeleteEvent } from "@/lib/services/event/getDeleteEvent";
import { NextResponse } from "next/server";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid event ID provided" },
                { status: 400 }
            );
        }

        const deletedEvent = await getDeleteEvent(id);

        if (!deletedEvent) {
            return NextResponse.json(
                { success: false, error: "Event not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("DELETE /api/trade/trade/trade/event/delete error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
