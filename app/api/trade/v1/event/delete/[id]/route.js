import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteEvent } from "@/lib/services/event/deleteEvent";

export async function DELETE(req, { params }) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user || !user.id) {
            return NextResponse.json(
                { success: false, error: "User not authenticated" },
                { status: 401 },
            );
        }

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Event ID is required" },
                { status: 400 },
            );
        }

        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return NextResponse.json(
                { success: false, error: "Invalid event ID format" },
                { status: 400 },
            );
        }

        await deleteEvent(user.id, id);

        return NextResponse.json(
            { success: true, message: "Event deleted successfully" },
            { status: 200 },
        );
    } catch (err) {
        console.error("DELETE /api/event/v1/event/delete error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Failed to delete event" },
            { status: 500 },
        );
    }
}
