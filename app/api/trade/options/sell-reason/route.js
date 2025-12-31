import { getSellReasonOptions } from "@/lib/options/sellReasonOptions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const sellReasonOptions = await getSellReasonOptions();
        return NextResponse.json(
            { success: true, option: sellReasonOptions },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
