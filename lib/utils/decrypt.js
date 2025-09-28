import crypto from "crypto";
import "dotenv/config";

const algorithm = "aes-256-ctr";

const rawKey = process.env.ENCRYPTION_SECRET_KEY;

const secretKey = crypto
    .createHash("sha256")
    .update(String(rawKey))
    .digest("base64")
    .substring(0, 32);

function decrypt(encryptedText) {
    const ivHex = encryptedText.slice(0, 32);
    const encryptedHexWithSalt = encryptedText.slice(32);

    const iv = Buffer.from(ivHex, "hex");

    let decrypted;
    try {
        const encrypted = Buffer.from(encryptedHexWithSalt, "hex");
        const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
        decrypted = Buffer.concat([
            decipher.update(encrypted),
            decipher.final(),
        ]);
    } catch (err) {
        throw new Error("Decrypt gagal. Pastikan format dan salt sesuai.");
    }

    return decrypted.toString("utf8");
}

if (process.argv[2]) {
    const input = process.argv[2];
    try {
        const result = decrypt(input);
        console.log("Decrypted:", result);
    } catch (err) {
        console.error("Gagal decrypt:", err.message);
    }
} else {
    console.log("Usage: node decrypt.js <encryptedString>");
}
