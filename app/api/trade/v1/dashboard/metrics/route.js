import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDashboardMetrics } from "@/lib/services/trade/dashboard/getDashboardMetrics";

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

        const metrics = await getDashboardMetrics();

        return NextResponse.json(
            { success: true, data: metrics },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/trade/v1/dashboard/metrics error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
