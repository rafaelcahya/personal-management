import { NextResponse } from "next/server";
import { getDeleteTrade } from "@/lib/services/trade/getDeleteTrade";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, message: "Invalid trade ID provided" },
                { status: 400 }
            );
        }

        const deletedTrade = await getDeleteTrade(id);

        if (!deletedTrade) {
            return NextResponse.json(
                { success: false, message: "Trade not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true },
            { status: 200 }
        );
    } catch (err) {
        console.error("DELETE /api/trade/delete error:", err);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
