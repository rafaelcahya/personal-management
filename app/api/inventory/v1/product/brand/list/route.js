import { getProductBrandList } from "@/lib/services/inventory/product/brand/getProductBrandList";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const productBrandList = await getProductBrandList();
        return NextResponse.json(
            { success: true, productBrands: productBrandList },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
