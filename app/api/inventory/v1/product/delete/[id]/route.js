import { NextResponse } from "next/server";
import { getDeleteProduct } from "@/lib/services/inventory/product/getDeleteProduct";

export async function DELETE(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID provided" },
                { status: 400 }
            );
        }

        const deletedProduct = await getDeleteProduct(id);

        if (!deletedProduct) {
            return NextResponse.json(
                { success: false, error: "Product not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err) {
        console.error("DELETE /api/inventory/product/delete error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
