export async function getInventoryDashboard() {
    const res = await fetch("/api/inventory/v1/dashboard", {
        cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
        const errorMsg = Array.isArray(data.error)
            ? data.error.join(", ")
            : data.error;
        throw new Error(errorMsg || "Failed to fetch inventory dashboard");
    }

    return data.data;
}
