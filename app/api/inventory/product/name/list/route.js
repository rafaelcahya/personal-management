import { getProductNameList } from "@/lib/services/inventory/product/name/getProductNameList";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const listProductName = await getProductNameList();
        return NextResponse.json(
            { success: true, productNames: listProductName },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
