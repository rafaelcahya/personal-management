import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getEventList } from "@/lib/services/event/getEventList";

export async function GET() {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
            console.error("Auth error:", authError);
            return NextResponse.json(
                { success: false, error: "Authentication failed" },
                { status: 401 },
            );
        }

        if (!user || !user.id) {
            console.error("No user found or user.id is undefined");
            return NextResponse.json(
                { success: false, error: "User not authenticated" },
                { status: 401 },
            );
        }

        const events = await getEventList(user.id);

        return NextResponse.json({ success: true, events }, { status: 200 });
    } catch (err) {
        console.error("GET /api/trade/v1/event/list error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
