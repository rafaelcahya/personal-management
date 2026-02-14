import { NextResponse } from "next/server";
import { getBuyReasonOptions } from "@/lib/services/trade/options/getBuyReasonOptions";

export async function GET() {
    try {
        const options = await getBuyReasonOptions();

        return NextResponse.json({ success: true, options }, { status: 200 });
    } catch (err) {
        console.error("GET /api/trade/v1/options/buy-reason error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
