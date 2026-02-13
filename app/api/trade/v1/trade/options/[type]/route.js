import { NextResponse } from "next/server";
import { getAllTradeOptions } from "@/lib/services/trade/options/getTradeOptions";

export async function GET() {
    try {
        const options = await getAllTradeOptions();

        return NextResponse.json({ success: true, options }, { status: 200 });
    } catch (err) {
        console.error("GET /api/trade/v1/trade/options/all error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
