import fs from "fs";
import path from "path";

const FIXTURE_DIR = path.resolve("cypress/fixtures");

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

export function saveFixture(filename, data) {
    const filePath = path.join(FIXTURE_DIR, filename);

    let array = [];
    if (fs.existsSync(filePath)) {
        try {
            const raw = fs.readFileSync(filePath, "utf-8");
            array = JSON.parse(raw);
        } catch (err) {
            console.warn(`Fixture ${filename} corrupted, starting fresh`);
        }
    }

    if (!Array.isArray(array)) array = [];

    array.push(data);
    fs.writeFileSync(filePath, JSON.stringify(array, null, 2));
    return array;
}

export function getRandomFixture(filename) {
    const filePath = path.join(FIXTURE_DIR, filename);

    if (!fs.existsSync(filePath)) {
        throw new Error(`Fixture ${filename} does not exist`);
    }

    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    if (!Array.isArray(data) || data.length === 0) {
        throw new Error(`${filename} is empty or invalid`);
    }

    return data[Math.floor(Math.random() * data.length)];
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
