import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(req, { params }) {
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
                { success: false, error: "Invalid product name ID" },
                { status: 400 },
            );
        }

        const { data, error } = await supabase
            .from("product_name")
            .update({
                product_name_status: "deleted",
                deleted_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            })
            .eq("id", Number(id))
            .eq("user_id", user.id)
            .select()
            .single();

        if (error) {
            console.error("Delete error:", error);
            throw new Error(error.message);
        }

        if (!data) {
            return NextResponse.json(
                {
                    success: false,
                    error: "Product name not found or unauthorized",
                },
                { status: 404 },
            );
        }

        return NextResponse.json(
            { success: true, productName: data },
            { status: 200 },
        );
    } catch (err) {
        console.error(
            "DELETE /api/inventory/v1/product-name/delete error:",
            err,
        );
        return NextResponse.json(
            { success: false, error: err.message || "Internal server error" },
            { status: 500 },
        );
    }
}
