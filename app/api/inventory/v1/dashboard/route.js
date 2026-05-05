import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getInventoryDashboard } from "@/lib/services/inventory/dashboard/getInventoryDashboard";

export async function GET() {
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

        const result = await getInventoryDashboard(user.id);

        return NextResponse.json(
            { success: true, data: result },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/inventory/v1/dashboard error:", err);
        return NextResponse.json(
            { success: false, error: err?.message || "Internal Server Error" },
            { status: 500 },
        );
    }
}
