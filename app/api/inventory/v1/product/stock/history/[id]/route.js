import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getQuantityHistoryByProductId } from "@/lib/services/inventory/product_quantity/getQuantityHistoryByProductId";

export async function GET(req, context) {
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

        const params = await context.params;
        const { id } = params;
        const idNum = Number(id);

        if (!id || isNaN(idNum)) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product list ID must be a valid number",
                },
                { status: 400 },
            );
        }

        if (!Number.isInteger(idNum)) {
            return NextResponse.json(
                { success: false, error: "Product list ID must be an integer" },
                { status: 400 },
            );
        }

        if (idNum <= 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product list ID must be a positive integer",
                },
                { status: 400 },
            );
        }

        const history = await getQuantityHistoryByProductId(user.id, idNum);

        return NextResponse.json({ success: true, history }, { status: 200 });
    } catch (err) {
        console.error(
            "GET /api/inventory/v1/product/stock/history/[id] error:",
            err,
        );

        if (err.message.includes("not found")) {
            return NextResponse.json(
                { success: false, error: err.message },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
