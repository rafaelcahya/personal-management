export async function addEvent(payload) {
    const res = await fetch("/api/trade/event/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to create event");
    return data;
}

export async function updateEvent(id, payload) {
    const res = await fetch(`/api/trade/event/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to update event");
    return data;
}

export async function deleteEvent(id) {
    const res = await fetch(`/api/trade/event/delete/${id}`, {
        method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Failed to delete event");
    return data;
}
