import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "@/lib/services/inventory/product/deleteProduct";

export async function DELETE(req, { params }) {
    try {
        const supabase = await createClient();

        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 },
            );
        }

        const productId = parseInt(params.id);

        if (!productId || isNaN(productId)) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID" },
                { status: 400 },
            );
        }

        const deletedProduct = await deleteProduct(user.id, productId);

        return NextResponse.json(
            {
                success: true,
                data: deletedProduct,
                message: "Product deleted successfully",
            },
            { status: 200 },
        );
    } catch (err) {
        console.error("DELETE product error:", err);
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
