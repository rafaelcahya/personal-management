import { getListProduct } from "@/lib/services/inventory/product/getListProduct";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const listProduct = await getListProduct();
        return NextResponse.json(
            { success: true, products: listProduct },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
