import { NextResponse } from "next/server";
import { getDeleteFee } from "@/lib/services/fee/getDeleteFee";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid fee ID provided" },
                { status: 400 }
            );
        }

        const deletedFee = await getDeleteFee(id);

        if (!deletedFee) {
            return NextResponse.json(
                { success: false, error: "Fee not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("DELETE /api/trade/fee/delete error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
