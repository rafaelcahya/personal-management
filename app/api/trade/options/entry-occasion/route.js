import { NextResponse } from "next/server";
import { getEntryOccasionOptions } from "@/lib/services/trade/options/getEntryOccasionOptions";

export async function GET() {
    try {
        const options = await getEntryOccasionOptions();

        return NextResponse.json({ success: true, options }, { status: 200 });
    } catch (err) {
        console.error("GET /api/trade/options/entry-occasion error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
