import { createClient } from "@supabase/supabase-js";

export function createEngine(url, key) {
    return createClient(url, key);
}
