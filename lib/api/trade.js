export async function addTrade(payload) {
    const res = await fetch("/api/trade/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create trade");
    return data;
}

export async function updateTrade(id, payload) {
    const res = await fetch(`/api/trade/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update trade");
    return data;
}

export async function deleteTrade(id) {
    const res = await fetch(`/api/trade/delete/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete trade");
    return data;
}
