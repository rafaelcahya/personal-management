import { NextResponse } from "next/server";
import { getListFee } from "@/lib/services/fee/getListFee";

export async function GET() {
    try {
        const fee = await getListFee();

        const feeCount = fee.length;

        const totalFee = fee.reduce(
            (sum, item) => sum + Number(item.fee || 0),
            0
        );

        return NextResponse.json({
            success: true,
            data: {
                feeCount,
                totalFee,
            },
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err?.message || String(err) },
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}
