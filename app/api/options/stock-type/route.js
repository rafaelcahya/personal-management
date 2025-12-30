import { getStockTypeOptions } from "@/lib/options/stockTypeOptions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const stockTypeOptions = await getStockTypeOptions();
        return (
            NextResponse.json({ success: true, option: stockTypeOptions }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        return (
            NextResponse.json({ error: err.message }),
            {
                status: 401,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
