import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteEvent } from "@/lib/services/event/deleteEvent";

export async function DELETE(req, { params }) {
    try {
        const supabase = await createClient();

        // Authenticate user
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

        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Event ID is required" },
                { status: 400 },
            );
        }

        // Soft delete event
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
