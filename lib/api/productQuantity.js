export async function createQuantityUpdate(payload) {
    const res = await fetch("/api/inventory/product/quantity/create", {
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

export async function getQuantityHistory(productListId) {
    const res = await fetch(
        `/api/inventory/product/quantity/history/${productListId}`,
        { cache: "no-store" },
    );

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.error || "Failed to fetch quantity history");
    }

    return data.history;
}
