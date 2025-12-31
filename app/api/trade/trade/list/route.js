import { getListTrade } from "@/lib/services/trade/getListTrade";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const listTrade = await getListTrade();
        return NextResponse.json(
            { success: true, trade: listTrade },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
