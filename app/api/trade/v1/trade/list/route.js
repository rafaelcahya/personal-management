import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTradeList } from "@/lib/services/trade/getTradeList";

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

        const trades = await getTradeList(user.id);

        return NextResponse.json({ success: true, trades }, { status: 200 });
    } catch (err) {
        console.error("GET /api/trade/list error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
