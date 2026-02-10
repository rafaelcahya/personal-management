import { NextResponse } from "next/server";
import { getDashboardMetrics } from "@/lib/services/trade/dashboard/getDashboardMetrics";

export async function GET() {
    try {
        const metrics = await getDashboardMetrics();

        return NextResponse.json(
            { success: true, data: metrics },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/trade/metrics error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
