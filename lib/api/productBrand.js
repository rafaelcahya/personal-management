export async function getProductBrandSummary() {
    const res = await fetch("/api/inventory/product/brand/summary");
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error || "Failed to fetch summary");
    }
    return data.data;
}

export async function getProductBrands() {
    const res = await fetch("/api/inventory/product/brand/list", {
        cache: "no-store",
    });
    const data = await res.json();
    if (!data.success) {
        throw new Error(data.error || "Failed to fetch product brands");
    }
    return data.productBrands;
}

export async function addProductBrand(payload) {
    const res = await fetch("/api/inventory/product/brand/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(data.error || "Failed to create product brand");
    return data;
}

export async function updateProductBrand(id, payload) {
    const res = await fetch(`/api/inventory/product/brand/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(data.error || "Failed to update product brand");
    return data;
}

export async function deleteProductBrand(id) {
    const res = await fetch(`/api/inventory/product/brand/delete/${id}`, {
        method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok)
        throw new Error(data.error || "Failed to delete product brand");
    return data;
}
