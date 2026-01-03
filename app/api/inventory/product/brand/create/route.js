import { NextResponse } from "next/server";
import { getCreateProductBrand } from "../../../../../../lib/services/inventory/product/brand/getCreateProductBrand";

export async function POST(req) {
    try {
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

        const requiredFields = ["brand"];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`
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
                { status: 400 }
            );
        }

        const newProductBrand = await getCreateProductBrand(
            body.brand,
            body.note,
            body.brand_status,
            body.deleted_at
        );

        return NextResponse.json(
            { success: true, productBrand: newProductBrand },
            { status: 200 }
        );
    } catch (err) {
        console.error("POST /api/inventory/product/brand/create error:", err);
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 }
        );
    }
}
