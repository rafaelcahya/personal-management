import { getProductHistoryList } from "@/lib/services/inventory/product/history/getProductHistoryList";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const listProductHistory = await getProductHistoryList();
        return NextResponse.json(
            { success: true, productHistories: listProductHistory },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
