import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getFeeSummary } from "@/lib/services/fee/getFeeSummary";

export async function GET() {
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

        const summary = await getFeeSummary(user.id);

        return NextResponse.json(
            { success: true, ...summary },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/trade/v1/fee/summary error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
