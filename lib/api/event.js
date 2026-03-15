export async function fetchEventList() {
    const res = await fetch("/api/trade/v1/event/list", {
        cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to fetch events");
    }

    return data.events || [];
}

export async function createEvent(payload) {
    const res = await fetch("/api/trade/v1/event/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to create event");
    }

    return data;
}

export async function updateEvent(id, payload) {
    const res = await fetch(`/api/trade/v1/event/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to update event");
    }

    return data;
}

export async function deleteEvent(id) {
    const res = await fetch(`/api/trade/v1/event/delete/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to delete event");
    }

    return data;
}

export async function favoriteEvent(id, isFavorite) {
    const res = await fetch(`/api/trade/v1/event/favorite/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_favorite: isFavorite }),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to favorite event");
    }

    return data;
}

export async function fetchEventSummary() {
    const response = await fetch("/api/trade/v1/event/summary");
    if (!response.ok) throw new Error("Failed to fetch event summary");
    const json = await response.json();
    return json.event;
}
