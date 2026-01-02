import { getBuyReasonOptions } from "@/lib/options/buyReasonOptions";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const buyReasonOptions = await getBuyReasonOptions();
        return NextResponse.json(
            {
                success: true,
                options: Array.isArray(buyReasonOptions)
                    ? buyReasonOptions
                    : [],
            },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
