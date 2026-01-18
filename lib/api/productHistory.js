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
