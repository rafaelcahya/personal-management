import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getQuickViewData } from "@/lib/services/trade/dashboard/getQuickViewData";

export async function GET(req) {
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

        const { searchParams } = new URL(req.url);
        const limit = parseInt(searchParams.get("limit") || "5", 10);

        if (limit < 1 || limit > 50) {
            return NextResponse.json(
                { success: false, error: "Limit must be between 1 and 50" },
                { status: 400 },
            );
        }

        const quickViewData = await getQuickViewData(user.id, limit);

        return NextResponse.json(
            { success: true, data: quickViewData },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/trade/v1/dashboard/quick-view error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
