export async function fetchTradeList() {
    const res = await fetch("/api/trade/v1/trade/list", {
        cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to fetch trades");
    }

    return data.trades || [];
}

export async function createTrade(payload) {
    const res = await fetch("/api/trade/v1/trade/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to create trade");
    }

    return data;
}

export async function updateTrade(id, payload) {
    const res = await fetch(`/api/trade/v1/trade/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to update trade");
    }

    return data;
}

export async function deleteTrade(id) {
    const res = await fetch(`/api/trade/v1/trade/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to delete trade");
    }

    return data;
}

export async function fetchAllTradeOptions() {
    const res = await fetch("/api/trade/v1/trade/options/all", {
        cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to fetch all options");
    }

    return (
        data.options || {
            stockType: [],
            entrySession: [],
            entryOccasion: [],
            buyReason: [],
            sellReason: [],
        }
    );
}

export async function fetchTradeOption(optionType) {
    const res = await fetch(`/api/trade/v1/trade/options/${optionType}`, {
        cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || `Failed to fetch ${optionType} options`);
    }

    return data.options || [];
}

export async function fetchStockTypeOptions() {
    return fetchTradeOption("stockType");
}

export async function fetchEntrySessionOptions() {
    return fetchTradeOption("entrySession");
}

export async function fetchEntryOccasionOptions() {
    return fetchTradeOption("entryOccasion");
}

export async function fetchBuyReasonOptions() {
    return fetchTradeOption("buyReason");
}

export async function fetchSellReasonOptions() {
    return fetchTradeOption("sellReason");
}
