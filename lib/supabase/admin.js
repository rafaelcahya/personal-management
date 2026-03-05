import { createClient } from "@supabase/supabase-js";

let _supabaseAdmin = null;

export function getSupabaseAdmin() {
    if (!_supabaseAdmin) {
        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !key) {
            throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
        }

        _supabaseAdmin = createClient(url, key, {
            auth: {
                autoRefreshToken: false,
                persistSession: false,
            },
        });
    }

    return _supabaseAdmin;
}
