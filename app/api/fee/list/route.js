import { getListFee } from "@/lib/services/fee/getListFee";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const feeList = await getListFee();
        return NextResponse.json({ success: true, feeList }, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
