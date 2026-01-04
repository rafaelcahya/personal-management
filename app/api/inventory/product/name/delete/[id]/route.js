import { NextResponse } from "next/server";
import { getDeleteProductName } from "@/lib/services/inventory/product/name/getDeleteProductName";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid product name ID provided" },
                { status: 400 }
            );
        }

        const deletedProductName = await getDeleteProductName(id);

        if (!deletedProductName) {
            return NextResponse.json(
                { success: false, error: "Product name not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { success: true, data: deletedProductName },
            { status: 200 }
        );
    } catch (err) {
        console.error("DELETE /api/inventory/product/name/delete error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
