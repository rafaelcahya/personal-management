import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { favoriteProduct } from "@/lib/services/inventory/product/favoriteProduct";

export async function PATCH(req, { params }) {
    try {
        const supabase = await createClient();

        // Autentikasi user
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

        // Get product ID from URL params
        const productId = parseInt(params.id);

        if (!productId || isNaN(productId)) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID" },
                { status: 400 },
            );
        }

        // Parse request body
        const body = await req.json();
        const { isFavorite } = body;

        if (typeof isFavorite !== "boolean") {
            return NextResponse.json(
                { success: false, error: "isFavorite must be a boolean" },
                { status: 400 },
            );
        }

        // Call service
        const updatedProduct = await favoriteProduct(
            user.id,
            productId,
            isFavorite,
        );

        return NextResponse.json(
            { success: true, data: updatedProduct },
            { status: 200 },
        );
    } catch (err) {
        console.error(
            "PATCH /api/inventory/v1/product/[id]/favorite error:",
            err,
        );
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
