import { getListBrand } from "@/lib/services/inventory/brand/getListBrand";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const listProductBrand = await getListBrand();
        return NextResponse.json(
            { success: true, productBrand: listProductBrand },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
