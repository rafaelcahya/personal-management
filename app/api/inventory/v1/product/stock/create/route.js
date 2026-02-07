import { NextResponse } from "next/server";
import { createQuantityUpdate } from "@/lib/services/inventory/product/quantity/getCreateQuantity";

export async function POST(req) {
    try {
        const body = await req.json();

        const requiredFields = [
            "product_list_id",
            "quantity_added",
            "price",
            "purchase_date",
        ];

        const validationErrors = [];
        requiredFields.forEach((field) => {
            if (!body[field]) {
                validationErrors.push(
                    `${field.charAt(0).toUpperCase() + field.slice(1).toLowerCase().replaceAll("_", " ")} is required`,
                );
            }
        });

        if (body.quantity_added && body.quantity_added <= 0) {
            validationErrors.push("Quantity added must be greater than 0");
        }

        if (body.price && body.price < 0) {
            validationErrors.push("Price cannot be negative");
        }

        if (validationErrors.length > 0) {
            return NextResponse.json(
                { success: false, error: validationErrors },
                { status: 400 },
            );
        }

        const result = await createQuantityUpdate(body);

        return NextResponse.json(
            { success: true, data: result },
            { status: 200 },
        );
    } catch (err) {
        console.error(
            "POST /api/inventory/v1/product/stock/create error:",
            err,
        );
        return NextResponse.json(
            { success: false, error: err.message },
            { status: 500 },
        );
    }
}
