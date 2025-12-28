import fs from "fs";
import path from "path";

export function randomString(length = 8, mode = "alphanumeric") {
    let chars = "";

    switch (mode) {
        case "text":
            chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
            break;
        case "number":
            chars = "0123456789";
            break;
        case "alphanumeric":
        default:
            chars =
                "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            break;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    return result;
}

export function saveTradeId(tradeId) {
    const filePath = path.resolve("cypress/fixtures/tradeIds.json");

    let data = [];
    if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath);
        try {
            data = JSON.parse(raw.toString());
        } catch (err) {
            data = [];
        }
    }

    data.push(tradeId);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return data;
}

export function getRandomTradeId() {
    const filePath = path.resolve("cypress/fixtures/tradeIds.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("tradeIds.json is empty or invalid");
    }

    const randomId = data[Math.floor(Math.random() * data.length)];
    return randomId;
}

export function saveFeeId(feeId) {
    const filePath = path.resolve("cypress/fixtures/feeIds.json");

    let data = [];
    if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath);
        try {
            data = JSON.parse(raw.toString());
        } catch (err) {
            data = [];
        }
    }

    data.push(feeId);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return data;
}

export function getRandomFeeId() {
    const filePath = path.resolve("cypress/fixtures/feeIds.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("feeIds.json is empty or invalid");
    }

    const randomId = data[Math.floor(Math.random() * data.length)];
    return randomId;
}

export function saveEventId(eventId) {
    const filePath = path.resolve("cypress/fixtures/eventIds.json");

    let data = [];
    if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath);
        try {
            data = JSON.parse(raw.toString());
        } catch (err) {
            data = [];
        }
    }

    data.push(eventId);

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return data;
}

export function getRandomEventId() {
    const filePath = path.resolve("cypress/fixtures/eventIds.json");
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error("eventIds.json is empty or invalid");
    }

    const randomId = data[Math.floor(Math.random() * data.length)];
    return randomId;
}

export function clearFixtureFile(filename) {
    const filePath = path.resolve(`cypress/fixtures/${filename}`);
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(filePath, "[]");
        return true;
    } catch (error) {
        console.error(`Failed to clear ${filename}:`, error);
        return false;
    }
}
