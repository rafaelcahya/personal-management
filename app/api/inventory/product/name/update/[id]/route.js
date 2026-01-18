import { NextResponse } from "next/server";
import { getUpdateProductName } from "@/lib/services/inventory/product/name/getUpdateProductName";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid product name ID provided" },
                { status: 400 }
            );
        }

        let body;
        try {
            body = await req.json();
        } catch (parseError) {
            return NextResponse.json(
                { success: false, error: "Invalid JSON in request body" },
                { status: 400 }
            );
        }

        if (!body) {
            return NextResponse.json(
                { success: false, error: "Request body is required" },
                { status: 400 }
            );
        }

        const requiredFields = ["product_name"];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`
                );
            }
        });

        if (body.product_name === "deleted") {
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
                { status: 400 }
            );
        }

        const updateProductName = await getUpdateProductName(Number(id), body);

        if (!updateProductName) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Product name with ID ${id} not found`,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                productName: updateProductName,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("PUT /api/inventory/product/name/update error:", err);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
