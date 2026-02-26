import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSingleTrade } from "@/lib/services/trade/getSingleTrade";

export async function GET(req, { params }) {
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

        // Get trade ID from params
        const { id } = params;

        // ✅ Updated validation logic
        if (!id) {
            return NextResponse.json(
                { success: false, error: "Trade ID is required" },
                { status: 400 },
            );
        }

        const idNum = Number(id);
        if (isNaN(idNum)) {
            return NextResponse.json(
                { success: false, error: "Trade ID must be a valid number" },
                { status: 400 },
            );
        }

        if (!Number.isInteger(idNum)) {
            // ✅ Test case specific error
            return NextResponse.json(
                { success: false, error: "Trade ID must be an integer" },
                { status: 400 },
            );
        }

        if (idNum <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Trade ID must be a positive integer",
                },
                { status: 400 },
            );
        }

        console.log(`Fetching trade with ID: ${idNum} for user: ${user.id}`);

        // Get trade from database
        const trade = await getSingleTrade(user.id, idNum.toString());

        if (!trade) {
            return NextResponse.json(
                { success: false, error: "Trade not found" },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, data: trade },
            { status: 200 },
        );
    } catch (err) {
        console.error("GET /api/trade/v1/trade/[id] error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
