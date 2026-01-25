export async function createQuantityUpdate(payload) {
    const res = await fetch("/api/inventory/product/stock/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = await res.json();

    if (!res.ok) {
        const errorMsg = Array.isArray(data.error)
            ? data.error.join(", ")
            : data.error;
        throw new Error(errorMsg || "Failed to update quantity");
    }

    return data.data;
}