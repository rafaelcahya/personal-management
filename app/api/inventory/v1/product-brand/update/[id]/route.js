import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateProductBrand } from "@/lib/services/inventory/product/brand/updateProductBrand";

export async function PUT(req, { params }) {
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

        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid product brand ID provided" },
                { status: 400 },
            );
        }

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

        const requiredFields = ["brand", "brand_status"];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`,
                );
            }
        });

        if (body.brand_status === "deleted") {
            if (!body.deleted_at) {
                body.deleted_at = new Date().toISOString();
            } else if (isNaN(Date.parse(body.deleted_at))) {
                validationErrors.push("deleted_at must be valid ISO date");
            }
        }

        if (validationErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: validationErrors,
                },
                { status: 400 },
            );
        }

        const updatedProductBrand = await updateProductBrand(
            Number(id),
            body,
            user.id,
        );

        if (!updatedProductBrand) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Product brand with ID ${id} not found`,
                },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                productBrand: updatedProductBrand,
            },
            { status: 200 },
        );
    } catch (err) {
        console.error("PUT /api/inventory/v1/product-brand/update error:", err);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error",
            },
            { status: 500 },
        );
    }
}
