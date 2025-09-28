import crypto from "crypto";
import "dotenv/config";

const algorithm = "aes-256-ctr";

const rawKey = process.env.ENCRYPTION_SECRET_KEY;

const secretKey = crypto
    .createHash("sha256")
    .update(String(rawKey))
    .digest("base64")
    .substring(0, 32);

export function decryptPassword(encryptedText) {
    const ivHex = encryptedText.slice(0, 32);
    const encryptedHex = encryptedText.slice(32);

    const iv = Buffer.from(ivHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
    const decrypted = Buffer.concat([
        decipher.update(encrypted),
        decipher.final(),
    ]);

    return decrypted.toString("utf8");
}
