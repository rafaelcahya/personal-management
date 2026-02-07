import { NextResponse } from "next/server";
import { getQuantityHistoryByProductId } from "@/lib/services/inventory/product/quantity/getQuantityHistoryByProductId";

export async function GET(req, context) {
    try {
        const params = await context.params;
        const productListId = params.id;

        if (!productListId) {
            return NextResponse.json(
                { success: false, error: "Product list ID is required" },
                { status: 400 },
            );
        }

        const history = await getQuantityHistoryByProductId(productListId);

        return NextResponse.json({ success: true, history }, { status: 200 });
    } catch (err) {
        console.error("GET /api/inventory/product/stock/history error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
