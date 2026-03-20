import { NextResponse } from "next/server";
import { updateProductUsage } from "@/lib/services/inventory/product_history/updateProductUsage";

export async function PATCH(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();

        const { depleted_quantity, end_usage_date } = body;

        if (!depleted_quantity || depleted_quantity <= 0) {
            return NextResponse.json(
                { error: "Depleted quantity must be greater than 0" },
                { status: 400 },
            );
        }

        if (!end_usage_date) {
            return NextResponse.json(
                { error: "End usage date is required" },
                { status: 400 },
            );
        }

        const updatedHistory = await updateProductUsage(id, {
            depleted_quantity: Number(depleted_quantity),
            end_usage_date,
        });

        return NextResponse.json({
            success: true,
            data: updatedHistory,
            message: "Product history updated successfully",
        });
    } catch (error) {
        console.error("Error updating product history:", error);
        return NextResponse.json(
            { error: error.message || "Failed to update product history" },
            { status: 500 },
        );
    }
}
