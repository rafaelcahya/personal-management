import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/services/trade/settings/getSettings";

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

        // Fetch settings
        const settingsList = await getSettings(user.id);

        return NextResponse.json(
            {
                success: true,
                settingsList,
            },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/trade/settings/list error:", err);
        return NextResponse.json(
            {
                success: false,
                error: err.message || "Internal server error",
            },
            { status: 500 },
        );
    }
}
