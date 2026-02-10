import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getQuickViewData } from "@/lib/services/trade/dashboard/getQuickViewData";

export async function GET(request) {
    try {
        const supabase = await createClient();

        // Get authenticated user
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

        // Get limit from query params
        const { searchParams } = new URL(request.url);
        const limit = parseInt(searchParams.get("limit") || "5");

        // Fetch data using existing services
        const data = await getQuickViewData(user.id, limit);

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (err) {
        console.error("GET /api/trade/dashboard/quick-view error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
