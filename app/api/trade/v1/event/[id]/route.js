import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSingleEvent } from "@/lib/services/event/getSingleEvent";

export async function GET(req, { params }) {
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

        const { id } = await params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Event ID is required" },
                { status: 400 },
            );
        }

        const idNum = Number(id);
        if (isNaN(idNum)) {
            return NextResponse.json(
                { success: false, error: "Event ID must be a valid number" },
                { status: 400 },
            );
        }

        if (!Number.isInteger(idNum)) {
            return NextResponse.json(
                { success: false, error: "Event ID must be an integer" },
                { status: 400 },
            );
        }

        if (idNum <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Event ID must be a positive integer",
                },
                { status: 400 },
            );
        }

        console.log(`Fetching Event with ID: ${idNum} for user: ${user.id}`);

        const Event = await getSingleEvent(user.id, idNum.toString());

        if (!Event) {
            return NextResponse.json(
                { success: false, error: "Event not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, event: Event },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/trade/v1/event/[id] error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
