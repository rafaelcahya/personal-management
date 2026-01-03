import { getProductNameList } from "@/lib/services/inventory/product/name/getProductNameList";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const productNameList = await getProductNameList();
        return NextResponse.json(
            { success: true, productNames: productNameList },
            { status: 200 }
        );
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 401 });
    }
}
