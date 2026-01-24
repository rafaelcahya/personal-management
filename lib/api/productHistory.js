export async function getProductHistoryByProductListId(productListId) {
    const res = await fetch(`/api/inventory/product/history/${productListId}`, {
        cache: "no-store",
    });

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.error || "Failed to fetch product history");
    }
    return data.products;
}

export async function getProductHistory() {
    const res = await fetch(`/api/inventory/product/history/list`, {
        cache: "no-store",
    });

    const data = await res.json();

    if (!data.success) {
        throw new Error(data.error || "Failed to fetch product history");
    }
    return data.productHistories;
}

export async function updateProductUsage(historyId, data) {
    const res = await fetch(
        `/api/inventory/product/history/update/${historyId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        },
    );

    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update product history");
    }

    const result = await res.json();
    return result.data;
}