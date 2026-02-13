import { getFeeList } from "@/lib/services/fee/getFeeList";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const feeList = await getFeeList();
        return NextResponse.json(
            { success: true, fees: feeList },
            { status: 200 },
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
