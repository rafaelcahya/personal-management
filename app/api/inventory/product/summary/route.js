import { NextResponse } from "next/server";
import { getListProduct } from "@/lib/services/inventory/product/getListProduct";

export async function GET() {
    try {
        const products = await getListProduct();

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
