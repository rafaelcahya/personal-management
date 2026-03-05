import "dotenv/config";
import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";
import readline from "readline";
import { toast } from "sonner";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function ask(question) {
    return new Promise((resolve) => rl.question(question, resolve));
}

async function seedUser() {
    try {
        const email = await ask("Enter email: ");
        const username = await ask("Enter username: ");
        const password = await ask("Enter password: ");

        const hashed = await bcrypt.hash(password, 10);

        const { error } = await supabase.from("users").insert([
            {
                email,
                username,
                password: hashed,
            },
        ]);

        if (error) {
            toast.error("❌ Failed to insert user:", error.message);
        } else {
            toast.log(`✅ User "${username}" has been successfully created`);
        }
    } catch (err) {
        toast.error("Unexpected error:", err);
    } finally {
        rl.close();
    }
}

seedUser();
