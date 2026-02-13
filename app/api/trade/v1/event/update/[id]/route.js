import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateEvent } from "@/lib/services/event/updateEvent";

export async function PUT(req, { params }) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = params;
        const body = await req.json();

        const updatedEvent = await updateEvent(user.id, id, body);

        return NextResponse.json(
            { success: true, event: updatedEvent },
            { status: 200 },
        );
    } catch (err) {
        console.error("PUT /api/event/v1/event/update error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
