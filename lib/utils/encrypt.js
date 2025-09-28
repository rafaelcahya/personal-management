import crypto from "crypto";
import "dotenv/config";

const algorithm = "aes-256-ctr";

const rawKey = process.env.ENCRYPTION_SECRET_KEY;

const secretKey = crypto
    .createHash("sha256")
    .update(String(rawKey))
    .digest("base64")
    .substring(0, 32);

export function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
    const encrypted = Buffer.concat([
        cipher.update(text, "utf8"),
        cipher.final(),
    ]);

    return iv.toString("hex") + encrypted.toString("hex");
}

if (process.argv[2]) {
    const plain = process.argv[2];
    const encrypted = encrypt(plain);
    console.log("Encrypted:", encrypted);
}
