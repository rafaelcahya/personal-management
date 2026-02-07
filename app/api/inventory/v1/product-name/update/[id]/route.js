import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { updateProductName } from "@/lib/services/inventory/product/name/updateProductName";

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
                { success: false, error: "Invalid product name ID provided" },
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

        const requiredFields = ["product_name"];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`,
                );
            }
        });

        if (body.product_name_status === "deleted") {
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

        const updatedProductName = await updateProductName(
            Number(id),
            body,
            user.id,
        );

        if (!updatedProductName) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Product name with ID ${id} not found or unauthorized`,
                },
                { status: 404 },
            );
        }

        return NextResponse.json(
            {
                success: true,
                productName: updatedProductName,
            },
            { status: 200 },
        );
    } catch (err) {
        console.error("PUT /api/inventory/v1/product-name/update error:", err);
        return NextResponse.json(
            {
                success: false,
                error: err.message || "Internal Server Error",
            },
            { status: 500 },
        );
    }
}
