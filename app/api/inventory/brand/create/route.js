import { NextResponse } from "next/server";
import { getCreateBrand } from "../../../../../lib/services/inventory/brand/getCreateBrand";

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

        const requiredFields = ["brand", "note", "brand_status", "brand_image"];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field] || body[field].toString().trim() === "") {
                validationErrors.push(
                    `${field.replaceAll("_", " ")} is required`
                );
            }
        });

        if (validationErrors.length > 0) {
            return NextResponse.json(
                {
                    success: false,
                    error: validationErrors,
                },
                { status: 400 }
            );
        }

        const newBrand = await getCreateBrand(
            body.brand,
            body.note,
            body.brand_status,
            body.brand_image
        );

        return NextResponse.json(
            { success: true, brand: newBrand },
            { status: 200 }
        );
    } catch (err) {
        console.error("POST /api/inventory/brand/create error:", err);
        return NextResponse.json(
            { success: false, error: "Internal server error" },
            { status: 500 }
        );
    }
}
