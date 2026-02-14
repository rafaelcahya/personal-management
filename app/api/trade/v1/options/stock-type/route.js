import { NextResponse } from "next/server";
import { getStockTypeOptions } from "@/lib/services/trade/options/getStockTypeOptions";

export async function GET() {
    try {
        const options = await getStockTypeOptions();

        return NextResponse.json({ success: true, options }, { status: 200 });
    } catch (err) {
        console.error("GET /api/trade/v1/options/stock-type error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
