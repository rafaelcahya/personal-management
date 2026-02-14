export async function getTradeSettings() {
    const res = await fetch("/api/trade/v1/settings", {
        cache: "no-store",
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to fetch settings");
    }

    return (
        data.settingsList || {
            initial_margin: 0,
            bi_risk_free_rate: 0,
            personal_risk_free_rate: 0,
            margin_of_error: 10,
        }
    );
}

export async function updateTradeSettings(payload) {
    const res = await fetch("/api/trade/v1/settings/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to update settings");
    }

    return data;
}

export async function createTradeSettings(payload) {
    const res = await fetch("/api/trade/v1/settings/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || "Failed to create settings");
    }

    return data;
}
