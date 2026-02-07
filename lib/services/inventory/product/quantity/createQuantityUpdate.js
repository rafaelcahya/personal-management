import { createClient } from "@/lib/supabase/server";

export async function createQuantityUpdate(userId, payload) {
    const supabase = await createClient();

    console.log("🔍 Service - userId:", userId);
    console.log("🔍 Service - payload:", payload);

    // Verify product exists and belongs to user
    const { data: product, error: productError } = await supabase
        .from("product_list")
        .select("id, quantity")
        .eq("id", payload.product_list_id)
        .eq("user_id", userId)
        .single();

    console.log("🔍 Product query result:", product);
    console.log("🔍 Product query error:", productError);

    if (productError) {
        console.error("Product fetch error:", productError);
        throw new Error(`Product not found: ${productError.message}`);
    }

    if (!product) {
        throw new Error("Product not found or unauthorized");
    }

    // Prepare insert data
    const insertData = {
        user_id: userId,
        product_list_id: parseInt(payload.product_list_id), // ← Ensure integer
        quantity_added: parseInt(payload.quantity_added),
        price: parseFloat(payload.price),
        purchase_date: payload.purchase_date,
        note: payload.note || "",
        created_at: new Date().toISOString(),
    };

    console.log("📦 Insert data:", insertData);

    // Insert quantity update record
    const { data: quantityUpdate, error: insertError } = await supabase
        .from("product_quantity")
        .insert(insertData)
        .select()
        .single();

    if (insertError) {
        console.error("Insert quantity update error:", insertError);
        throw new Error(`Failed to insert: ${insertError.message}`);
    }

    console.log("✅ Quantity update inserted:", quantityUpdate);

    // Update product_list quantity
    const newQuantity = product.quantity + parseInt(payload.quantity_added);

    console.log(
        "🔄 Updating product quantity from",
        product.quantity,
        "to",
        newQuantity,
    );

    const { error: updateError } = await supabase
        .from("product_list")
        .update({
            quantity: newQuantity,
            updated_at: new Date().toISOString(),
        })
        .eq("id", payload.product_list_id)
        .eq("user_id", userId);

    if (updateError) {
        console.error("Update product quantity error:", updateError);
        throw new Error(`Failed to update quantity: ${updateError.message}`);
    }

    console.log("✅ Product quantity updated successfully");

    return quantityUpdate;
}
