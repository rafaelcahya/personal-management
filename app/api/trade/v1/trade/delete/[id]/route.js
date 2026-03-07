import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteTrade } from "@/lib/services/trade/deleteTrade";

export async function DELETE(req, { params }) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        const { id } = await params;

        if (!id || isNaN(id) || parseInt(id) <= 0) {
            return NextResponse.json(
                { success: false, error: "Invalid trade ID format" },
                { status: 400 },
            );
        }

        await deleteTrade(user.id, id);

        return NextResponse.json(
            { success: true, message: "Trade deleted successfully" },
            { status: 200 },
        );
    } catch (err) {
        console.error("DELETE /api/trade/delete error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
