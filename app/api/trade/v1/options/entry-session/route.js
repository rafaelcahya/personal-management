import { NextResponse } from "next/server";
import { getEntrySessionOptions } from "@/lib/services/trade/options/getEntrySessionOptions";

export async function GET() {
    try {
        const options = await getEntrySessionOptions();

        return NextResponse.json({ success: true, options }, { status: 200 });
    } catch (err) {
        console.error("GET /api/trade/v1/options/entry-session error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
