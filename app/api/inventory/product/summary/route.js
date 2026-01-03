import { NextResponse } from "next/server";
import { getProductList } from "@/lib/services/inventory/product/getProductList";

export async function GET() {
    try {
        const products = await getProductList();

        const totalProducts = Array.isArray(products) ? products.length : 0;

        return NextResponse.json({
            success: true,
            data: {
                totalProducts,
            },
        });
    } catch (err) {
        return NextResponse.json(
            { success: false, error: err?.message || String(err) },
            { status: 500 }
        );
    }
}
