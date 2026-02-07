import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProductHistoryList } from "@/lib/services/inventory/product/history/getProductHistoryList";

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

        const productHistoryList = await getProductHistoryList(user.id);

        return NextResponse.json(
            { success: true, data: productHistoryList },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/inventory/v1/product-history/list error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
