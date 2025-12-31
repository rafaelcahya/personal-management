import { NextResponse } from "next/server";
import { getUpdateBrand } from "@/lib/services/inventory/brand/getUpdateBrand";

export async function PUT(req, { params }) {
    try {
        const { id } = await params;

        if (!id || isNaN(Number(id))) {
            return NextResponse.json(
                { success: false, error: "Invalid brand ID provided" },
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

        const updateBrand = await getUpdateBrand(Number(id), body);

        if (!updateBrand) {
            return NextResponse.json(
                {
                    success: false,
                    error: `Brand with ID ${id} not found`,
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                brand: updateBrand,
            },
            { status: 200 }
        );
    } catch (err) {
        console.error("PUT /api/inventory/brand/update error:", err);
        return NextResponse.json(
            {
                success: false,
                error: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
