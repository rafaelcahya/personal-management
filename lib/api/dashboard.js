const BASE_URL = "/api/trade/v1/dashboard";

export async function fetchMetrics() {
    const res = await fetch(`${BASE_URL}/metrics`, {
        cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to fetch metrics");
    }

    return data.data;
}

export async function fetchQuickView(limit = 5) {
    const res = await fetch(`${BASE_URL}/quick-view?limit=${limit}`, {
        cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to fetch quick view data");
    }

    return data.data;
}
