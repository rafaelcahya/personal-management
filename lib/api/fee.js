export async function createFee(values) {
    const res = await fetch("/api/fee/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create fee");
    return data;
}

export async function updateFee(id, values) {
    const res = await fetch(`/api/fee/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update fee");
    return data;
}

export async function deleteFee(id) {
    const res = await fetch(`/api/fee/delete/${id}`, {
        method: "DELETE",
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete fee");
    return data;
}
