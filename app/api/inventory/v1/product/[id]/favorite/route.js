import { NextResponse } from "next/server";
import { getFavoriteProduct } from "@/lib/services/inventory/product/getFavoriteProduct";

export async function PATCH(req, { params }) {
    try {
        const { id } = await params;

        // Validate ID
        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid product ID provided" },
                { status: 400 },
            );
        }

        // Parse body
        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            return NextResponse.json(
                { success: false, error: "Invalid JSON in request body" },
                { status: 400 },
            );
        }

        if (!body) {
            return NextResponse.json(
                { success: false, error: "Request body is required" },
                { status: 400 },
            );
        }

        // Validate required field
        if (body.isFavorite === undefined || body.isFavorite === null) {
            return NextResponse.json(
                { success: false, error: "isFavorite field is required" },
                { status: 400 },
            );
        }

        // Validate isFavorite type
        if (typeof body.isFavorite !== "boolean") {
            return NextResponse.json(
                { success: false, error: "isFavorite must be a boolean value" },
                { status: 400 },
            );
        }

        // Prepare payload
        const payload = {
            is_favorite: body.isFavorite,
        };

        // Update via service
        const updatedProduct = await getFavoriteProduct(Number(id), payload);

        if (!updatedProduct) {
            return NextResponse.json(
                { success: false, error: `Product with ID ${id} not found` },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                product: updatedProduct,
                message: body.isFavorite
                    ? "Added to favorites"
                    : "Removed from favorites",
            },
            { status: 200 },
        );
    } catch (err) {
        console.error(
            "PATCH /api/inventory/v1/product/[id]/favorite error:",
            err,
        );
        return NextResponse.json(
            { success: false, error: err.message || "Internal Server Error" },
            { status: 500 },
        );
    }
}
