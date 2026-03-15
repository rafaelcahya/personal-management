import { decryptPassword } from "../../../lib/utils/decryptedPassword.js";

export const authTasks = (supabaseAdmin) => ({
    async getSupabaseSession({ email, password }) {
        try {
            const { data, error } = await supabaseAdmin.auth.signInWithPassword(
                { email, password },
            );
            if (error || !data.session) {
                console.error("[Auth] Failed:", error?.message || "No session");
                return null;
            }
            return data.session;
        } catch (err) {
            console.error("[Auth] Task failed:", err.message);
            return null;
        }
    },

    async createTestUser({ email, password, metadata = {} }) {
        try {
            const { data: existingUsers, error: listError } =
                await supabaseAdmin.auth.admin.listUsers();
            if (listError) return null;

            const existingUser = existingUsers?.users.find(
                (u) => u.email === email,
            );
            if (existingUser) return existingUser;

            const { data, error } = await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
                user_metadata: metadata,
            });

            if (error) return null;
            return data.user;
        } catch (err) {
            console.error("[Auth] Failed:", err.message);
            return null;
        }
    },

    log(message) {
        console.log(`[Cypress] ${message}`);
        return null;
    },

    decryptPasswordTask(encrypted) {
        return decryptPassword(encrypted);
    },
});
