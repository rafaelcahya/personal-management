import { getTradeList } from "@/lib/services/trade/getTradeList";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const listTrade = await getTradeList();
        return NextResponse.json(
            { success: true, trades: listTrade },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
