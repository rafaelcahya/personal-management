import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateFee } from "@/lib/services/fee/updateFee";

export async function PUT(req, { params }) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user || !user.id) {
            return NextResponse.json(
                { success: false, error: "User not authenticated" },
                { status: 401 },
            );
        }

        const { id } = params;

        if (!id) {
            return NextResponse.json(
                { success: false, error: "Fee ID is required" },
                { status: 400 },
            );
        }

        const body = await req.json();

        const updatedFee = await updateFee(user.id, id, body);

        return NextResponse.json(
            { success: true, fee: updatedFee },
            { status: 200 },
        );
    } catch (err) {
        console.error("PUT /api/trade/v1/fee/update error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
